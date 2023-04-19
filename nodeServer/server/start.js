const schedule = require('node-schedule')
const method = require('./method.js')

const scheduleTask = () => schedule.scheduleJob('25 30 10 * * *', () => method.start())

// method.start()scheduleTask
scheduleTask()

module.exports = scheduleTask

