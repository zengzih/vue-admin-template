const { httpRequest } = require('../../src/utils/httpRequest.js')
const connect = require('../connect/index')
const { sleep } = require('../../src/utils/index.js')
const request = require('request')

class ExamAchieve {
  constructor() {
    console.log(233)
    this.course_id = 233568387
  }

  getAnswer(question) {
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        url: 'https://cx.icodef.com/wyn-nb?v=4',
        headers: {
          'authority': 'cx.icodef.com',
          'accept': '*/*',
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
          'authorization': '',
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'none',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
        },
        body: `question=${question}`
      }, (err, res) => {
        if (!err) {
          console.log('res:', res.body)
          const data = JSON.parse(res.body)
          data.forEach(({ result }) => {
            result.forEach(({ correct, topic }) => {
              correct.forEach(({ content, option }) => {
                resolve({ content, option, data })
              })
            })
          })
        } else {
          return reject(false)
        }
      })
    })
  };

  getAwaitExam(course_id = 233568387) {
    const sql = `select question_id, form_data from chapterTable where course_id=? and score is null limit 1`
    connect.query(sql, [course_id], (err, result) => {
      if (!err) {
        console.log(result)
        if (result.length) {
          const [{ question_id, form_data }] = result
          const sql = `select * from questionTable where question_id in ?`
          connect.query(sql, [[question_id.split(',')]], async(err, result) => {
            if (!err) {
              const questionNames = result.map(({ name }) => (name))
              for (const key in questionNames) {
                console.log('questionNames[key]:', questionNames[key])
                const res = await this.getAnswer(questionNames[key])
                console.log(res)
              }
            }
          })
        }
      }
    })
  }
}

const examAchieve = new ExamAchieve()
examAchieve.getAnswer('【单选题】越南人自己发明的文字被称为()。')

// const question = encodeURIComponent('《诸蕃志》是南宋()所著。')
// console.log(question)

/*method: 'POST',
	url: 'http://api.zhizhuoshuma.cn/api/cx',
	headers: {
	'Content-type': 'application/x-www-form-urlencoded'
},
data: 'question=' + encodeURIComponent(setting.TiMu[0]) + '&type=' + setting.TiMu[1] + '&id=' + $('#paperId').val(),*/
/*request({
	url: 'http://cx.icodef.com/wyn-nb?v=4',
	headers: {
		'Content-type': 'application/x-www-form-urlencoded'
	},
	method: 'POST',
	form: 'question=' + question
	// form: { question: '新时期要注重选拔任用（）、（）、（）、（）、（）的干部，对政治不合格的干部实行“一票否决”，已经在领导岗位的坚决调整。' }
}, (err, result)=> {
	console.log(err, result)
})*/

module.exports = ExamAchieve
