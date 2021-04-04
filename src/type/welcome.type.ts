import { userInfo } from './user.type'

export type topicMsg = {
  SystemName: string
  count: number
}

export type topicProportionOpt = {
  text: string
  subtext: string
  proportion: string
  color: string
}

export type topicRankingInfo = {
  list: Array<userInfo>
  pageNum: number
  pageSize: number
  total: number
}

export type topicRankingData = {
  time: string
  count: string
  [key: string]: any
}

export type userProportion = {
  name: string
  value: number
}

export type releaseMenuRequest = {
  startTime: string
  endTime: string
  systemId: number
  dataType: number
  pageNum: number
  pageSize: number
}
