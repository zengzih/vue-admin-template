const connect = require('../connect/index')
const encrypt = require('../../src/utils/encryptByAES.js')
const { httpRequest } = require('../../src/utils/httpRequest.js')
const { formatSeconds } = require('../../src/utils/index.js')
const md5 = require('js-md5')
// const wsServer = require('./websocketServer.js')

class RequestMethod {
  constructor() {
    this.connect = connect
    this.ws = null
  }

  getEnc({ clazzId, userid, jobid, objectId, playingTime, duration }) {
    const enc = `[${clazzId}][${userid}][${jobid}][${objectId}][${playingTime * 1000}][d_yHJ!$pdA~5][${(duration * 1000).toString()}][0_${duration}]`
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

  playVideo(query) {
    const { chapter_id, duration, isdrag } = query
    let timer = null
    return new Promise((resolve, reject) => {
      httpRequest('playVideo', query, 'get').then(res => {
        try {
          const data = JSON.parse(res)
          console.log('playVideo:', res)
          const { isPassed } = data
          if (isPassed === undefined) {
            return reject(data)
          }
          /* if (isPassed === false && Number(isdrag) === 3) {
            clearTimeout(timer)
            timer = setTimeout(() => {
              query.playingTime = Number(duration)
              query.isdrag = 4
              query.enc = this.getEnc(query)
              query._t = new Date().getTime()
              console.log('***********时间到开始调用,总时长:', formatSeconds(duration))
              clearTimeout(timer)
              this.playVideo(query)
            }, 200 * 1000)
          } */
          if (isPassed) {
            connect.query(`update chapterTable set is_passed = 1 where chapter_id = ${chapter_id}`)
          }
          resolve(data)
        } catch (e) {
          reject(res)
        }
      })
    })
  }
}
// Request URL: https://mooc1.chaoxing.com/ananas/status/20ae62a0db8e935c1278314eb2076a5b?k=12007&flag=normal&_dc=1680955927508获取37aa562207daa99a23e83f8d5c34b033

const requestMethod = new RequestMethod()

// requestMethod.login({ uname: 19392948031, password: 'lj200204171693' })

module.exports = requestMethod

