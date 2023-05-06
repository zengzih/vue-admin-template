const connection = require("../../connect/index");
const insertCourseTable = (values)=> {
    const sql = 'insert into courseTable(course_id, course_name, clazz_id, cpi, link, course_cover) values ? on duplicate key update course_id = values(course_id)';
    connection.query(sql, [values], (err=> err && console.log(err, sql)));
};

const insertChapterTable = (values)=> {
    const sql = `insert into chapterTable(course_id, chapter_id, chapter_type, chapter_name, catalog_name, cpi, clazzid, attachments, user_id, is_passed, form_data, question_id) values ?
               on duplicate key update
               is_passed = values(is_passed),
               chapter_name = values(chapter_name),
               attachments = values(attachments),
               form_data = values(form_data),
               question_id = values(question_id)`;
    connection.query(sql, [values], (err=> err && console.log(err, sql)))
};

const insetUser = (values)=> {
    const sql = 'insert into user(user_id, chapter_id, chapter_name, is_passed) values ? on duplicate key update user_id, chapter_id = values(user_id, chapter_id)';
    connection.query(sql, [values], (err=> err && console.log(err, sql)))
}

const insertDecryptCharTable = (values)=> {
    const sql = `insert into decryptcharTable(encryption, decrypt, uni_code, chapter_id) values ? on duplicate key update decrypt = values(decrypt)`
    connection.query(sql, [values], (err=> err && console.log(err, sql)))
};

const insertQuestionTable = (values, chapter_id)=> {
    const sql = `insert into questionTable(question_id, name, answer_list, question_type) values ? on duplicate key update name = values(name),answer_list=values(answer_list)`
    connection.query(sql, [values], (err)=> err && console.log(err, sql, chapter_id));
}

const updateChapterQuestionId = (values, chapterId)=> {
    const sql = `update chapterTable set question_id=json_array_append(question_id, '$', CAST(? AS json)) where chapter_id=?`;
    connection.query(sql, [values, chapterId], (err)=> err && console.log(err, sql));
}

const updateChapterQuestionForm = (values, chapterId, userId)=> {
  // const sql = `insert into chapterTable(chapter_id, form_data) values ? on duplicate key update form_data = values(form_data)`;
  const sql = `update chapterTable set form_data=json_array_append(form_data, '$', CAST(? AS json)) where chapter_id=? and user_id=?`;
  connection.query(sql, [values, chapterId, userId], (err=> err && console.log(err, sql)))
};

const updateChapterScore = (values, chapterId, userId)=> {
    // 更新当前章节的考试分数
    const sql = `update chapterTable set score=?, is_passed=1 where chapter_id=? and user_id=?`;
    connection.query(sql, [values, chapterId, userId], (err=> err && console.log(err, sql)));
}

const insertUserTable = (values)=> {
  const sql = `insert into user(phone, password, user_name, user_id) values ? on duplicate key update user_id = values(user_id)`;
  connection.query(sql, [values], (err=> err && console.log(err, sql)))
}

const updateUserCourseId = (user_id, values)=> {
  connection.query(`select course_id from user where user_id=?`, [user_id], (err, result)=> {
    if (!err) {
      const courseIds = [values];
      if (result) {
        const [{ course_id }] = result;
        if (course_id) {
          courseIds.push(...JSON.parse(course_id))
        }
      }
      const ids = JSON.stringify(Array.from(new Set(courseIds)));
      const sql = 'update user set course_id=? where user_id=?';
      connection.query(sql, [ids, user_id], (err=> err && console.log(err, sql)))
    }
  })
}

module.exports = {
    insetUser,
    insertUserTable,
    insertCourseTable,
    insertChapterTable,
    updateChapterScore,
    updateUserCourseId,
    insertQuestionTable,
    updateChapterQuestionId,
    insertDecryptCharTable,
    updateChapterQuestionForm,
}
