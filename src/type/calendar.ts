import { dataType } from '@/enum/topic-datatype-enum'

export type CalendarData = {
  name: string
  start: Date
  color: string
  timed: boolean
  remarks: string
  status: string
  serverName: string
}
