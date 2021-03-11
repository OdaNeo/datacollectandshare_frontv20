export type TopicAdd = {
  topicName: string
  messageType: string
  queneType: string
  dataStruct: string
  structMapping: string
  topicList: Array<any>
  _numberS: string
  _keyS: string
  interfaceType: string | number
  topicInterFaceType: string | number
  dataBaseType: string
  dataBaseIp: string
  url: string
  header: any
  canNotEdit: boolean
  id: string
  redisTimer: number
  writeElasticsearch: any
  dataStructSchema: any
  AuthorizationObj: any
  type: string
  body: any
  ftp: Array<{
    port: string
    host: string
  }>
  port: string
  host: string
  baseUrl: string
  userName: string
  logUserName: string
  logPassWord: string
  logIp: string
  savePath: string
  password: string
  saveType: Array<number>
}
