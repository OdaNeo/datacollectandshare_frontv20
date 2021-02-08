/* eslint-disable no-unused-vars */
export enum topicInterFaceType {
  通用Rest接口 = 1,
  数据库采集,
  服务主动拉取,
  多级嵌套免校验,
  拉取FTP,
  PROTOBUF,
  VIDEO,
  事务数据
}
// 实时 ： 1 4 6
// 离线 ： 2 3 5
// 视频 ： 7
// 事务 ： 8
