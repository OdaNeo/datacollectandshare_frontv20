export type CmdAdd = {
  id: number
  cmdName: string
  consumers: string
  description: string
  producer: string
  canNotEdit: boolean
  consumersObj: Array<{ val: string }>
}
