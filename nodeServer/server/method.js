const connect = require('../connect/index')
const encrypt = require('../../src/utils/encryptByAES.js')
const { httpRequest } = require('../../src/utils/httpRequest.js')
const { sleep } = require('../../src/utils/index.js')
const md5 = require('js-md5')
// const { playChapterVideo } = require('@/apis')
// const { getAnswerStatus } = require('@/apis')
// const wsServer = require('./websocketServer.js')

class RequestMethod {
  constructor() {
    this.connect = connect
    this.ws = null
    this.max = 5
    this.currentNum = 0
  }

  getEnc({ clazzId, userid, jobid, objectId, playingTime, duration }) {
    const enc = `[${clazzId}][${userid}][${jobid}][${objectId}][${playingTime * 1000}][d_yHJ!$pdA~5][${(duration * 1000).toString()}][0_${duration}]`
    // console.log('enc:', enc)
    return md5(enc)
  }

  getAllCourse(userId, callback) {
    const sql = `select c.course_name, c.course_id, c.clazz_id, c.cpi, c.link, c.course_cover, c.user_id, count(*) as chapterCount, sum(c2.is_passed > 0) as isPassedCount from coursetable c left join chaptertable c2 on c.course_id = c2.course_id group by c.course_id`
    connect.query(sql, (err, result) => {
      if (!err) {
        callback(result)
      }
    })
  }

  login({ uname, password }) {
    const data = {
      'fid': 12007,
      'uname': encrypt(uname),
      'password': encrypt(password),
      'refer': 'http%3A%2F%2Fi.mooc.chaoxing.com',
      'validate': '',
      't': 'true',
      'doubleFactorLogin': '0',
      'independentId': '0'
    }

    return httpRequest(`login`, data, 'post', {
      'Referer': 'https://passport2.chaoxing.com/login?loginType=4&newversion=true&fid=12007&newversion=true&refer=http://i.mooc.chaoxing.com',
      'Cookie': 'route=3a66e47c0ac92560e5c67cd5e1803201; JSESSIONID=09B612137BD009C353A48DC4112F09F0; fanyamoocs=11401F839C536D9E; fid=12007; isfyportal=1',
      'Host': 'passport2.chaoxing.com',
      'Content-Type': 'application/x-www-m-urlencoded; charset=UTF-8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      'Origin': 'https://passport2.chaoxing.com',
      'Accept': 'application/json, text/javascript, */*; q=0.01'
    })
  }

  getChapterInfo({ course_id }, callback) {
    const sql = `select * from chapterTable where course_id=${course_id}`
    connect.query(sql, (err, result) => {
      if (!err) {
        callback(result)
      }
    })
  }

  getChapter({ course_id }, callback) {
    const sql = `select * from chapterTable c where c.course_id=${course_id}`
    connect.query(sql, (err, result) => {
      if (!err) {
        return callback(result)
      }
      callback([])
    })
  }

  getAnswerStatus(query) {
    return httpRequest('answerStatus', query, 'get')
  }

  initDataWithViewerV2(query) {
    return httpRequest('initData', query, 'get')
  }

  updateChapterStatus(chapter_id) {
    connect.query(`update chapterTable set is_passed = 1 where chapter_id = ${chapter_id}`)
  }

  commitExam() {
    // 视频完成之后做作业
    const query = {
      _classId: '',
      courseid: '',
      token: '', // ?
      totalQuestionNum: '',
      workid: '',
      cpi: '',
      jobid: '',
      knowledgeid: '',
      ua: 'pc',
      formType: 'post',
      saveStatus: 1,
      pos: '', // ?
      rd: '', // ?
      value: '',
      wid: '',
      _edt: '',
      versio: 1
    }
    console.log(query)
  }

  applyLoopVideo(query) {
    return new Promise((resolve, reject) => {
      httpRequest('playVideo', query, 'get').then(res => {
        try {
          const data = JSON.parse(res)
          const { isPassed } = data
          if (isPassed === undefined) {
            return reject(data)
          }
          if (isPassed) {
            const { chapter_id } = query
            this.updateChapterStatus(chapter_id)
            this.commitExam(chapter_id)
          }
          resolve(data)
        } catch (e) {
          reject(res)
        }
      })
    })
  }

  async getCourseUserName(user_id, course_id) {
    // 用户名、课程名
    return new Promise(resolve => {
      /*const sql = `select c.course_name, u.user_name from
                 courseTable c inner join
                 user u on c.course_id=u.course_id and c.course_id=? and u.user_id=?`
      connect.query(sql, [course_id, user_id], (err, result)=> {
        if (!err && result) {
          const [{ course_name, user_name }] = result;
          return resolve({ course_name, user_name })
        }
        resolve({})
      })*/
      connect.query('select course_id, course_name from courseTable where course_id=?', [course_id], (err, result)=> {
        if (!err && result.length) {
          const [{ course_id, course_name }] = result;
          connect.query('select course_id, user_name from user where user_id=?', [user_id], (err, result)=> {
            if (!err && result.length) {
              let [{course_id: courseIds, user_name }] = result;
              courseIds = JSON.parse(courseIds)
              if (courseIds.includes(course_id.toString())) {
                return resolve({ course_name, user_name })
              }
            }
          })
        }
      })

    })
  }

  updateRequestPar(query) {
    query._t = new Date().getTime()
    const { playingTime } = query;
    query.playingTime = playingTime + 1;
    query.enc = this.getEnc(query)
    return query;
  }

  async printPlayProgress({ playingTime, duration, course_id }, chapter_name, user_id, playStatus) {
    const { user_name, course_name } = await this.getCourseUserName(user_id, course_id)
    if (playStatus) {
      if (this.currentNum === this.max) {
        return console.log(`**************${user_name}今日所有任务已完成**************`)
      }
      console.log(`************任务：${user_name}--${course_name}--${chapter_name}已完成*************`)
      return console.log(`********************当前任务${this.currentNum}/${this.max},10s之后再执行**************`)
    }
    console.log(`**************任务：${user_name}--${course_name}-${chapter_name}***${playingTime}/${duration}**********`)
  }

  async recursion(query, chapter_name, user_id, resolve) {
    const { chapter_id } = query;
    const { isPassed } = await this.applyLoopVideo(query)
    await this.printPlayProgress(query, chapter_name, user_id, isPassed);
    this.currentNum += 1
    if (isPassed) {
      this.updateChapterStatus(chapter_id)
      await sleep(10)
      resolve(true);
      // this.start(user_id)
    } else {
      await sleep(5)
      await this.recursion(this.updateRequestPar(query), chapter_name, user_id, resolve)
    }
  }

  async playVideo(query, chapter_name, user_id) {
    return new Promise(resolve => this.recursion(query, chapter_name, user_id, resolve))
  }

  start(user_id) {
    connect.query(`select * from chapterTable where is_passed=0 and user_id=? limit 1`, [user_id], async(err, result) => {
      if (!err && result && result.length) {
        const [{ cpi, attachments = '{}', course_id, user_id: userid, clazzid: clazzId, chapter_id, chapter_name }] = result
        const { attachments: attachmentsList } = JSON.parse(attachments)
        for (const i in attachmentsList) { // 一个章节下面有多个视频的情况
          const { objectId, otherInfo, jobid, type } = attachmentsList[i];
          if (!type) { // type: document video
            continue;
          }
          const data = await this.getAnswerStatus({ cpi, objectId, k: 12007, flag: 'normal', _dc: new Date().getTime() })
          const { dtoken, status, duration } = JSON.parse(data)
          if (status === 'success') {
            const params = { cpi, dtoken, clipTime: `0_${duration}`, duration, chapter_id, playingTime: 0, objectId, otherInfo, course_id, clazzId, jobid, userid, isdrag: 3, view: 'pc', dtype: 'Video', _t: new Date().getTime() }
            await this.playVideo({ ...params, enc: this.getEnc(params) }, chapter_name, user_id).then(res => console.log(res))
          }
        }
        this.start(user_id)
      }
    });
  }
}
const requestMethod = new RequestMethod()
// requestMethod.login({ uname: 19392948031, password: 'lj200204171693' })

// requestMethod.getIncompleteChapter()


module.exports = requestMethod

