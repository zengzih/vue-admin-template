const table = require('./table');
const { typr, md5 } = require('./TyprMd5')
const base64Str = require('./base64Str')
const analysisBase64 = (base64Str)=> {
	const buffer = typr.parse(Buffer.from(base64Str, 'base64'))[0];
	const decryptDict = {};
	const keys = [];
	for (let i = 19968; i < 40870; i++) { // 中文[19968, 40869]
		let $tip = typr.U.codeToGlyph(buffer, i);
		if (!$tip) continue;
		$tip = typr.U.glyphToPath(buffer, $tip);
		$tip = md5(JSON.stringify($tip)).slice(24); // 8位即可区分
		const key = String.fromCharCode(i)
		decryptDict[key] = String.fromCharCode(table[$tip]);
		keys.push(key)
	}
	const textReg = new RegExp(keys.join('|'), 'g')
	return (font_text)=> {
		return font_text.replace(textReg, ($1)=> decryptDict[$1])
	}
};

module.exports = analysisBase64

/*const currying = analysisBase64(base64Str)

const fontText = currying('【单选题】妭列撡撜撝徹甸神话撠型獞是()')
console.log(fontText)*/

