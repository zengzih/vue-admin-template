import { currying } from '@/apis/currying'

export const baseHost = 'http://localhost:8848/'
const request = currying(baseHost)
export const login = request('login')

export const getCourseAll = request('getCourseAll')

export const getChapter = request('getChapter')

export const getAnswerStatus = request('getAnswerStatus')

// https://mooc1.chaoxing.com/multimedia/log/a/151953989/ddd85e5431a9272c10dbcc683a4c2baa?clazzId=74636055&playingTime=0&duration=646&clipTime=0_646&objectId=ecf8d69ef889e0c4251cdef012adcc86&otherInfo=nodeId_705025378-cpi_151953989-rt_d-ds_0-ff_1-be_0_0-vt_1-v_6-enc_9ed024e49a762eb79ecb49e2ea6b6c53&courseId=233568387&jobid=1558580295905916&userid=150772623&isdrag=3&view=pc&enc=9852e4c8307517ec08ea39a683e069b9&rt=0.9&dtype=Video&_t=1680959562483
export const playChapterVideo = request('playChapterVideo')

export const initData = request('initdatawithviewerV2')
