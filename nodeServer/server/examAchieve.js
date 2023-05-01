const { httpRequest } = require('../../src/utils/httpRequest.js')
const connect = require('../connect/index')
const { sleep } = require('../../src/utils/index.js')
const request = require('request')
const { compareAnswer } = require('../examServer/utils')
const answerUtil = require('../examServer/answer')
const { logger } = require('../utils')


class ExamAchieve {
  constructor() {
  }

  setQuestionAnswer(answer_text, answer_value, questionId) {
    if (!questionId) return;
    const sql = `update questionTable set answer_text=?, answer_value=? where question_id=?`
    connect.query(sql, [answer_text, answer_value, questionId], (err) => err && console.log(err, sql))
  }

  getQuestionData(questionIds) {
    return new Promise(resolve=> {
      const sql = `select * from questionTable q where q.question_id in ?`;
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
      const sql = `select form_data, question_id, cpi from chapterTable t where t.chapter_id=? and t.score is null and t.question_id is not null;`;
      connect.query(sql, [chapterId], (err, result)=> {
        if (!err) {
          if (result.length) {
            const [{ form_data: formData, question_id: questionId, cpi }] = result;
            return resolve({ formData, questionId, cpi })
          }
        }
        return resolve(false)
      })
    })
  }

  submitQuestion(formData, chapterId, cpi) {
    const defaultBody = { pyFlag: '', api: 1, knowledgeid: 'chapterId', enc: '', cpi: ''  }
    formData = {"classId":"74635917","courseid":"233568281","token":"bac40ac8da6603c50239ad22f46d69b8","totalQuestionNum":"fa7b891349fa608eae0b751926d519c9","workAnswerId":"51714219","answerId":"51714219","fullScore":"100.0","oldSchoolId":"","oldWorkId":"647aaa40b6ac4a358794c7d6bc8602b0","jobid":"work-647aaa40b6ac4a358794c7d6bc8602b0","workRelationId":"26219074","enc_work":"bac40ac8da6603c50239ad22f46d69b8","userId":"150772623","workTimesEnc":"","randomOptions":"false"}
    const queryParams = {
      _classId: '', courseid: '', token: '', totalQuestionNum: '',
      workid: '', cpi, jobid: '', knowledgeid: chapterId, ua: 'pc',
      formType: 'post', saveStatus: 1, pos: '', rd: '', value: '',
      wid: '', _edt: new Date().getTime(), version: 1
    }



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

  getCorrectAnswer(answer, answerList, answerMap, question_type, qs_id, qs_name) {
    // 获取正确答案 对比题库答案和考试答案，排除干扰找到正确的答案
    answerList = JSON.parse(answerList)
    const answerInfo = {
      id: '', answer_text: [], answer_value: [], qs_name, qs_id
    };
    const judgmentQuestion = { 'true': '正确', 'false': '错误' };
    for (const n in answer) {
      for (const i in answerList) {
        let { answerName, answerId, answerVal } = answerList[i];
        if (question_type === '3') { // 判断题
          answerName = answerVal;
        }
        answerName = judgmentQuestion[answerName.replace(' ', '')] || answerName;
        if (compareAnswer(answer[n], answerName)) {
          answerInfo.answer_text.push(answerName)
          answerInfo.answer_value.push(answerVal)
          answerInfo.ids = answerId
          break
        }
      }
    }
    return answerInfo;
  }

  updateQusAnswer(answer) {
    // 更新问题答案
  }
  // compareAnswer

  async startAnswering(chapterId) {
    const data = await this.getQuestionListInfo(chapterId);
    if (data) {
      const { formData, questionId, cpi } = data;
      const answerMap = {};
      const ids = questionId.split(',');
      const allQuestion = await this.getQuestionData(ids);
      if (allQuestion && allQuestion.length) {
        for (const i in allQuestion) {
          const { name, answer_list, question_type, question_id } = allQuestion[i];
          const qs_name = name.replace(/ /g, ' ')
          let answer = await answerUtil.getAnswer(qs_name, question_id, question_type)
          const { answer_text, answer_value } = this.getCorrectAnswer(answer, answer_list, answerMap, question_type, question_id, qs_name);
          if (!answer_value.length) {
            logger.debug(`未找到答案chapterId:=> ${chapterId}--问题：${qs_name}-${question_id},参考答案为：${answer}`)
            continue;
          }
          console.log(`******问题:${qs_name}答案为：${answer_text}-${answer_value}`)
          this.setQuestionAnswer(JSON.stringify(answer_text), JSON.stringify(answer_value), question_id);
          await sleep(1)
        }
        // console.log(answerMap)
        // this.submitQuestion(formData, chapterId, cpi);
      }
    }
  }
}
const examAchieve = new ExamAchieve()
/*  examAchieve.answerXxy('Paraphrase This organization may succeed marvelously at what it wants to do, but what it wants to do may not be all that important. Which of the following best explains the meaning of the original sentence?', 0).then(data => {
  console.log('answerXxy：', data)
})

examAchieve.answerCx('Paraphrase This organization may succeed marvelously at what it wants to do, but what it wants to do may not be all that important. Which of the following best explains the meaning of the original sentence?').then(res=> {
  console.log('answerCx:', res)
}) */

// examAchieve.startAnswering(705056602);

module.exports = ExamAchieve


