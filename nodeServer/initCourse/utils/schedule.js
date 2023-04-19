const schedule = require('node-schedule');

const job = schedule.scheduleJob('25 30 09 * * *', function(){
	console.log('1s执行一次');
});

