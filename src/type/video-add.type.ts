export type VideoTopicAdd = {
  id: number
  cmdName: string
  consumers: Array<string>
  description: string
  producer: string
  canNotEdit: boolean
}
