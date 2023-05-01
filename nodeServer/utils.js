const log4js = require('log4js')
const path = require('path')
const config = {
  "appenders": [
    {
      "type": "console"
    },
    {
      "type": "file",
      "filename": path.resolve(__dirname, '..', 'logs/question_answer.log'),
      "maxLogSize": 1024,
      "backups": 3,
      "category": "normal"
    }
  ]
}
log4js.configure(config);
const logger = log4js.getLogger('normal');//获取配置文件中category为normal的appender
logger.setLevel('DEBUG');

module.exports = {
  logger
}
