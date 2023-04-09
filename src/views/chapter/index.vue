<template>
  <div class="chapter_wrapper">
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="catalog_name"
        label="课程单元"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="chapter_name"
        label="课程章节"
        min-width="300">
      </el-table-column>
      <el-table-column
        prop="is_passed"
        align="center"
        label="状态">
        <template slot-scope="{ row }">
          <el-tag
            :key="row.chapter_id"
            :type="row.is_passed ? '' : 'danger'"
            effect="dark">
            {{ row.is_passed ? '已完成' : '未完成' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        min-width="100"
        align="center"
        label="操作">
        <template slot-scope="{ row }">
          <el-button type="mini" @click="handleStart(row)">开始</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getChapter, getAnswerStatus, playChapterVideo, initData } from '@/apis'
import md5 from 'js-md5'
export default {
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getChapterData(this.$route.query.course_id)
  },
  methods: {
    async getChapterData(course_id) {
      this.tableData = await getChapter({ course_id })
    },

    getEnc({ clazzId, userid, jobid, objectId, playingTime, duration }) {
      const enc = `[${clazzId}][${userid}][${jobid}][${objectId}][${playingTime * 1000}][d_yHJ!$pdA~5][${(duration * 1000).toString()}][0_${duration}]`
      return md5(enc)
    },

    async handleStart(row) {
      const { cpi, attachments = '{}', courseId, user_id: userid, clazzid: clazzId, chapter_id } = row
      const { attachments: [{ objectId, otherInfo, jobid, mid }] } = JSON.parse(attachments)
      const { dtoken, status, duration } = await getAnswerStatus({ cpi, objectId, k: 12007, flag: 'normal', _dc: new Date().getTime() })
      if (status === 'success') {
        /* const tempFunc = (isdrag) => {
          let playingTime = 0
          if (isdrag === 3) {
            const minPlayMinutes = Number(duration) / 2
            playingTime = minPlayMinutes > 60 ? minPlayMinutes : 60
          }
          const params = { cpi, dtoken, clipTime: `0_${duration}`, duration, chapter_id, playingTime, objectId, otherInfo, courseId, clazzId, jobid, userid, isdrag, view: 'pc', dtype: 'Video', _t: new Date().getTime() }
          playChapterVideo({ ...params, enc: this.getEnc(params) }).then(res => {
            if (!res.isPassed && isdrag === 1) {
              tempFunc(3)
            }
          })
        }
        tempFunc(1) */
        const callFunc = (isdrag, playingTime = 0) => {
          const params = { cpi, dtoken, clipTime: `0_${duration}`, duration, chapter_id, playingTime, objectId, otherInfo, courseId, clazzId, jobid, userid, isdrag, view: 'pc', dtype: 'Video', _t: new Date().getTime() }
          playChapterVideo({ ...params, enc: this.getEnc(params) }).then(res => {
            if (!res.isPassed && isdrag === 3) {
              setTimeout(() => {
                console.log('setTime')
                callFunc(4, params.duration)
              }, 180 * 1000)
            }
          })
        }
        initData({ mid, cpi, classid: clazzId, _dc: new Date().getTime() }).then(res => {
          callFunc(3)
        })
      }
    }
  }
}

const ws = new WebSocket('ws://localhost:8080')
ws.onopen = () => {
  console.log('Connected to WebSocket server.')
  ws.send('Hello from WebSocket client!')
}
ws.onmessage = (message) => {
  console.log(`Received message: ${message.data}`)
}
ws.onclose = (event) => {
  console.log(`Connection closed with code ${event.code} and reason ${event.reason}`);
}

</script>

<style scoped lang="scss">
  .chapter_wrapper {
    padding: 10px;
    box-sizing: border-box;
  }
</style>
