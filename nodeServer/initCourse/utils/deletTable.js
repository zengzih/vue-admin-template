const connection = require('../../../nodeServer/initCourse/sql/index')
const { resolve } = require('vue-count-to/webpack.config')

const obj = {};

const insert = (values)=> {
  return new Promise(resolve=> {
    const sql = `insert into chapterTable(course_id, chapter_id, chapter_index, chapter_name, catalog_name, catalog_index, cpi, clazzid, attachments, user_id, is_passed) values ?
            on duplicate key update is_passed = values(is_passed), attachments=values(attachments);`
    connection.query(sql, [values], (err)=> {
      if (!err) {
        return resolve(true);
      }
      resolve(false)
    })
  })
}

const del = async (chapter_id, user_id)=> {
  return new Promise(resolve=> {
    const sql = `delete from chapterTable where chapter_id=? and user_id=?`;
    connection.query(sql, [chapter_id, user_id], (err)=> {
      if (!err) {
        return resolve(true)
      }
      resolve(false)
    })
  })
}
const func = ()=> {
  const sql = `select * from chapterTable where chapter_id=705056603 and user_id=150772599`;
  connection.query(sql, async (err, result)=> {
    for (const i in result) {
      const { user_id, chapter_id } = result[i];
      const primaryKey = `${user_id}_${chapter_id}`;
      if (obj[primaryKey]) {
        const res = await del(chapter_id, user_id);
        if (res) {
          await insert([obj[primaryKey]])
          continue
        }
      }
      obj[primaryKey] = result[i];
    }
  })
}

func();
