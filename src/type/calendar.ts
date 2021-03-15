export type CalendarData = {
  name: string
  start: Date
  color: string
  timed: boolean
  remarks: string
  status: string
  timeFormatter: string
  serverName: string
}

export type realTimeData = {
  id: number
  topicId: number
  serverName: string
  status: number
  createTime: string
  remarks: string
}
