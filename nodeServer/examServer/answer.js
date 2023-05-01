const request = require('request')
const connect = require('../connect')

class AnswerUtil {
  constructor() {
    this.question_type = {
      '单选题': 0,
      '多选题': 1
    }
  }

  analysisMultiple(type, answer, question_answer) {
    // 解析多选题答案
    try {
      // 直接是答案不是abcd
      const fn = (answerSeq, question_answer) => {
        let _answerCharList = question_answer.split('\n')[1].replace(/\s/g, '').split(/[a-zA-Z]\./).filter(char => char !== '' && char)
        if (!/^[A-Z]+$/.test(answer) && answer.length < 5) {
          return [answer]
        }
        let result = []
        if (/^[A-Z]+$/.test(answer)) {
          const answerList = answer.split(''); // 针对答案都是ABCD这种
          ['A', 'B', 'C', 'D', 'E', 'F'].forEach((word, index) => {
            if (answerList.includes(word)) {
              result.push(_answerCharList[index])
            }
          })
        } else {
          result = answer.split('\n')
        }
        return result
      }
      return fn(answer, question_answer)
    } catch (e) {
      console.log(e)
    }
    return answer
  }

  answerXxy(question, questionType=0) {
    return new Promise((resolve) => {
      const options = {
        'method': 'POST',
        'url': 'https://xxy.51xuexiaoyi.com/el/wx/sou/search',
        'headers': {
          'Host': 'xxy.51xuexiaoyi.com',
          'wx-open-id': 'oKtmq5V1_mdhSNLYK2r87zDn8Bvg',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF XWEB/6763',
          'content-type': 'application/json',
          'accept': 'application/json',
          'x-use-ppe': '',
          'xweb_xhr': '1',
          'referer': 'https://servicewechat.com/wx7436885f6e1ba040/6/page-frame.html',
          'x-tt-env': '',
          'sec-fetch-site': 'cross-site',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'accept-language': 'zh-CN,zh'
        },
        body: JSON.stringify({
          'query': question,
          'channel': 1
        })
      }
      request(options, (error, response) => {
        if (error) throw new Error(error)
        if (/登录.*过期.*重启微信/.test(response.body)) {
          return resolve(false)
        }
        const { data: { result = {} } } = JSON.parse(response.body)
        if (result) {
          // /const [fistAnswer] = result.items
          let question_type, answer_plain_text, question_plain_text;
          for (const i in result.items) {
            const { question_answer } = result.items[i];
            if (this.question_type[question_answer.question_type] === questionType) {
              ({ question_type, answer_plain_text, question_plain_text } = question_answer)
              break
            }
          }
            if (answer_plain_text) {
            const answer = this.analysisMultiple(this.question_type[question_type], answer_plain_text, question_plain_text)
            return resolve(answer)
          }
        }
        resolve(false)
      })
    })
  }

  answerCx(question) {
    return new Promise((resolve) => {
      request({
        method: 'POST',
        url: 'https://cx.icodef.com/wyn-nb?v=4',
        headers: {
          'authority': 'cx.icodef.com',
          'accept': '*/*',
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
          'authorization': 'LnQqHzXAtbXVqBpf',
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'none',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
        },
        body: `question=${encodeURIComponent(question)}`
      }, (err, res) => {
        if (!err) {
          const { code, data } = JSON.parse(res.body)
          if (code === 1) {
            const answer = data.split('#');
            if (answer.length) return resolve(answer)
          }
        }
        resolve(false)
      })
    })
  }

  answerJszkk(question) {
    return new Promise(resolve => {
      request({
        methods: 'get',
        url: `https://study.jszkk.com/api/open/seek?q=${encodeURIComponent(question)}`,
        headers: {
          'Content-Type': "application/json; charset=utf-8",
          'Authorization': 'j95IYamm9jYcciQ5aAUSHaQlOVQ3OdTGn0rHwrl6xWQGtdXvhUVg2pgislR0Sg'
        }
      }, (err, result)=> {
        if (err) return resolve(false);
        const { code, data } = JSON.parse(result.body)
        if (code === 200) {
          return resolve(data.answer);
        }
        resolve(false)
      })
    })
  }

  getDataBaseAnswer(questionId) {
    // 先从数据库中查答案
    return new Promise(resolve=> {
      const sql = `select answer_content from questionTable where question_id=?`;
      connect.query(sql, [questionId], (err, result=[], a)=> {
        if (!err && result.length) {
          const [{ answer_content }] = result;
          if (answer_content !== '' && answer_content !== null) {
            return resolve([answer_content])
          }
        }
        resolve(false)
      })
    })
  }

  async getAnswer(questionName, questionId, questionType) {
    questionName = questionName.replace(/[\[【（\(].*?[】\]）\)]/g, '')
    let answer = [];
    /* if (questionId) {
      answer = await this.getDataBaseAnswer(questionId)
      if (answer) {
        answer = JSON.parse(answer)
      }
    } */
    if (!answer || !answer.length) {
      answer = await this.answerCx(questionName)
    }
    if (!answer || !answer.length) {
      answer = await this.answerJszkk(questionName)
    }
    if (!answer || !answer.length) {
      answer = await this.answerXxy(questionName, questionType)
    }
    return answer
  }

}
const answerUtil = new AnswerUtil()
answerUtil.getAnswer('Qualifiers can play an important role in your writing, giving your readers clues about how confident you feel about the information you’re presenting.', ).then(res=> {
  console.log(res)
})
module.exports = answerUtil
