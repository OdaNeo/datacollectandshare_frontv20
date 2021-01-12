export type VideoTopicAdd = {
  id: number
  cmdName: string
  consumers: Array<string>
  description: string
  producer: string
  canNotEdit: boolean
}
export type VideoTimeRange = {
  startTime: string
  startHour: number
  endTime: string
  endHour: number
}
