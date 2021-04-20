import { baseType } from './params.type'

export interface transactionalTableType extends baseType {
  maxValue: string
  cron: string
  inputContent: string
  canNotEdit: boolean
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
