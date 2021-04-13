import { baseType } from './params.type'

export interface onlineDataParamType extends baseType {
  dataStruct: string
  dsAnnotation: string
  writeElasticsearch: number
  redisTimer: number
  queneType: string
  dataStructSchema: string
}
