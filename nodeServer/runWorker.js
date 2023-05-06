const { Worker } = require('worker_threads')
const { sleep } = require('../src/utils/index')

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

const main = async () => {
  const accountData = [
    {
      userInfo: { uname: 15659955392, password: '88888888xkh' },
      courseInfo: ['高级英语写作', '公共写作规范']
    },
    {
      userInfo: { uname: 18175321616, password: '12345abc' },
      courseInfo: ['体育中国', '能源中国', '创新创业', '工程训练']
    },
    {
      userInfo: { uname: 13966872574, password: 'hhh123456' },
      courseInfo: ['国学智慧', '中国文化', '创新创业',  '工程训练']
    },
    {
      userInfo: { uname: 13159229610, password: '123456qwe' },
      courseInfo: ['论文写作初阶', '教师口语艺术', '创新创业', '工程训练']
    },
    {
      userInfo: { uname: 16655223477, password: '200205057553zan' },
      courseInfo: ['朗读艺术入门', '服装流行分析与预测', '创新创业', '工程训练']
    },
    {
      userInfo: { uname: 18955414535, password: 'qwert12345' },
      courseInfo: ['脑洞大开背后的创新思维', '创新创业',  '创新创业基础', '工程训练']
    },
    {
      userInfo:  { uname: 18327005594, password: 'tong1027han' },
      courseInfo: ['劳动通论']
    },
    {
      userInfo:  { uname: 19392948031, password: 'lj200204171693' },
      courseInfo: ['考古与人类', '东南亚文化', '起爆器材Ⅱ', '工程力学']
    },
    {
      userInfo: { uname: 17355026051, password: '129061@xym' },
      courseInfo: ['宪法与法律', '创新创业', '毒品危害与防范']
    },
    {
      userInfo: { uname: 15328007932, password: 'q1020292807' },
      courseInfo: ['欧洲文明的现代历程', '创新创业', '中国民间艺术的奇妙之旅', '工程训练']
    },
    {
      userInfo: { uname: 13966473620, password: 'lyj111111' },
      courseInfo: ['创新创业', '舌尖上的植物学', 'Flash动画技术入门', '工程训练']
    }
  ]
  for (const key in accountData) {
    runWorker(accountData[key])
    // await sleep(3)
  }
}
main();

// main().catch(err => console.error(err))
