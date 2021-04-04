export type CmdAdd = {
  id: number
  cmdName: string
  consumers: Array<string>
  description: string
  producer: string
  canNotEdit: boolean
}

export type CmdForm = {
  id: number
  cmdName: string
  consumers: string
  description: string
  queueNames: string
  producer: string
  canNotEdit: boolean
}
