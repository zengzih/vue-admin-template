<template>
  <div class="wrapper">
    <div class="panel-list">
      <div v-for="item in courseData" :key="item.course_id" @click="handleCourse(item)" class="panel-group">
        <div class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
            <div class="card-panel-icon-wrapper icon-people">
              <img :src="`${baseHost}proxy?url=${item.course_cover}`" alt="">
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{ item.course_name }}</div>
              <div style="text-align:right;">
                <count-to :start-val="0" :end-val="item.isPassedCount || 0" :duration="2600" class="card-panel-num" />/
                <count-to :start-val="0" :end-val="item.chapterCount" :duration="2600" class="card-panel-num" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { baseHost, getCourseAll } from '@/apis'

export default {
  components: {
    CountTo
  },

  data() {
    return {
      baseHost,
      courseIds: {},
      courseData: []
    }
  },

  created() {
    this.getCourseAll()
  },

  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    async getCourseAll() {
      this.courseData = await getCourseAll()
      console.log('this.courseData:', this.courseData)
    },

    handleCourse({ course_id }) {
      this.$router.push({ name: 'Chapter', query: { course_id }})
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
	padding: 10px;
	background-color: #f0f2f5;
	position: relative;
	box-sizing: border-box;
	.panel-list {
		overflow: hidden;
		.panel-group {
			margin-top: 10px;
			float: left;
			width: 25%;
			padding: 10px;
			box-sizing: border-box;
			.card-panel-col {
				width: 100%;
			}

			.card-panel {
				border-radius: 4px;
				height: 108px;
				cursor: pointer;
				font-size: 12px;
				position: relative;
				overflow: hidden;
				color: #666;
				background: #fff;
				box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
				border-color: rgba(0, 0, 0, .05);

				&:hover {
					.card-panel-icon-wrapper {
						color: #fff;
					}

					.icon-people {
						background: #40c9c6;
					}

					.icon-message {
						background: #36a3f7;
					}

					.icon-money {
						background: #f4516c;
					}

					.icon-shopping {
						background: #34bfa3
					}
				}

				.icon-people {
					color: #40c9c6;
				}

				.icon-message {
					color: #36a3f7;
				}

				.icon-money {
					color: #f4516c;
				}

				.icon-shopping {
					color: #34bfa3
				}

				.card-panel-icon-wrapper {
					float: left;
					margin: 14px 0 0 14px;
					height: 54px;
					width: 54px;
					transition: all 0.38s ease-out;
					border-radius: 6px;
					img {
						border-radius: 6px;
						width: 100%;
						height: 100%;
					}
				}

				.card-panel-icon {
					float: left;
					font-size: 48px;
				}

				.card-panel-description {
					float: right;
					font-weight: bold;
					margin: 26px;
					margin-left: 0px;

					.card-panel-text {
						line-height: 18px;
						color: rgba(0, 0, 0, 0.45);
						font-size: 16px;
						margin-bottom: 12px;
					}

					.card-panel-num {
						font-size: 20px;
					}
				}
			}
		}

		@media (max-width:550px) {
			.card-panel-description {
				display: none;
			}

			.card-panel-icon-wrapper {
				float: none !important;
				width: 100%;
				height: 100%;
				margin: 0 !important;

				.svg-icon {
					display: block;
					margin: 14px auto !important;
					float: none !important;
				}
			}
		}
	}
}
</style>
