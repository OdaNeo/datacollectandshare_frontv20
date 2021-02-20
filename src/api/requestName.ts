export const POST_LOGIN_LOGIN = '/login/login'

// ------------------------权限管理----------------------------
export const GET_USER_FIND_ALL_USER = '/user/findAllUser'
export const POST_ROLE_ADDROLE = '/role/addRole'
export const PUT_ROLE_UPDATEROLE = '/role/updateRole'
export const GET_ROLE_DELETE = '/role/delete'
export const GET_USER_FIND_ALL_USER_BY_PARAM = '/user/findAllUserByParam'
export const POST_USER_ADD_USER = '/user/addUser'
export const GET_USER_ADDUSER_FIND_ALL_ROLE = '/user/addUser/findAllRole'
export const GET_USER_ADDUSER_GET_SYSTEM_INFO_ADD_ADDUSER = '/user/addUser/getSystemInfoAndAddUser'
export const POST_USER_UPDATE_USER = '/user/updateUser'
export const GET_PERMISSION_FIND_ALL_PERMISSION = '/permission/findAllPermission'
export const GET_PERMISSION_FIND_ALL_PERMISSION_BY_PARAM = '/permission/findAllPermissionByParam'
export const POST_PERMISSION_ADD_PERMISSION = '/permission/addPermission'
export const PUT_PERMISSION_UPDATE_PERMISSION = '/permission/updatePermission'
export const GET_PERMISSION_DELETE = '/permission/delete'
export const GET_ROLE_FIND_ALL_ROLE = '/role/findAllRole'
export const GET_ROLE_FIND_ALL_ROLE_BY_PARAM = '/role/findAllRoleByParam'
export const GET_PERMISSION_AUTHORIZATION_FIND_ALL_PERMISSION = '/permission/authorization/findAllPermission'
export const GET_PERMISSION_AUTHORIZATION_FINDPERMISSIONLISTBYROLEID =
  '/permission/authorization/findPermissionListByRoleId'
export const POST_PERMISSION_AUTHORIZATION_ADDROLEIDPERMISSIONID = '/permission/authorization/addRoleIdPermissionId'
export const GET_TOPICS_FINDALLSUBTOPIC = '/topics/findAllSubTopic' // 查询可订阅的主题
export const GET_TOPICS_SELECTSUBTOPICBYID = '/topics/selectSubTopicById' // 通过id查询主题
// /system/getSystemTypeInfo ？
// /user/delete/* ?
// /permission/findPermissionListByRoleId/* ?

// ---------------------------实时数据-------------------------
export const GET_TOPICS_MYTOPICS = '/topics/myTopics'
export const POST_TOPICS_ADD = '/topics/addTopic' // 增加主题
export const POST_TOPICS_UPDATE = '/topics/updateTopic' // 更新主题
export const GET_TOPICS_DELETE = '/topics/delTopic' // 删除主题
export const GET_TOPICS_SELECTTOPIC = '/topics/selectTopic'
export const GET_TOPICS_FIND_ALL = '/topics/findAll'
export const GET_TOPICS_CHECKED = '/topics/findTopicByTopicName'
export const GET_TOPICS_MYTOPICSBYID = '/topics/myTopicsById'
export const GET_TOPICS_INFORMATION = '/topics/findTopicAdditionalByTopicName' // 查询主题附加信息
export const POST_SUBMODERATIONS_INSERTSUBMODERATION = '/subModerations/insertSubModeration'
export const POST_TOPIC_ADDPROTOBUFTOPIC = '/topics/addProtobufTopic' // 上传proto文件
export const GET_TOPICS_PROTOBUFDOWNLOAD = '/topics/protobufDownload' // 下载protobuf文件
export const POST_TOPICS_DELSUBUSER = '/topics/delSubUser'
export const GET_SUB_MODERATIONS_SELECT_STATUS = '/subModerations/selectStatus' // 获取审核列表
export const GET_SUB_MODERATIONS_SELECT_AUDIT_STATUS = '/subModerations/selectAuditStatus' // 获取主题审核记录
export const POST_SUBMODERATIONS_UPDATESUBMODERATION = '/subModerations/updateSubModeration' // 审核操作
export const GET_SUBMODERATIONS_SELECTBYUSERNAMESTATUS = '/subModerations/selectByUserNameStatus' // 通过订阅用户获取审核列表
export const GET_SUBMODERATIONS_SELECTAUDITSTATUSBYTOPICID = '/subModerations/selectAuditStatusByTopicID' // 通过ID获取主题审核记录
// /topics/alterTopic ?
// /topics/addSubUser ?

// --------------------------- 系统管理 --------------------------
export const GET_SYSTEM_FINDALL = '/system/findAll' // 获取系统列表
export const GET_SYSTEM_GETINFOBYTYPENAME = '/system/getInfoByTypeName'
export const GET_SYSTEM_DELCONFIG = '/system/delConfig'
export const POST_SYSTEM_ADDCONFIG = '/system/addConfig'
export const GET_SYSNET_GETBINDLIST = '/sysnet/getBindList' // 绑定网络
export const GET_SYSNET_GETBINDBYNAME = '/sysnet/getBindByName'
export const GET_SYSNET_GETSYSNETLIST = '/sysnet/getSysNetList'
export const GET_SYSNET_ADDBINDINFO = '/sysnet/addBindInfo'
export const POST_SYSNET_DELETEBINDINFO = '/sysnet/delBindInfo'

// ---------------------------- 操作日志 ---------------------------
export const GET_LOGMGT_VIEWLOG_LOG_FINDALLLOG = '/logMGT/viewLog/log/findAllLog'
// /logMGT/viewLog/log/findAllLogByParam ？

// ---------------------------- 系统统计 ---------------------------
export const GET_SYSTEM_GETSYSTEMINFO = '/system/getSystemInfo'
export const GET_STATISTICS_STAT_TOPIC_DATA = '/statistics/statTopicData'
export const GET_STATISTICS_STAT_SYS_TOPIC = '/statistics/statSysTopic'

// ---------------------------- 可靠通道 ---------------------------
export const GET_CMD_FIND_ALL = '/cmd/findAll'
export const GET_CMD_MYCMD = '/cmd/findCmdInfoByUserId'
export const GET_CMD_FINDMYCMDINFOBYID = '/cmd/findMyCmdInfoById'
export const GET_CMD_CHECKED = '/cmd/isRepeat' // 校验cmd是否存在
export const GET_CMD_SELECTCMD = '/cmd/findCmdInfoById'
export const POST_CMD_ADD = '/cmd/addCmdInfo' // 创建命令
export const POST_CMD_UPDATE = '/cmd/updateCmdInfo'
export const GET_CMD_DELETE = '/cmd/delCmdInfo'

// ----------------------------- 视频数据 ---------------------------
export const GET_VIDEO_ADDRESS = '/topics/getVideoAddress' // 视频数据统计
export const GET_TOPICS_GETVIDEO = '/topics/getVideo'

// ----------------------------- 事务数据 ----------------------------
export const GET_TOPICS_GETOFFLINELOG = '/topics/getOfflineLog'
export const POST_TOPICS_UPDATETRANSACTIONALTOPIC = '/topics/updateTransactionalTopic'

// ----------------------------- 内部调试页面 未配置权限 ---------------
export const POST_TRANSMISSION_ATS = '/transmission/ATS'
export const GET_TRANSMISSION_REALTIME = '/transmission/realtime/ATS'
export const GET_TRANSMISSION_HISTORY = '/transmission/history/ATS'

// ----------------------------- 废弃API ----------------------------
// export const GET_TOPICS_SELECTTOPICBYTIDTNAME = '/topics/selectTopicByTIdTName'
// export const GET_TOPICS_FIND_ALL_TOPIC = '/topics/findAllTopic'

type REQUEST_NAME_TYPE = {
  [key: string]: string
}

const REQUEST_NAME: REQUEST_NAME_TYPE = {
  POST_LOGIN_LOGIN,
  GET_USER_FIND_ALL_USER,
  GET_USER_FIND_ALL_USER_BY_PARAM,
  GET_STATISTICS_STAT_SYS_TOPIC,
  GET_STATISTICS_STAT_TOPIC_DATA,
  GET_TOPICS_FIND_ALL,
  // GET_TOPICS_FIND_ALL_TOPIC,
  GET_SUB_MODERATIONS_SELECT_STATUS,
  GET_SUB_MODERATIONS_SELECT_AUDIT_STATUS,
  GET_USER_ADDUSER_FIND_ALL_ROLE,
  GET_USER_ADDUSER_GET_SYSTEM_INFO_ADD_ADDUSER,
  POST_USER_ADD_USER,
  GET_PERMISSION_FIND_ALL_PERMISSION,
  POST_PERMISSION_ADD_PERMISSION,
  GET_PERMISSION_DELETE,
  PUT_PERMISSION_UPDATE_PERMISSION,
  GET_PERMISSION_FIND_ALL_PERMISSION_BY_PARAM,
  GET_ROLE_FIND_ALL_ROLE,
  GET_PERMISSION_AUTHORIZATION_FIND_ALL_PERMISSION,
  GET_ROLE_FIND_ALL_ROLE_BY_PARAM,
  POST_ROLE_ADDROLE,
  PUT_ROLE_UPDATEROLE,
  GET_PERMISSION_AUTHORIZATION_FINDPERMISSIONLISTBYROLEID,
  POST_PERMISSION_AUTHORIZATION_ADDROLEIDPERMISSIONID,
  GET_TOPICS_MYTOPICS,
  GET_TOPICS_MYTOPICSBYID,
  GET_TOPICS_SELECTTOPIC,
  // GET_TOPICS_SELECTTOPICBYTIDTNAME,
  POST_SUBMODERATIONS_INSERTSUBMODERATION,
  POST_TOPICS_DELSUBUSER,
  POST_SUBMODERATIONS_UPDATESUBMODERATION,
  GET_SUBMODERATIONS_SELECTBYUSERNAMESTATUS,
  GET_SUBMODERATIONS_SELECTAUDITSTATUSBYTOPICID,
  GET_SYSTEM_FINDALL,
  GET_SYSTEM_GETINFOBYTYPENAME,
  GET_SYSTEM_DELCONFIG,
  POST_SYSTEM_ADDCONFIG,
  GET_SYSNET_GETBINDLIST,
  GET_SYSNET_GETBINDBYNAME,
  GET_SYSNET_GETSYSNETLIST,
  GET_LOGMGT_VIEWLOG_LOG_FINDALLLOG,
  GET_SYSTEM_GETSYSTEMINFO,
  POST_TOPICS_ADD,
  GET_TOPICS_DELETE,
  GET_TOPICS_INFORMATION,
  GET_TOPICS_CHECKED,
  POST_TOPICS_UPDATE,
  GET_SYSNET_ADDBINDINFO,
  POST_USER_UPDATE_USER,
  GET_ROLE_DELETE,
  POST_SYSNET_DELETEBINDINFO,
  POST_TRANSMISSION_ATS,
  GET_CMD_FIND_ALL,
  GET_CMD_MYCMD,
  // GET_CMD_MYCMDBYID,
  GET_CMD_SELECTCMD,
  GET_CMD_CHECKED,
  POST_CMD_ADD,
  POST_CMD_UPDATE,
  GET_CMD_DELETE,
  GET_TRANSMISSION_REALTIME,
  GET_TRANSMISSION_HISTORY,
  GET_TOPICS_PROTOBUFDOWNLOAD,
  GET_TOPICS_FINDALLSUBTOPIC,
  GET_TOPICS_SELECTSUBTOPICBYID,
  GET_VIDEO_ADDRESS,
  POST_TOPIC_ADDPROTOBUFTOPIC,
  GET_CMD_FINDMYCMDINFOBYID,
  GET_TOPICS_GETOFFLINELOG,
  GET_TOPICS_GETVIDEO,
  POST_TOPICS_UPDATETRANSACTIONALTOPIC
}

export default REQUEST_NAME
