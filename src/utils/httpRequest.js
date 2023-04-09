const request = require('request')
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
  console.log(url)
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
    courseAll: 'visit/courselistdata'
  },

  'https://mooc2-ans.chaoxing.com': {
    studentCourse: 'mooc2-ans/mycourse/studentcourse'
  }
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Cookie': '',
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
  console.log('url:', URL)
  return new Promise((resolve, reject) => {
    request({
      url: URL,
      method,
      headers,
      form: method === 'get' ? {} : params
    }, (err, res) => {
      console.log('*******res:', res.body)
      if (/login/i.test(URL)) {
        headers.Cookie = res.headers['set-cookie'].join(';')
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
