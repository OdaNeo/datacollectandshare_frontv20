const POST_LOGIN_LOGIN = '/login/login'

// -------------------------- 权限管理 ----------------------------
const GET_USER_FIND_ALL_USER = '/user/findAllUser'
const POST_ROLE_ADDROLE = '/role/addRole'
const PUT_ROLE_UPDATEROLE = '/role/updateRole'
const GET_ROLE_DELETE = '/role/delete'
const GET_USER_FIND_ALL_USER_BY_PARAM = '/user/findAllUserByParam'
const POST_USER_ADD_USER = '/user/addUser'
const GET_USER_ADDUSER_FIND_ALL_ROLE = '/user/addUser/findAllRole'
const GET_USER_ADDUSER_GET_SYSTEM_INFO_ADD_ADDUSER = '/user/addUser/getSystemInfoAndAddUser'
const POST_USER_UPDATE_USER = '/user/updateUser'
const GET_PERMISSION_FIND_ALL_PERMISSION = '/permission/findAllPermission'
const GET_PERMISSION_FIND_ALL_PERMISSION_BY_PARAM = '/permission/findAllPermissionByParam'
const POST_PERMISSION_ADD_PERMISSION = '/permission/addPermission'
const PUT_PERMISSION_UPDATE_PERMISSION = '/permission/updatePermission'
const GET_PERMISSION_DELETE = '/permission/delete'
const GET_ROLE_FIND_ALL_ROLE = '/role/findAllRole'
const GET_ROLE_FIND_ALL_ROLE_BY_PARAM = '/role/findAllRoleByParam'
const GET_PERMISSION_AUTHORIZATION_FIND_ALL_PERMISSION = '/permission/authorization/findAllPermission'
const GET_PERMISSION_AUTHORIZATION_FINDPERMISSIONLISTBYROLEID = '/permission/authorization/findPermissionListByRoleId'
const POST_PERMISSION_AUTHORIZATION_ADDROLEIDPERMISSIONID = '/permission/authorization/addRoleIdPermissionId'
const GET_SYSTEM_GETSYSTEMINFO = '/system/getSystemInfo' // 获取系统信息 全局
const GET_STATISTICS_STAT_TOPIC_DATA = '/statistics/statTopicData' // 系统统计 隐藏页
const GET_STATISTICS_STAT_SYS_TOPIC = '/statistics/statSysTopic' // 系统统计 隐藏页
// /system/getSystemTypeInfo ？
// /user/delete/* ?
// /permission/findPermissionListByRoleId/* ?

// --------------------------- 实时数据 -------------------------
const GET_TOPICS_MYTOPICS = '/topics/myTopics'
const POST_TOPICS_ADD = '/topics/addTopic' // 增加主题
const POST_TOPICS_UPDATE = '/topics/updateTopic' // 更新主题
const GET_TOPICS_DELETE = '/topics/delTopic' // 删除主题
const GET_TOPICS_SELECTTOPIC = '/topics/selectTopic'
const GET_TOPICS_FIND_ALL = '/topics/findAll'
const GET_TOPICS_CHECKED = '/topics/findTopicByTopicName'
const GET_TOPICS_MYTOPICSBYID = '/topics/myTopicsById'
const GET_TOPICS_FINDALLSUBTOPIC = '/topics/findAllSubTopic' // 查询可订阅的主题
const GET_TOPICS_SELECTSUBTOPICBYID = '/topics/selectSubTopicById' // 通过id查询主题
const GET_TOPICS_INFORMATION = '/topics/findTopicAdditionalByTopicName' // 查询主题附加信息
const POST_SUBMODERATIONS_INSERTSUBMODERATION = '/subModerations/insertSubModeration'
const POST_TOPIC_ADDPROTOBUFTOPIC = '/topics/addProtobufTopic' // 上传proto文件
const GET_TOPICS_PROTOBUFDOWNLOAD = '/topics/protobufDownload' // 下载protobuf文件
const POST_TOPICS_DELSUBUSER = '/topics/delSubUser'
const GET_SUB_MODERATIONS_SELECT_STATUS = '/subModerations/selectStatus' // 获取审核列表
const GET_SUB_MODERATIONS_SELECT_AUDIT_STATUS = '/subModerations/selectAuditStatus' // 获取主题审核记录
const POST_SUBMODERATIONS_UPDATESUBMODERATION = '/subModerations/updateSubModeration' // 审核操作
const GET_SUBMODERATIONS_SELECTBYUSERNAMESTATUS = '/subModerations/selectByUserNameStatus' // 通过订阅用户获取审核列表
const GET_SUBMODERATIONS_SELECTAUDITSTATUSBYTOPICID = '/subModerations/selectAuditStatusByTopicID' // 通过ID获取主题审核记录
const GET_SUBMODERATIONS_SELECTMYSUBTOPICLIST = '/subModerations/selectMySubTopicList' // 查看我的订阅
const GET_SUBMODERATIONS_SELECTMYSUBTOPICBYTOPICID = '/subModerations/selectMySubTopicByTopicId' // 搜索我的订阅
// /topics/alterTopic ?
// /topics/addSubUser ?

// --------------------------- 系统管理 --------------------------
const GET_SYSTEM_FINDALL = '/system/findAll' // 获取系统列表
const GET_SYSTEM_GETINFOBYTYPENAME = '/system/getInfoByTypeName'
const GET_SYSTEM_DELCONFIG = '/system/delConfig'
const POST_SYSTEM_ADDCONFIG = '/system/addConfig'
const GET_SYSNET_GETBINDLIST = '/sysnet/getBindList' // 绑定网络
const GET_SYSNET_GETBINDBYNAME = '/sysnet/getBindByName'
const GET_SYSNET_GETSYSNETLIST = '/sysnet/getSysNetList'
const GET_SYSNET_ADDBINDINFO = '/sysnet/addBindInfo'
const POST_SYSNET_DELETEBINDINFO = '/sysnet/delBindInfo'

// ---------------------------- 操作日志 ---------------------------
const GET_LOGMGT_VIEWLOG_LOG_FINDALLLOG = '/logMGT/viewLog/log/findAllLog'
// /logMGT/viewLog/log/findAllLogByParam ？

// ---------------------------- 可靠通道 ---------------------------
const GET_CMD_FIND_ALL = '/cmd/findAll'
const GET_CMD_MYCMD = '/cmd/findCmdInfoByUserId'
const GET_CMD_FINDMYCMDINFOBYID = '/cmd/findMyCmdInfoById'
const GET_CMD_CHECKED = '/cmd/isRepeat' // 校验cmd是否存在
const GET_CMD_SELECTCMD = '/cmd/findCmdInfoById'
const POST_CMD_ADD = '/cmd/addCmdInfo' // 创建命令
const POST_CMD_UPDATE = '/cmd/updateCmdInfo'
const GET_CMD_DELETE = '/cmd/delCmdInfo'

// ----------------------------- 视频数据 ---------------------------
const GET_VIDEO_ADDRESS = '/topics/getVideoAddress' // 视频数据统计
const GET_TOPICS_GETVIDEO = '/topics/getVideo'

// ----------------------------- 日志数据 ---------------------------
const POST_TOPICS_ADDLOGGERTOPIC = '/topics/addLoggerTopic'
const POST_TOPICS_UPDATELOGGERTOPIC = '/topics/updateLoggerTopic'
const GET_TOPICS_DELETELOOGGERTOPIC = '/topics/deleteLoggerTopic'
const GET_TOPICS_SELECTLOGGERTOPICBYTOPICID = '/topics/selectLoggerTopicByTopicId'
const GET_TOPICS_STATISTICSLOGGERTOPICBYTOPICID = '/topics/statisticsLoggerTopicByTopicId'

// ----------------------------- 作业监控 ------------------------
const GET_MONITOR_FIND_ALL_MONITOR_LOG_BY_TIME = '/monitor/findAllMonitorLogByTime'
const GET_MONITOR_FIND_ALL_MONITOR_LOG = '/monitor/findAllMonitorLog'
const POST_MONITOR_FINDLOGBYTIME = '/monitor/findLogByTime'

// ----------------------------- 事务数据 ---------------------------
const GET_TOPICS_GETOFFLINELOG = '/topics/getOfflineLog'
const POST_TOPICS_UPDATETRANSACTIONALTOPIC = '/topics/updateTransactionalTopic'
const GET_TOPICS_UPDATETRANSACTIONALTOPICSTATE = '/topics/updateTransactionalTopicState'
const GET_TOPICS_RUNTRANSACTIONALTOPICAGAIN = '/topics/runTransactionalTopicAgain'
const POST_TOPICS_ADDSQLFILE = '/topics/addSqlFile'
const GET_TOPICS_SELECTSQLFILELOG = '/topics/selectSqlFileLog'
const GET_TOPICS_SQLFILERECORD = '/topics/getSqlFileRecord'
const GET_TOPICS_CHECKUSERUPLOADTASKSTATUS = '/topics/checkUserUploadTaskStatus'
const GET_TOPICS_GETOFFLINELOGBYTOPICID = '/topics/getOfflineLogByTopicId'

// ----------------------------- 内部调试页面 未配置权限 --------------
const POST_TRANSMISSION_ATS = '/transmission/ATS'
const GET_TRANSMISSION_REALTIME = '/transmission/realtime/ATS'
const GET_TRANSMISSION_HISTORY = '/transmission/history/ATS'

// ----------------------------- 废弃API ----------------------------
//  const GET_TOPICS_SELECTTOPICBYTIDTNAME = '/topics/selectTopicByTIdTName'
//  const GET_TOPICS_FIND_ALL_TOPIC = '/topics/findAllTopic'

const REQUEST_NAME = {
  POST_LOGIN_LOGIN,
  GET_USER_FIND_ALL_USER,
  GET_USER_FIND_ALL_USER_BY_PARAM,
  GET_STATISTICS_STAT_SYS_TOPIC,
  GET_STATISTICS_STAT_TOPIC_DATA,
  GET_TOPICS_FIND_ALL,
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
  POST_TOPICS_UPDATETRANSACTIONALTOPIC,
  POST_TOPICS_ADDLOGGERTOPIC,
  GET_MONITOR_FIND_ALL_MONITOR_LOG,
  GET_MONITOR_FIND_ALL_MONITOR_LOG_BY_TIME,
  POST_TOPICS_UPDATELOGGERTOPIC,
  GET_TOPICS_DELETELOOGGERTOPIC,
  GET_TOPICS_SELECTLOGGERTOPICBYTOPICID,
  GET_TOPICS_UPDATETRANSACTIONALTOPICSTATE,
  GET_TOPICS_RUNTRANSACTIONALTOPICAGAIN,
  POST_MONITOR_FINDLOGBYTIME,
  POST_TOPICS_ADDSQLFILE,
  GET_TOPICS_SELECTSQLFILELOG,
  GET_TOPICS_SQLFILERECORD,
  GET_SUBMODERATIONS_SELECTMYSUBTOPICLIST,
  GET_SUBMODERATIONS_SELECTMYSUBTOPICBYTOPICID,
  GET_TOPICS_CHECKUSERUPLOADTASKSTATUS,
  GET_TOPICS_GETOFFLINELOGBYTOPICID,
  GET_TOPICS_STATISTICSLOGGERTOPICBYTOPICID
}

export default REQUEST_NAME
