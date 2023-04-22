const connection = require("./index");
const insertCourseTable = (values)=> {
    const sql = 'insert into courseTable(course_id, course_name, clazz_id, cpi, link, course_cover, user_id) values ? on duplicate key update course_id = values(course_id)';
    connection.query(sql, [values], (err)=> { console.log(err) });
};

const insertChapterTable = (values)=> {
    const sql = 'insert into chapterTable(course_id, chapter_id, chapter_index, chapter_name, catalog_name, catalog_index, cpi, clazzid, attachments, user_id, is_passed) values ? on duplicate key update is_passed = values(is_passed)';
    connection.query(sql, [values], (err)=> {
        console.log(err)
    })
};

const insetUser = (values)=> {
    const sql = 'insert into user(user_id, chapter_id, chapter_name, is_passed) values ? on duplicate key update user_id, chapter_id = values(user_id, chapter_id)';
    connection.query(sql, [values], (err)=> { console.log(err) })
}

const insertDecryptCharTable = (values)=> {
    const sql = `insert into decryptcharTable(encryption, decrypt, uni_code, chapter_id) values ? on duplicate key update decrypt = values(decrypt)`
    connection.query(sql, [values], (err)=> {
        console.log('********sql:', err, sql)
    })
};

const insertQuestionTable = (values)=> {
    const sql = `insert into questionTable(question_id, name, answer_list, question_type) values ? on duplicate key update name = values(name),answer_list=values(answer_list)`
    connection.query(sql, [values], (err)=> {
        console.log('******sql:', err, sql)
    });
}

const updateChapterQuestionId = (values, chapterId)=> {
    const sql = `update chapterTable set question_id=? where chapter_id=?`;
    connection.query(sql, [values, chapterId], (err)=> {
        console.log('******sql:', err, sql)
    });
}

const updateChapterQuestionForm = (values, chapterId)=> {
  // const sql = `insert into chapterTable(chapter_id, form_data) values ? on duplicate key update form_data = values(form_data)`;
  const sql = `update chapterTable set form_data=? where chapter_id=?`;
  connection.query(sql, [values, chapterId], (err=> {
      console.log('******sql:', err, sql)
  }))
};

const updateChapterScore = (values, chapterId)=> {
    // 更新当前章节的考试分数
    const sql = `update chapterTable set score=? where chapter_id=?`;
    connection.query(sql, [values, chapterId], (err)=> {
        console.log('******sql:', err, sql)
    });
}

const insertUserTable = (values)=> {
  const sql = `insert into user(phone, password, user_name, user_id) values ? on duplicate key update user_id = values(user_id)`;
  connection.query(sql, [values], (err)=> {
    console.log('******sql:', err, sql)
  })
}

module.exports = {
    insetUser,
    insertUserTable,
    insertCourseTable,
    insertChapterTable,
    updateChapterScore,
    insertQuestionTable,
    updateChapterQuestionId,
    insertDecryptCharTable,
    updateChapterQuestionForm,
}
