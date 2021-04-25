import { baseType } from './params.type'

export type offlineDataStatisticsType = {
  startTime: string
  endTime: string
  systemId: string | number
  dataType: number
  pageNum: number
  pageSize: number
}
export interface offlineTableType extends baseType {
  isEdit: boolean
  newTopics: boolean
  topicList: { key: string; type: string; description: string }[]
  header: { key: string }[]
  AuthorizationObj: { key: string; value: string }[]
  url: string
  type: string
  body: string
  taskName: string
  cron: string
  topicId: number
  saveEs: string
  saveHbase: string
  basePath: string
  filePrefix: string
  tableName: string
  username: string
  password: string
  ftp: [
    {
      host: string
      port: number
    }
  ]
}
