export type VideoTopicAdd = {
  topicName: string
  address: string
  sourceUrl: string
  videoDescribe: string
  videoKeyword: { keyword: string }[]
  canNotEdit: boolean
  id: number
}
export type VideoTopicTable = {
  topicName: string
  address: string
  sourceUrl: string
  videoDescribe: string
  videoKeyword: string
  canNotEdit: boolean
  id: number
}
export type VideoTimeRange = {
  startTime: string
  startHour: number
  endTime: string
  endHour: number
}
