const request = require("request");
const cheerio = require("cheerio");
const queryParams = (params, url)=> {
    const result = [];
    for (const key in params) {
        result.push(`${key}=${params[key]}`)
    }
    if (url) {
        return `${url}?${result.join('&')}`
    }
    return result.join('&');
};

const getHost = (urlMap, interfaceName)=> {
    for (const key in urlMap) {
        for (const name in urlMap[key]) {
            if (name === interfaceName) {
                return {
                    host: key,
                    url: `${key}/${urlMap[key][name]}`
                }
            }
        }
    }
    return {
        host: '',
        url: interfaceName
    };
}

const getQueryParams = (url)=> {
    console.log(url)
    const params = url.split('?')[1];
    const dict = {};
    if (params.length) {
        const arr = params.split('&');
        arr.forEach(item=> {
            const [name, value] = item.split('=');
            dict[name] = value;
        })
    }
    return dict;
}

const sleep = (timeout=5)=> new Promise(resolve => setTimeout(resolve, timeout * 1000))

const interfaceMap = {
    'https://mooc1.chaoxing.com': {
        courseListData: 'visit/courselistdata',
        knowledgeCards: 'knowledge/cards',
        playVideo: 'multimedia/log/a',
        studentStudyAjax: 'mycourse/studentstudyAjax',
        work: 'api/work',
        transfer: 'mycourse/transfer',
        doHomeWorkNew: 'work/doHomeWorkNew'
    },

    'https://mooc2-ans.chaoxing.com': {
        studentCourse: 'mooc2-ans/mycourse/studentcourse'
    },

    'https://mooc1-1.chaoxing.com': {
        courseAll: 'visit/courselistdata'
    }
}

const headers = (Referer)=> {
    const Host = Referer.replace('https://', '');
    return {
        'Content-Type': 'application/json',
        'Cookie': 'fid=12007; lv=2; _uid=150772623; uf=b2d2c93beefa90dc21eccfe46eca2437964bdb84cfc93dcc89685ede0bf814d5274d2bec3fbb23e74fd8e61150650ad9748a002894d7f44e88b83130e7eb4704e0a71ffb2ea94f1f67cc3c653d1ee245db9a01fd759e1b98d6567ff1638bbc3b0d50bf7b93fb11f5; _d=1680853751516; UID=150772623; vc=1517762353A95DAECD070BC1884EDFBC; vc2=734D7734DD556A7A3DD291231008D6DE; vc3=GjIS3Avhd%2F%2Bc5ooqOt9foDpfjAL4goPHE4h05OJSh2f0iIzIihBDNlL9AijFwBPF0Oj78cZE%2FAm3oMcu85tllsVQrpn7ndtH4S3825vbEiV1ny5hXrmWIHn8Ajllu52SQiih6gFv74ehu7wNw%2FbQ5BeSN2X9BdRN6MVA%2FIjCS8A%3D2158bff4a5c77192641eaa79256c5a41; cx_p_token=9c01346147533b9effe1f0ec8215bdb5; xxtenc=32d3e0cb70b51761ee76d6e3cc406f5b; DSSTASH_LOG=C_38-UN_488-US_150772623-T_1680853751518; thirdRegist=0; __utmc=68824131; source=""; k8s=1681438283.667.5689.842768; route=36ef5ecbfa418bb6fd1c82c50e9f0066; __utma=68824131.1687979400.1681438277.1681438277.1681712266.2; __utmz=68824131.1681712266.2.2.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; jrose=BA01773B32017CF11AFFC24E859559E2.mooc2-1953055545-d9phr',
        // 'Referer': 'https://mooc1.chaoxing.com/ananas/modules/video/index.html?v=2023-0331-1824',
        Referer,
        Host,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Mode": 'cors',
        'Accept': '*/*',
    }
};

const httpRequest = (req_url, params, method='get')=> {
    method = method.toLowerCase();
    const { url, host } = getHost(interfaceMap, req_url)
    const URL = method === 'get' ? queryParams(params, url) : url;
    console.log(URL)
    return new Promise((resolve, reject) => {
        request({
            url: URL,
            method,
            headers: headers(host),
            form: method === 'get' ? {} : params
        }, (err, res)=> {
            if (!err) return resolve(res.body)
            reject(err);
        })
    })
}

module.exports = {
    sleep,
    queryParams,
    httpRequest,
    getQueryParams
};
