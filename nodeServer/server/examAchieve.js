const { httpRequest } = require('../../src/utils/httpRequest.js')
const connect = require('../connect/index')
const { sleep } = require('../../src/utils/index.js')
const request = require('request')

class ExamAchieve {
  constructor() {
    this.course_id = 233568387
    this.question_type = {
      '单选题': 0,
      '多选题': 1
    }
    this.answerSequenceObj = {
      'A': 0,
      'B': 1,
      'C': 2,
      'D': 3,
      'E': 4,
      'F': 5
    }
  }

  analysisMultiple(type, answer, question_answer) {
    // 解析多选题答案
    try {
      if (type === 0) return [answer]
      const fn = (answerSeq, question_answer) => {
        let _answerCharList = question_answer.split('\n')[1].split(/[a-zA-Z]\s+?\.\s+?/).filter(char => char !== '' && char)
        const result = []
        answerSeq = answerSeq.split('');
        ['A', 'B', 'C', 'D', 'E', 'F'].forEach((word, index) => {
          if (answerSeq.includes(word)) {
            result.push(_answerCharList[index])
          }
        })
        return result
      }
      return fn(answer, question_answer)
    } catch (e) {
      console.log(e)
    }
    return answer
  }

  answerXxy(question) {
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
        const { data: { result = {} } } = JSON.parse(response.body)
        if (result) {
          const [fistAnswer] = result.items
          if (fistAnswer) {
            const { question_answer: { question_type, answer_plain_text, question_plain_text } } = fistAnswer
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

  getDataBaseAnswer(questionId) {
    // 先从数据库中查答案
    return new Promise(resolve=> {
      const sql = `select answer_content from questionTable where question_id=?`;
      connect.query(sql, [questionId], (err, result=[], a)=> {
        if (!err && result.length) {
          const [{ answer_content }] = result;
          if (answer_content !== null) {
            return resolve([answer_content])
          }
        }
        resolve(false)
      })
    })
  }

  pureFunc(func, params) {

  }


  async getAnswer(questionName, questionId) {
    questionName = questionName.replace(/[\[【（\(].*?[】\]）\)]/g, '')
    let answer = '';
    let isDataBaseQuery = true;
    if (questionId) {
      answer = await this.getDataBaseAnswer(questionId)
    }
    if (!answer) {
      answer = await this.answerCx(questionName)
      isDataBaseQuery = false
    }
    if (!answer) {
      answer = await this.answerXxy(questionName)
      isDataBaseQuery = false
    }
    if (answer && !isDataBaseQuery) {
      this.setQuestionAnswer(answer, questionId);
    }
    return answer
  }

  setQuestionAnswer(answer, questionId) {
    if (!questionId) return;
    const sql = `update questionTable set answer_content=? where question_id=?`
    connect.query(sql, [answer.toString(), questionId], (err) => {
      /* if (!err) {
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
      } */
    })
  }

  getQuestionData(questionIds) {
    return new Promise(resolve=> {
      const sql = `select name, answer_list, question_type from questionTable q where q.question_id in ?`;
      connect.query(sql, [[questionIds]], (err, result)=> {
        if (!err) {
          if (result.length) {
            return resolve(result)
          }
        }
        resolve(false)
      })
    })
  }

  async getQuestionListInfo(chapterId) {
    return new Promise(resolve=> {
      const sql = `select form_data, question_id from chapterTable t where t.chapter_id=? and t.score is null and t.question_id is not null;`;
      connect.query(sql, [chapterId], (err, result)=> {
        if (!err) {
          if (result.length) {
            const [{ form_data: formData, question_id: questionId }] = result;
            return resolve({ formData, questionId })
          }
        }
        return resolve(false)
      })
    })
  }

  submitQuestion() {
    const options = {
      'method': 'POST',
      'url': 'https://mooc1.chaoxing.com/work/addStudentWorkNewWeb?_classId=74635917&courseid=233568281&token=6f9febb36d86389d7258d3d412628d97&totalQuestionNum=e0fd4ae12458a2365c8d760026d000cf&workid=26091382&cpi=151953989&jobid=work-6c55d5d040ef41ac8e553a9af0a0bebc&knowledgeid=705028180&ua=pc&formType=post&saveStatus=1&pos=d3be69813c286069e145035ee3fc&rd=0.35655039593748183&value=(807|1298)&wid=26091382&_edt=1681396148579250&version=1](https://mooc1.chaoxing.com/work/addStudentWorkNewWeb?_classId=74635917&courseid=233568281&token=6f9febb36d86389d7258d3d412628d97&totalQuestionNum=e0fd4ae12458a2365c8d760026d000cf&workid=26091382&cpi=151953989&jobid=work-6c55d5d040ef41ac8e553a9af0a0bebc&knowledgeid=705028180&ua=pc&formType=post&saveStatus=1&pos=d3be69813c286069e145035ee3fc&rd=0.35655039593748183&value=(807%7C1298)&wid=26091382&_edt=1681396148579250&version=1',
      'headers': {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'k8s=1680613646.13.54453.273515; route=0a65fa708818ad1416475328b69707fd; writenote=yes; resolution=360; videojs_id=1526392; source=""; lv=2; fid=12007; _uid=150772623; uf=b2d2c93beefa90dc21eccfe46eca2437964bdb84cfc93dcc89685ede0bf814d5030bd5d2eb1527925e3fab21f436b48430d92481d752d66f88b83130e7eb4704e0a71ffb2ea94f1f67cc3c653d1ee245db9a01fd759e1b98950488c3a56f7e415cb58b02cc14dcfd; _d=1681394063194; UID=150772623; vc=1517762353A95DAECD070BC1884EDFBC; vc2=4356840702C3DA203D33FFFF63F1C59F; vc3=EPGpJDVeT%2FieyzoEGrz2JpnV9Vu%2BJ36BCJlbzfCvV045%2FXkT6Loj5AMta%2BlG1nuZmJEANHs%2Bcxn697%2FTjWHpEC0ZiQuJMiiErHvyCFOwytrnd88TiMkvtSgbZ6l28hJ88XJMBm6NHMy62hr5Es9W9ejrLxrdFKdsIiBLgQmfDKQ%3D30a512a4e6cbd23d3f280fbab0d31793; cx_p_token=c11604e5518d7d2929c4d642c4c6e4a3; xxtenc=32d3e0cb70b51761ee76d6e3cc406f5b; DSSTASH_LOG=C_38-UN_488-US_150772623-T_1681394063196; spaceFid=12007; spaceRoleId=""; jrose=35AF94EC8BDF7242F91199E8845FCA5F.mooc-p3-1004194731-m5774; jrose=B91A1FECB3680AD05685D7D5FB74C02E.mooc-p3-851758002-pbqfg',
        'Origin': '[https://mooc1.chaoxing.com](https://mooc1.chaoxing.com)',
        'Referer': '[https://mooc1.chaoxing.com/work/doHomeWorkNew?courseId=233568281&workAnswerId=51694491&workId=26091382&api=1&knowledgeid=705028180&classId=74635917&oldWorkId=6c55d5d040ef41ac8e553a9af0a0bebc&jobid=work-6c55d5d040ef41ac8e553a9af0a0bebc&type=&isphone=false&submit=false&enc=9aaedd7ed3cbe361fc0d4e93363e680a&cpi=151953989](https://mooc1.chaoxing.com/work/doHomeWorkNew?courseId=233568281&workAnswerId=51694491&workId=26091382&api=1&knowledgeid=705028180&classId=74635917&oldWorkId=6c55d5d040ef41ac8e553a9af0a0bebc&jobid=work-6c55d5d040ef41ac8e553a9af0a0bebc&type=&isphone=false&submit=false&enc=9aaedd7ed3cbe361fc0d4e93363e680a&cpi=151953989)',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"'
      },
      body: 'pyFlag=&courseId=233568281&classId=74635917&api=1&workAnswerId=51694491&answerId=51694491&totalQuestionNum=e0fd4ae12458a2365c8d760026d000cf&fullScore=100.0&knowledgeid=705028180&oldSchoolId=&oldWorkId=6c55d5d040ef41ac8e553a9af0a0bebc&jobid=work-6c55d5d040ef41ac8e553a9af0a0bebc&workRelationId=26091382&enc=&enc_work=6f9febb36d86389d7258d3d412628d97&userId=150772623&cpi=151953989&workTimesEnc=&randomOptions=false&answer402383052=D&answertype402383052=0&answer402383051=D&answertype402383051=0&answer402383053=A&answertype402383053=0&answer402383054=C&answertype402383054=0&answer402383055=true&answertype402383055=3&answer402383056=false&answertype402383056=3&answerwqbid=402383052%2C402383051%2C402383053%2C402383054%2C402383055%2C402383056%2C'

    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });

  }

  async startAnswering(chapterId) {
    const data = await this.getQuestionListInfo(chapterId);
    if (data) {
      const { formData, questionId } = data;
      const answerList = [];
      const ids = questionId.split(',');
      const allQuestion = await this.getQuestionData(ids);
      if (allQuestion && allQuestion.length) {
        for (const i in allQuestion) {
          const { name, answer_list, question_type } = allQuestion[i];
          const answer = await this.getAnswer(name)
          console.log('*****答案：', name, ':', answer)
          await sleep(1)
        }
      }
    }
  }
}
const examAchieve = new ExamAchieve()
/* examAchieve.getAnswer('“咔”和“喃”是一种歌中有舞、舞中有歌的表演艺术').then(data => {
  console.log(data)
}) */

examAchieve.startAnswering(705028206);

module.exports = ExamAchieve
