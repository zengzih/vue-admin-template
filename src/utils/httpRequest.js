let request = require('request')
request = request.defaults({jar: true})
const queryParams = (params, url) => {
  const result = []
  for (const key in params) {
    result.push(`${key}=${params[key]}`)
  }
  if (url) {
    return `${url}?${result.join('&')}`
  }
  return result.join('&')
}

const getHost = (urlMap, interfaceName) => {
  const interfaceInfo = interfaceName.split('?')
  interfaceName = interfaceInfo[0]
  let url = interfaceName
  for (const key in urlMap) {
    for (const name in urlMap[key]) {
      if (name === interfaceName) {
        url = `${key}/${urlMap[key][name]}`
        break
      }
    }
  }
  return interfaceInfo.length > 1 ? `${url}?${interfaceInfo[1]}` : url
}

const getQueryParams = (url) => {
  const params = url.split('?')[1]
  const dict = {}
  if (params.length) {
    const arr = params.split('&')
    arr.forEach(item => {
      const [name, value] = item.split('=')
      dict[name] = value
    })
  }
  return dict
}

const sleep = (timeout = 5) => new Promise(resolve => setTimeout(resolve, timeout * 1000))

// https://passport2.chaoxing.com/fanyalogin
const interfaceMap = {
  'https://passport2.chaoxing.com': {
    login: 'fanyalogin'
  },
  'https://mooc1.chaoxing.com': {
    courseListData: 'visit/courselistdata',
    knowledgeCards: 'knowledge/cards',
    playVideo: 'multimedia/log/a/{cpi}/{dtoken}',
    answerStatus: 'ananas/status/{objectId}',
    initData: 'richvideo/initdatawithviewerV2',
    courseAll: 'visit/courselistdata',
    studentStudyAjax: 'mycourse/studentstudyAjax',
    work: 'api/work',
    transfer: 'mycourse/transfer',
    doHomeWorkNew: 'work/doHomeWorkNew'
  },

  'http://i.mooc.chaoxing.com': {
    userInfo: 'space/index'
  },

  'https://mooc2-ans.chaoxing.com': {
    studentCourse: 'mooc2-ans/mycourse/studentcourse'
  },

  'https://mooc1-1.chaoxing.com': {
    courseAll: 'visit/courselistdata'
  }
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Cookie': '', //'k8s=1680613646.13.54453.273515; route=0a65fa708818ad1416475328b69707fd; writenote=yes; resolution=360; videojs_id=2253301; fanyamoocs=11401F839C536D9E; fid=12007; isfyportal=1; lv=2; _uid=203238181; uf=b2d2c93beefa90dc21eccfe46eca243798638bc922e61fed6ee7c75cc5d61dc6842a68641337b6f0d37a0811ea5f718930d92481d752d66f88b83130e7eb4704e0a71ffb2ea94f1f67cc3c653d1ee245db9a01fd759e1b98f3473f4ae2af973038bf9cb3dba86bb7; _d=1683343691784; UID=203238181; vc=266A1D2770AFB1AF90ED621DA5DB5CBC; vc2=E706024A5124EF4357F08EFB58DA6098; vc3=MhI8eRuq%2BqK948GroMcFwNUm83kIZrvgy5Cy2T2d4SRy%2BO8Kh6oOW8fqGP07SS39o%2BrDmIFlEatvPq9AAgKdp4esROnRXLwnkS0s4XEr6fniEnGrzq5lVlISBeJyzEu2R1LiTh82MZcUSCbImAICz9FubjByKKkvKJakD2M99B0%3D9133ff2cffbf745cfd58a9abac50ccb4; cx_p_token=b896be0147084dd41748f60f258c0a8a; xxtenc=4c49a74fe3026983878c2f5c8045049f; DSSTASH_LOG=C_38-UN_488-US_203238181-T_1683343691785; source=""; thirdRegist=0; jrose=01BD9AFC3CFE1A734D05794321AE3FA1.mooc-1099418272-thl3w', //'k8s=1680613646.13.54453.273515; route=0a65fa708818ad1416475328b69707fd; writenote=yes; resolution=360; fid=12007; videojs_id=2253301; lv=2; _uid=150772599; uf=b2d2c93beefa90dc21eccfe46eca2437964bdb84cfc93dcc5ac526c9ae3216d9842a68641337b6f04743d88a865df2632a80cd29a298e70788b83130e7eb4704e0a71ffb2ea94f1f67cc3c653d1ee245db9a01fd759e1b989e07c819314935a593dc51af263932e5; _d=1683274847108; UID=150772599; vc=42641E10AE7C8F399139B02FB97F126D; vc2=AE312AD4B178111206DC655D9B6BE94E; vc3=UCLV8yUSJo0WHsBTExEUZZbulWg%2Fzi3DD4H5SHnZF%2F98aIMFvxE7v%2BiX6gW4WtvhCP3JgyzSV01aRy4%2BAHYjoQvZpRwEh9PV9sjBfqTH7EvantHmNJg5T6cyCPtYpBxNpg69heZfQG1uBi0NQPI4q2LyFyusDIg7j3fOg6fJ5gc%3D651473d9e8c50c86fd0a4273201612c8; cx_p_token=a170cbe963be3a363f5f0c71796169d3; xxtenc=ce06eb360642c760f784c259d92329e6; DSSTASH_LOG=C_38-UN_488-US_150772599-T_1683274847110; thirdRegist=0; __utma=68824131.778422120.1683274850.1683274850.1683274850.1; __utmc=68824131; __utmz=68824131.1683274850.1.1.utmcsr=passport2.chaoxing.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmt=1; __utmb=68824131.1.10.1683274850; source=""; jrose=F31B9113E3B970F079DFF4AEA169FFF8.mooc-p3-2035141556-zf1n9',
  'Referer': 'https://mooc1.chaoxing.com/ananas/modules/video/index.html?v=2023-0331-1824',
  // 'Host': 'mooc1.chaoxing.com',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': 'macOS',
  'Sec-Fetch-Mode': 'cors',
  'Accept': '*/*'
}

const replaceUrlBooth = (url, params) => {
  url.replace(/{(.*?)}/g, (r1, r2) => {
    url = url.replace(r1, params[r2])
  })
  return url
}

const httpRequest = (url, params, method = 'get', headers) => {
  method = method.toLowerCase()
  url = replaceUrlBooth(getHost(interfaceMap, url), params)
  headers = headers || defaultHeaders
  const URL = method === 'get' ? queryParams(params, url) : url
  // console.log('url:', URL)
  return new Promise((resolve, reject) => {
    request({
      url: URL,
      method,
      headers,
      form: method === 'get' ? {} : params
    }, (err, res) => {
      // console.log('*******res:', res.body)
      if (/login/i.test(URL)) {
        // headers.Cookie = res.headers['set-cookie'].join(';')
        request.cookie(res.headers['set-cookie'].join(';'))
      }
      if (!err) return resolve(res.body)
      reject(err)
    })
  })
}
module.exports = {
  sleep,
  queryParams,
  httpRequest,
  getQueryParams
}
