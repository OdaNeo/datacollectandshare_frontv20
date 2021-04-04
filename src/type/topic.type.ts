export type topicTable = {
  auditTime?: number
  belongUserName?: string | null
  dataStruct?: string
  dataStructSchema?: string | null
  id?: number
  queneType?: number
  status?: boolean
  structMapping?: string
  subUserId?: number | null
  subscribe?: number
  systemId?: number | null
  topicId?: string | number
  topicName?: string
  userID?: number | null
  userName?: string
  userSubNameList?: Array<string>
  flag?: boolean
  topicInterFaceType?: number
  redisTimer?: number
  dataBaseIp?: string | null
  dataBaseType?: string | null
  url?: string | null
  header?: string | null
  createTime?: string
  log?: string
  state?: number
  key?: string
  value?: string
}
