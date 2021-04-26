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
  taskId: number
  type: string
  body: string
  taskName: string
  cron: string
  topicId: number
  uid: number
  saveEs: string
  saveHbase: string
  taskConfigId: number
  basePath: string
  filePrefix: string
  tableName: string
  username: string
  password: string
  t_id: number
  ftp: [
    {
      host: string
      port: number
    }
  ]
}
