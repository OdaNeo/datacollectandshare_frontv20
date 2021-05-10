export type CalendarData = {
  name: number
  start: Date
  color: string
  timed: boolean
  remarks: string
  status: string
  label: string
  serverName: string
}

export type realTimeData = {
  id: number
  topicId: number
  serverName: string
  status: number
  createTime: string
  remarks: string
  taskId: number
}
