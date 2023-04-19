const request = require('request')
const cheerio = require('cheerio')
const connection = require('./sql/index')
const { workerData, parentPort } = require('worker_threads')
const { queryParams, getQueryParams, sleep } = require('./utils')
const { httpRequest } = require('../../src/utils/httpRequest')
const {
  insertCourseTable,
  insertChapterTable,
  insertUserTable,
  insertDecryptCharTable,
  insertQuestionTable,
  updateChapterQuestionId,
  updateChapterQuestionForm,
  updateChapterScore
} = require('./sql/insert')
const { base64StrToFont } = require('./utils')
const { login } = require('../server/method')

const getStudyInfo = (query) => {
  const url = queryParams('https://mooc1.chaoxing.com/mycourse/studentstudyAjax', query)
  // const url = 'https://mooc1.chaoxing.com/mycourse/studentstudyAjax?courseId=233568387&clazzid=74636055&chapterId=705025375&cpi=151953989&verificationcode=&mooc2=1';

}

const playVideo = () => {
  let num = 0
  let isdrag = 4
  const t = new Date().getTime()
  const func = async() => {
    const data = await httpRequest(`https://mooc1.chaoxing.com/multimedia/log/a/151953989/37aa562207daa99a23e83f8d5c34b033?clazzId=74636055&playingTime=${650}&duration=650&clipTime=0_650&objectId=a0b1a99f4f3888e3aad8bf8d63231036&otherInfo=nodeId_705025380-cpi_151953989-rt_d-ds_0-ff_1-be_0_0-vt_1-v_6-enc_ee85497b2dfe0cb692d0677dc4b5ac3b&courseId=233568387&jobid=1558580323599135&userid=150772623&isdrag=${isdrag}&view=pc&enc=3f16053bf2b974459ebcd3fc938127cf&rt=0.9&dtype=Video&_t=${t}`)
    console.log(data)
  }
  func()
  /*const timer = setInterval(async ()=> {
      const data = func();
      console.log(data);
      if (data.isPassed || num === 650) {
          isdrag = 4;
          func();
          clearInterval(timer)
      }
      num += 1;
  }, 1)*/
}

const studentStudyAjax = async(courseId, clazzid, chapterId, cpi, verificationcode = '', mooc2 = 1) => {
  // 章节里面查找视频和章节测试对应的tab
  const htmlStr = await httpRequest('studentStudyAjax', { courseId, clazzid, chapterId, cpi, verificationcode, mooc2 })
  if (htmlStr) {
    const $ = cheerio.load(htmlStr)
    const prev_tabs = $('#prev_tab > .prev_ul > li')
    let examination = ''
    let video = ''
    Array.from(prev_tabs).forEach((tab, index) => {
      const tab_name = $(tab).attr('title')
      if (/视频/.test(tab_name)) {
        video = index
      }
      if (/章节(测验|测试)/.test(tab_name)) {
        examination = index
      }
    })
    return { examination, video }
  }
  return {}
}

const getKnowledgeCards = async(clazzid, courseid, knowledgeid, cpi, num) => {
  const htmlStr = await httpRequest('knowledgeCards', { clazzid, courseid, knowledgeid, cpi, num })
  if (htmlStr) {
    const match = htmlStr.match(/mArg(\s+)?=(\s+)?({.*});?/i)
    if (match?.length >= 3) {
      return { args: JSON.parse(match[3]), htmlStr }
    }
  }
  return { args: '', htmlStr }
}

const getCourseChaptersStatus = async(clazzid, courseid, knowledgeid, cpi) => {
  // 查看课程章节（任务点是否完成）
  // /objectid['"]:(.*?),/
  //   const url = 'https://mooc1.chaoxing.com/knowledge/cards?clazzid=74636055&courseid=233568387&knowledgeid=705025375&num=0&ut=s&cpi=151953989&v=20160407-1&mooc2=1'
  const data = await httpRequest('knowledgeCards', { clazzid, courseid, knowledgeid, cpi })
  if (data) {
    return /isPassed["']:(\s+)?true/i.test(data)
  }
  return false
}

const geAttachmentsIsPassed = (cardsArgs) => {
  const { attachments = [] } = cardsArgs
  if (attachments.length) {
    return attachments[0].isPassed ? 1 : 0
  }
  return 0
}

const getDecipherChar = (encryptionChar, decipherObj) => {
  for (let i = 0; i < encryptionChar.length; i++) {
    const char = encryptionChar[i]
    if (decipherObj[char]) {
      encryptionChar[i] = decipherObj[char].text
    }
  }
  return encryptionChar
}

const insertDecryptChar = (decipherDict = {}, knowledgeId) => {
  // 保存解密文字映射表
  const values = []
  for (const key in decipherDict) {
    const { text, uni_code } = decipherDict[key]
    values.push([key, text, uni_code, knowledgeId])
  }
  insertDecryptCharTable(values)
}

const getQuestionTypeVal = (questionItem, $) => {
  const inputs = $(questionItem).find('input[type=hidden]')
  let val = ''
  Array.from(inputs).forEach(input => {
    const inputVal = $(input).attr('value')
    if (!val && inputVal !== '' && inputVal !== undefined) {
      val = inputVal
    }
  })
  return val
}

const questionTypeDict = {
  0: 'radio', // 单选
  1: 'checkbox', // 多选
  3: 'radio' // 判断
}

const analysisAnswerHtml = ($, decipherObj, chapterId) => {
  const TiMu = $('#ZyBottom .TiMu')
  let num = 0
  const result = []
  const questionIds = []
  while (num < TiMu.length) {
    const questionItem = TiMu[num]
    const questionName = $(questionItem).find('div.fontLabel').text()
    const questionNameChar = questionName.split('')
    const decipherStr = getDecipherChar(questionNameChar, decipherObj)
    const answerTypeId = $(questionItem).find('input[type=hidden]').attr('id')
    const answerTypeVal = getQuestionTypeVal(questionItem, $)
    const questionList = $(questionItem).find(`li[role=${questionTypeDict[answerTypeVal]}]`) || []
    const answerList = []
    for (let i = 0; i < questionList.length; i++) {
      const questionItem = questionList[i]
      let answerName = $(questionItem).attr('aria-label')
      answerName = getDecipherChar(answerName.split(''), decipherObj)
      const answerId = $(questionItem).find(`input[type=${questionTypeDict[answerTypeVal]}]`).attr('name')
      const answerVal = $(questionItem).find(`input[type=${questionTypeDict[answerTypeVal]}]`).attr('value')
      answerList.push({ questionName: answerName.join(''), answerId, answerVal })
    }
    questionIds.push(answerTypeId)
    result.push([answerTypeId, decipherStr.join(''), JSON.stringify(answerList), answerTypeVal])
    num += 1
  }
  insertQuestionTable(result)
  updateChapterQuestionId(questionIds.join(','), chapterId)
}

const getQuestionFormData = ($) => {
  // pyFlag=&courseId=233568281&classId=74635917&api=1&workAnswerId=51707739&answerId=51707739&totalQuestionNum=6eaca1bf84b6b650bc4b09d8f8805f1e&fullScore=100.0&knowledgeid=705028196&oldSchoolId=&oldWorkId=3bd052d2797448818de4ffc5a6a115ca&jobid=work-3bd052d2797448818de4ffc5a6a115ca&workRelationId=26091392&enc=&enc_work=6799261cd3edb00dc9ada38e8cb421f5&userId=150772623&cpi=151953989&workTimesEnc=&randomOptions=false&answertype402383192=0&answertype402383191=0&answertype402383190=0&answertype402383193=0&answertype402383188=0&answertype402383189=0&answertype402383195=3&answertype402383197=3&answertype402383196=3&answertype402383194=3&answerwqbid=
  const classId = $('#classId').val()
  const courseid = $('#courseId').val()
  const token = $('#enc_work').val()
  const totalQuestionNum = $('#totalQuestionNum').val()
  const workAnswerId = $('#workAnswerId').val()
  const answerId = $('#answerId').val()
  const fullScore = $('#fullScore').val()
  const oldSchoolId = $('#oldSchoolId').val()
  const oldWorkId = $('#oldWorkId').val()
  const jobid = $('#jobid').val()
  const workRelationId = $('#workRelationId').val()
  const enc_work = $('#enc_work').val()
  const userId = $('#userId').val()
  const workTimesEnc = $('#workTimesEnc').val()
  const randomOptions = $('#randomOptions').val()
  return {
    classId,
    courseid,
    token,
    totalQuestionNum,
    workAnswerId,
    answerId,
    fullScore,
    oldSchoolId,
    oldWorkId,
    jobid,
    workRelationId,
    enc_work,
    userId,
    workTimesEnc,
    randomOptions
  }
}

const getWordAnswerInfo = async(clazzId, courseid, knowledgeid, cpi, enc, utenc, ktoken, jobid, workId) => {
  const query = {
    api: 1,
    workId, // args中拿 attachments[0].property=>
    jobid, // args中拿 attachments[0].property=>
    needRedirect: 'true',
    knowledgeid, // args=>defaults: {}=>
    ktoken, // args=>defaults: {}=>
    cpi,
    ut: 's',
    clazzId,
    type: '',
    enc, // attachments[0].enc
    utenc, // ?
    mooc2: 1,
    courseid
  }
  const res = await httpRequest('work', query)
  if (res) {
    const $ = cheerio.load(res)
    const questionFormData = getQuestionFormData($)
    // 保存考试提交时需要的参数
    updateChapterQuestionForm(JSON.stringify(questionFormData), knowledgeid)
    const matchBase = res.match(/base64,(.*?)'\)/)
    if (matchBase && matchBase.length) {
      const base64Font = matchBase[1]
      const filePath = await base64StrToFont(base64Font)
      return request(`http://localhost:8899/decipher_font?font_path=${filePath}`, (err, result) => {
        if (!err) {
          try {
            const body = JSON.parse(result.body)
            insertDecryptChar(body, knowledgeid)
            analysisAnswerHtml($, body, knowledgeid)
          } catch (e) {
            console.error(e)
          }
        }
      })
    } else {
      // 尝试获取章节测试分数
      const ZyTop = $('.ZyTop')
      if (ZyTop) {
        const score = ZyTop.find('span>span').text()
        if (score) {
          updateChapterScore(score, knowledgeid)
        }
      }
    }
  }
}

const getQuestionBankInformation = async(clazzid, courseid, chapterId, cpi, num) => {
  const { htmlStr, args } = await getKnowledgeCards(clazzid, courseid, chapterId, cpi, num)
  try {
    const match = htmlStr.match(/_from\s+?=\s+?'(.*)';/)
    if (match && match.length > 0) {
      const parArr = match[1].split('_')
      const refer = encodeURIComponent(`https://mooc1.chaoxing.com/mycourse/studentstudy?chapterId=${chapterId}&courseId=${courseid}&clazzid=${clazzid}&cpi=${cpi}&enc=${parArr[parArr.length - 1]}&mooc2=1`)
      const transferHtml = await httpRequest('transfer', { moocId: courseid, clazzid, ut: 's', refer })
      const matchUtEnc = transferHtml.match(/utEnc\s?=\s?['"](.*)['"]/)
      if (matchUtEnc && matchUtEnc.length) {
        if (args.attachments.length) {
          const utEnc = matchUtEnc[1]
          const { enc, property = {} } = args.attachments[0]
          const { workid, jobid } = property
          const { ktoken } = args?.defaults
          if (!workid) {
            return console.log('**********chapterId:', chapterId)
          }
          await getWordAnswerInfo(clazzid, courseid, chapterId, cpi, enc, utEnc, ktoken, jobid, workid)
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
}

const getStudentCourse = (link) => {
  // 获取当前课下所有的章节
  // link = 'https://mooc1.chaoxing.com/visit/stucoursemiddle?courseid=233568387&clazzid=74636055&vc=1&cpi=151953989&ismooc2=1&v=2'; // todo 测试链接
  const { courseid, clazzid, cpi } = getQueryParams(link)
  const chapterMap = {}
  httpRequest('studentCourse', { courseid, clazzid, cpi, ut: 's', t: new Date().getTime() }).then(async data => {
    // 分析html,拿到每个item及其下视频
    const $ = cheerio.load(data)
    const chapterUnitList = $('.chapter_unit') // 获取每个单元
    const chapterSqlValues = []
    for (let i = 0; i < chapterUnitList.length; i++) {
      const unit = chapterUnitList[i]
      const catalogTitle = $(unit).find('.catalog_title span[title]').text().trim()
      const chapterItems = $(unit).find('.chapter_item')
      for (let n = 0; n < chapterItems.length; n++) {
        const chapterItem = chapterItems[n]
        let chapterId = $(chapterItem).attr('id')
        const chapterName = $(chapterItem).attr('title')
        if (chapterId && chapterName) {
          chapterId = chapterId.replace(/cur/i, '')
          // courseId, clazzid, chapterId, cpi
          const { examination, video } = await studentStudyAjax(courseid, clazzid, chapterId, cpi)
          // 获取视频相关信息
          await getQuestionBankInformation(Number(clazzid), Number(courseid), Number(chapterId), Number(cpi), examination)
          const { args: cardsArgs } = await getKnowledgeCards(clazzid, courseid, chapterId, cpi, video)
          const userId = cardsArgs?.defaults?.userid
          if (!chapterMap[catalogTitle]) {
            chapterMap[catalogTitle] = []
          }
          if (userId) {
            chapterMap[catalogTitle].push({ chapterId, chapterName, ...cardsArgs })
            chapterSqlValues.push([Number(courseid), Number(chapterId), n,
              chapterName, catalogTitle, i, Number(cpi),
              Number(clazzid), JSON.stringify(cardsArgs),
              Number(userId), geAttachmentsIsPassed(cardsArgs)])
            // userSqlValues.push([Number(cardsArgs?.defaults?.userid), Number(chapterId), chapterName, geAttachmentsIsPassed(cardsArgs)]);
          }
        }
        await sleep(30)
      }
      await sleep(30)
    }
    insertChapterTable(chapterSqlValues)
    // insetUser(userSqlValues);
    // console.log(JSON.stringify(chapterMap))
  })
}

const include = ['考古与人类', '东南亚文化', '起爆器材Ⅱ', '工程力学']

const getUserName = async() => {
  const htmlStr = await httpRequest('userInfo', { t: new Date().getTime() })
  const $ = cheerio.load(htmlStr)
  return $('.personalName').text()
}

const getCourseAll = (phone, password) => {
  httpRequest('courseAll', {
    courseType: 1,
    courseFolderId: 0,
    baseEducation: 0,
    superstarClass: '',
    courseFolderSize: 0
  }, 'post').then(async htmlStr => {
    const $ = cheerio.load(htmlStr)
    if (/操作异常.*验证码/.test(htmlStr)) {
      console.log('**************被风控啦**************')
      return
    }
    const userId = $('#userId').val()
    let list = $('#courseList>li')
    let num = 0
    const userName = await getUserName();
    console.log(userName)
    return;
    const courseLinkResult = []
    while (num < list.length) {
      console.log(`*************************${num}/${list.length}*************************`)
      const item = list[num]
      const courseName = $(item).find('.course-name').text()
      if (!include.includes(courseName)) {
        num += 1
        continue
      }
      const link = $(item).find('a').attr('href')
      const courseCover = $(item).find('.course-cover img').attr('src')
      const { courseid, clazzid, cpi } = getQueryParams(link)
      courseLinkResult.push([Number(courseid), courseName, Number(clazzid), Number(cpi), link, courseCover, userId])
      link && getStudentCourse(link)
      await sleep(60)
      num += 1
    }
    insertCourseTable(courseLinkResult)
    // getStudentCourse(courseLinkResult)
    // getStudentCourse();
  })
}
const start = (data) => {
  login(data).then(res => {
    const data = JSON.parse(res)
    console.log(data)
    if (data.status) {
      getCourseAll()
    } else {
      console.error('登录失败:', data)
    }
  })
}
/*
[
  { uname: 18175321616, password: '12345abc' },
  { uname: 17354485365, password: 'lky105753' }
].forEach(item=> {
  setTimeout(()=> {
    register(item)
  })

}) */
/*
console.log('workerData', workerData)

const start = (data)=> {
  console.log(data)
  console.log(workerData)
} */
start(workerData)



module.exports = {
  start
}
