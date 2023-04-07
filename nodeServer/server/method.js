const connect = require('../connect/index');
const encrypt = require("../../src/utils/encryptByAES.js");
const {httpRequest, queryParams} = require("../../src/utils/httpRequest.js");

class RequestMethod {
	constructor() {
		this.connect = connect
	}

	getAllCourse(userId, callback) {
		const sql = `select * from courseTable`
		connect.query(sql, (err, result) => {
			if (!err) {
				callback(result);
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
		};

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
}

const requestMethod = new RequestMethod()

// requestMethod.login({ uname: 19392948031, password: 'lj200204171693' })

module.exports = requestMethod;
