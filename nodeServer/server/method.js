const connect = require('../connect/index')
const encrypt = require('../../src/utils/encryptByAES.js')
const { httpRequest } = require('../../src/utils/httpRequest.js')
const { sleep } = require('../../src/utils/index.js')
const md5 = require('js-md5')
// const wsServer = require('./websocketServer.js')

class RequestMethod {
  constructor() {
    this.connect = connect
    this.ws = null
  }

  getEnc({ clazzId, userid, jobid, objectId, playingTime, duration }) {
    const enc = `[${clazzId}][${userid}][${jobid}][${objectId}][${playingTime * 1000}][d_yHJ!$pdA~5][${(duration * 1000).toString()}][0_${duration}]`
    console.log('enc:', enc)
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
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
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
          }
          resolve(data)
        } catch (e) {
          reject(res)
        }
      })
    })
  }

  async playVideo(query) {
    const { duration, chapter_id } = query
    let timeCount = 0
    let timer = null
    const res = await this.applyLoopVideo(query)
    if (res.isPassed) return Promise.resolve(res)
    /* const handleLoop = async(query) => {
      await sleep(60)
      query._t = new Date().getTime()
      if (timeCount >= Number(duration)) {
        query.playingTime = duration
        query.isdrag = 4
        query.enc = this.getEnc(query)
        console.log('------end------')
        return this.applyLoopVideo(query)
      }
      timeCount += 60
      query.playingTime = timeCount
      query.enc = this.getEnc(query)
      console.log('-----playingTime:', timeCount)
      this.applyLoopVideo(query)
      handleLoop(query)
    }
    handleLoop(query)*/
    timer = setInterval(async() => {
      query._t = new Date().getTime()
      timeCount += 1
      if (timeCount >= Number(duration)) {
        console.log('-----end-----', duration)
        query.playingTime = duration
        query.isdrag = 4
        query.enc = this.getEnc(query)
        clearInterval(timer)
        return this.applyLoopVideo(query)
      }
      query.playingTime = timeCount
      query.enc = this.getEnc(query)
      const data = await this.applyLoopVideo(query)
      if (data.isPassed) {
        this.updateChapterStatus(chapter_id)
        clearInterval(timer)
      }
    }, 1000)
  }
}
const requestMethod = new RequestMethod()
// requestMethod.login({ uname: 19392948031, password: 'lj200204171693' })

module.exports = requestMethod

