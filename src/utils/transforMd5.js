const request = require('request')
const md5 = require("js-md5");

const getUrlParams = (url)=> {
	const [urlPrefix, urlParamsStr] = url.split('?')
	const urlParams = urlParamsStr.split('&')
	const param = {};
	urlParams.forEach(item=> {
		const [key, value] = item.split('=')
		param[key] = value
	});
	return { param, urlPrefix }
}

const queryParams = (url, isdrag=3, playTime)=> {
	// const param = { clazzId: '', playingTime: '', duration: '', objectId: '', jobid: '', userid: '' }
	const {param, urlPrefix} = getUrlParams(url)
	param.isdrag = isdrag ? isdrag : param.isdrag;
	param.playingTime = isdrag === 4 ? param.duration : (playTime || param.playingTime);
	let enc = `[${param.clazzId}][${param.userid}][${param.jobid}][${param.objectId}][${(param.playingTime * 1000).toString()}][d_yHJ!$pdA~5][${(param.duration * 1000).toString()}][0_${param.duration}]`;
	console.log('enc:', enc)
	param.enc = md5(enc)
	const result = [];
	for (const key in param) {
		result.push(`${key}=${param[key]}`)
	}
	console.log(`${urlPrefix}?${result.join('&')}`)
	return `${urlPrefix}?${result.join('&')}`
}

console.log(queryParams('https://mooc1.chaoxing.com/multimedia/log/a/151953989/a2daf6684f422b493bd42e3cda288136?clazzId=74636055&playingTime=0&duration=1195&clipTime=0_1195&objectId=1fe52534078006ea0b6ed9be4177a4f5&otherInfo=nodeId_705025400-cpi_151953989-rt_d-ds_0-ff_1-be_0_0-vt_1-v_6-enc_fcb58e35c6d40d2d1111cdc9d988bb77&courseId=233568387&jobid=1558580544391876&userid=150772623&isdrag=2&view=pc&enc=233102f7fee673212431c2af490e5c1c&rt=0.9&dtype=Video&_t=1681094998555'))

const applyRequest = (url, isdrag, playingTime)=> {
	request({
		url: queryParams(url, isdrag, playingTime),
		method: 'get',
		headers: {
			'Accept': '*/*',
			'Accept-Language':'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
			'Cache-Control':'no-cache',
			'Connection':'keep-alive',
			'Content-Type':'application/json',
			'Cookie':'fid=12007; lv=2; _uid=150772623; uf=b2d2c93beefa90dc21eccfe46eca2437964bdb84cfc93dcc89685ede0bf814d5274d2bec3fbb23e74fd8e61150650ad9748a002894d7f44e88b83130e7eb4704e0a71ffb2ea94f1f67cc3c653d1ee245db9a01fd759e1b98d6567ff1638bbc3b0d50bf7b93fb11f5; _d=1680853751516; UID=150772623; vc=1517762353A95DAECD070BC1884EDFBC; vc2=734D7734DD556A7A3DD291231008D6DE; vc3=GjIS3Avhd%2F%2Bc5ooqOt9foDpfjAL4goPHE4h05OJSh2f0iIzIihBDNlL9AijFwBPF0Oj78cZE%2FAm3oMcu85tllsVQrpn7ndtH4S3825vbEiV1ny5hXrmWIHn8Ajllu52SQiih6gFv74ehu7wNw%2FbQ5BeSN2X9BdRN6MVA%2FIjCS8A%3D2158bff4a5c77192641eaa79256c5a41; cx_p_token=9c01346147533b9effe1f0ec8215bdb5; xxtenc=32d3e0cb70b51761ee76d6e3cc406f5b; DSSTASH_LOG=C_38-UN_488-US_150772623-T_1680853751518; spaceFid=12007; spaceRoleId=""; k8s=1681093526.423.54582.331902; jrose=2C70EE0C004CD908A40A554A5A6EBD0C.mooc-p3-1004194731-3s6f7; route=f537d772be8122bff9ae56a564b98ff6; videojs_id=5889793',
			'Pragma':'no-cache',
			'Referer':'https://mooc1.chaoxing.com/ananas/modules/video/index.html?v=2023-0407-1455',
			'Sec-Fetch-Dest':'empty',
			'Sec-Fetch-Mode':'cors',
			'Sec-Fetch-Site':'same-origin',
			'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
			'sec-ch-ua':'"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
			'sec-ch-ua-mobile':'?0',
			'sec-ch-ua-platform': "Windows",
		}
	}, (err, result)=> {
		if (!err) {
			console.log(JSON.parse(result.body))
		}
	})
}
const url = 'https://mooc1.chaoxing.com/multimedia/log/a/151953989/ddd85e5431a9272c10dbcc683a4c2baa?cpi=151953989&dtoken=ddd85e5431a9272c10dbcc683a4c2baa&clipTime=0_646&duration=646&chapter_id=705025378&playingTime=60&objectId=ecf8d69ef889e0c4251cdef012adcc86&otherInfo=nodeId_705025378-cpi_151953989-rt_d-ds_0-ff_1-be_0_0-vt_1-v_6-enc_9ed024e49a762eb79ecb49e2ea6b6c53&courseId=233568387&clazzId=74636055&jobid=1558580295905916&userid=150772623&isdrag=3&view=pc&dtype=Video&_t=1681108409623&enc=9852e4c8307517ec08ea39a683e069b9&timer=582'
applyRequest(url, 0, 3)
const getDuration = (url)=> {
	const {param} = getUrlParams(url)
	return param.duration;
}
let timeCount = 60;
const duration = getDuration(url)
const timer = setInterval(()=> {
	if (timeCount >= duration) {
		console.log('-----end-----', duration)
		clearTimeout(timer);
		return applyRequest(url,4);
	}
	timeCount += 60;
	applyRequest(url, 3, timeCount);
}, 1000 * 60);
