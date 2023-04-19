const { Worker } = require('worker_threads')
// const { start } = require('./initCourse/main')

const runWorker = (workerData) => {
  return new Promise((resolve, reject) => {
    // 引入 workerExample.js `工作线程`脚本文件
    const worker = new Worker('./initCourse/main.js', { workerData });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`stopped with  ${code} exit code`));
    })
  })
}

const main = () => {
  const accountData = [
    { uname: 18175321616, password: '12345abc' },
    { uname: 17354485365, password: 'lky105753' }
  ]
  for (const key in accountData) {
    runWorker(accountData[key])
    // console.log(result);
  }
}
main();

// main().catch(err => console.error(err))
