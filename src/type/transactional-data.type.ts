import { baseType } from './params.type'

export interface transactionalTableType extends baseType {
  maxValues: string
  cron: string
  taskName: string
  t: {
    inputContent: string
    topicId: number
    topicName: string
    dataStruct: string
  }
  newTopics: boolean
  taskId: number
  id: number | string
  taskConfigId: number
  isEdit: boolean
  dataStruct: string
  taskInfoList: Array<unknown>
  column: { field: string; type: string; iskey: string }[]
  increment: string
  reader_database: string
  reader_jdbcUrl: string
  reader_password: string
  reader_table: string
  reader_username: string
  writer_database: string
  writer_table: string
  writer_zookeeper_url: string
}
