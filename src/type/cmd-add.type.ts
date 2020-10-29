export type CmdAdd = {
  cmdName: string
  consumers: string
  description: string
  exchanges: string
  id: number
  producer: string
  queueNames: string
  routingKey: string
  canNotEdit: boolean
}
