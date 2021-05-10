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
const GET_STATISTICS_STAT_TOPIC_DATA = '/statistics/statTopicData' // 系统统计 隐藏页
const GET_STATISTICS_STAT_SYS_TOPIC = '/statistics/statSysTopic' // 系统统计 隐藏页
const POST_USER_UPDATEPASSWORD = '/user/updatePassword' // 用户修改自己密码
// const GET_SYSTEM_GETSYSTEMINFO = '/system/getSystemInfo' // 获取系统信息 全局 与 /user/addUser/getSystemInfoAndAddUser 重复
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
const GET_TOPICS_SELECTSUBTOPICBYIDORNAME = '/topics/selectSubTopicByIdOrName' // 通过id查询主题
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
const GET_SUBMODERATIONS_SELECTMYSUBTOPICBYTOPICIDORNAME = '/subModerations/selectMySubTopicByTopicIdOrTopicName' // 搜索我的订阅
// /topics/alterTopic ?
// /topics/addSubUser ?

// ---------------------------  离线数据 ----------------------------
const GET_OFFLINE_FINDALLTASK = '/offline/findAllTask' //查询所有任务
const GET_OFFLINE_FINDALLTASKBYID = '/offline/findAllTaskById' //根据id查询所有任务
const GET_OFFLINE_FINDMYTASK = '/offline/findMyTask' //查询我的任务
const GET_OFFLINE_FINDMYTASKBYID = '/offline/findMyTaskById' //根据id查询我的任务
const GET_OFFLINE_STOPTASK = '/offline/stopTask' //停止任务
const GET_OFFLINE_STARTTASK = '/offline/startTask' //启动任务
const GET_OFFLINE_DELETETASK = '/offline/deleteTask' //删除任务
const GET_OFFLINE_RUNTASKAGAIN = '/offline/runTaskAgain' //重跑任务
const POST_OFFLINE_SAVEURLTASK = '/offline/saveUrlTask' //添加url任务
const POST_OFFLINE_SAVEFTPTASK = '/offline/saveFtpTask' //添加ftp任务
const POST_OFFLINE_UPDATEURLTASK = '/offline/updateUrlTask' //修改url任务
const POST_OFFLINE_UPDATEFTPTASK = '/offline/updateFtpTask' //修改ftp任务
const GET_OFFLINE_SELECTTOPICBYTYPE = '/offline/selectTopicByType' // 获得可用主题
const GET_OFFLINE_SELECTOFFLINELOG = '/offline/selectOfflineLog'

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
const GET_LOGMGT_VIEWLOG_LOG_EXPORTSYSLOG = '/logMGT/viewLog/log/exportSysLog'
const GET_LOGMGT_VIEWLOG_LOG_SYSLOGCOUNT = '/logMGT/viewLog/log/sysLogCount'
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
const GET_TOPICS_STARTVIDEOTOPIC = '/topics/startVideoTopic' // 启动视频
const GET_TOPICS_STOPVIDEOTOPIC = '/topics/stopVideoTopic' // 停止视频
const POST_TOPICS_UPDATEVIDEOTOPIC = '/topics/updateVideoTopic' // 更新视频主题
const GET_STATISTICS_STATVIDEOTOPICDATA = '/statistics/statVideoTopicData'
const GET_SELECT_VIDEO_TOPIC_BY_ID_OR_KEYWORD = `/topics/selectVideoTopicByIdOrKeyword` //视频主题按主题ID或者关键字查询
const GET_SELECT_MYVIDEO_TOPIC_BY_ID_OR_KEYWORD = `/topics/selectMyVideoTopicByIdOrKeyword` //我的视频主题按主题ID或者关键字查询
const GET_VIDEO_PERIOD = `/topics/videoPeriod` //视频时间区间

// ----------------------------- 日志数据 ---------------------------
const POST_TOPICS_ADDLOGGERTOPIC = '/topics/addLoggerTopic'
const POST_TOPICS_UPDATELOGGERTOPIC = '/topics/updateLoggerTopic'
const GET_TOPICS_DELETELOOGGERTOPIC = '/topics/deleteLoggerTopic'
const GET_TOPICS_SELECTLOGGERTOPICBYTOPICID = '/topics/selectLoggerTopicByTopicId'
const GET_TOPICS_STATISTICSLOGGERTOPICBYTOPICIDANDDAY = '/topics/statisticsLoggerTopicByTopicIdAndDay'
const GET_TOPICS_STATISTICSLOGGERTOPICBYTOPICIDANDDAYAND30DAYS = '/topics/statisticsLoggerTopicByTopicIdAnd30Days'
const GET_TOPICS_STATISTICSALLLOGGERTOPICBYDAYTIME = '/topics/statisticsAllLoggerTopicByDayTime'
const GET_TOPICS_STOPLOGGERCOLLECTIONTASK = '/topics/stopLoggerCollectionTask' // 停止
const GET_TOPICS_STARTLOGGERCOLLECTIONTASK = '/topics/startLoggerCollectionTask' // 启动
const POST_TOPICS_ADDFOLLOW = '/topics/addfollow' //添加关注
const GET_TOPICS_LOGGER_TOPIC_STATISTICS_BY_DAYTIME = '/topics/loggerTopicStatisticsByDayTime'
const GET_TOPICS_LOGGER_TOPIC_STATISTICS_ADD_TOPIC = '/topics/loggerTopicStatisticsAddTopic'
const GET_TOPICS_CANCEL_FOLLOW = '/topics/cancelFollow'

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
const GET_TASKINFO_SELECTTRANSCATIONTOPIC = '/taskInfo/selectTranscationTopic' //查找未被引用的事务主题
const GET_TASKINFO_FINDALLTASK = '/taskInfo/findAllTask' // 事务作业列表
const GET_TASKINFO_FINDALLTASKBYTASKID = '/taskInfo/findAllTaskByTaskId' // 根据id查任务
const POST_TASKINFO_ADDDATATASK = '/taskInfo/addDataTask' // 添加事务任务
const POST_TASKINFO_UPDATETASKINFORDB = '/taskInfo/updateTaskInfoRdb' // 修改事务任务
const GET_TASKINFO_FINDALLMYTASK = '/taskInfo/findAllMyTask' // 我的事务作业
const GET_TASKINFO_DELETEDATATASK = '/taskInfo/deleteDataTask' // 删除任务
const GET_TASKINFO_UPDATETASKINFOSTATE = '/taskInfo/updateTaskInfoState' //更新任务运行状态
const GET_TASKINFO_RUNTASKAGAIN = '/taskInfo/runTaskAgain' // 任务重跑
const GET_TASKINFO_FINDALLMYTASKBYID = '/taskInfo/findAllMyTaskByTaskId' // 根据id查找我的事务作业任务
const GET_TASKINFO_FINDTRANSCATIONLOG = '/taskInfo/findTranscationLog' // 事务运行日志

// ----------------------------- 内部调试页面 未配置权限 --------------
const POST_TRANSMISSION_ATS = '/transmission/ATS'
const GET_TRANSMISSION_REALTIME = '/transmission/realtime/ATS'
const GET_TRANSMISSION_HISTORY = '/transmission/history/ATS'

// ----------------------------- 废弃API ----------------------------
//  const GET_TOPICS_SELECTTOPICBYTIDTNAME = '/topics/selectTopicByTIdTName'
//  const GET_TOPICS_FIND_ALL_TOPIC = '/topics/findAllTopic'

const REQUEST_NAME = {
  GET_OFFLINE_FINDALLTASK,
  GET_OFFLINE_FINDALLTASKBYID,
  GET_OFFLINE_FINDMYTASK,
  GET_OFFLINE_FINDMYTASKBYID,
  GET_OFFLINE_STOPTASK,
  GET_OFFLINE_STARTTASK,
  GET_OFFLINE_DELETETASK,
  GET_OFFLINE_RUNTASKAGAIN,
  POST_OFFLINE_SAVEURLTASK,
  POST_OFFLINE_SAVEFTPTASK,
  POST_OFFLINE_UPDATEURLTASK,
  POST_OFFLINE_UPDATEFTPTASK,
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
  GET_LOGMGT_VIEWLOG_LOG_EXPORTSYSLOG,
  POST_TOPICS_ADDFOLLOW,
  GET_TOPICS_LOGGER_TOPIC_STATISTICS_BY_DAYTIME,
  GET_TOPICS_LOGGER_TOPIC_STATISTICS_ADD_TOPIC,
  GET_TOPICS_CANCEL_FOLLOW,
  // GET_SYSTEM_GETSYSTEMINFO,
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
  GET_TOPICS_SELECTSUBTOPICBYIDORNAME,
  GET_VIDEO_ADDRESS,
  GET_SELECT_VIDEO_TOPIC_BY_ID_OR_KEYWORD,
  GET_SELECT_MYVIDEO_TOPIC_BY_ID_OR_KEYWORD,
  GET_VIDEO_PERIOD,
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
  GET_SUBMODERATIONS_SELECTMYSUBTOPICBYTOPICIDORNAME,
  GET_TOPICS_CHECKUSERUPLOADTASKSTATUS,
  GET_TOPICS_GETOFFLINELOGBYTOPICID,
  GET_TOPICS_STATISTICSLOGGERTOPICBYTOPICIDANDDAY,
  GET_TOPICS_STATISTICSLOGGERTOPICBYTOPICIDANDDAYAND30DAYS,
  GET_TASKINFO_SELECTTRANSCATIONTOPIC,
  GET_TASKINFO_FINDALLTASK,
  GET_TASKINFO_FINDALLTASKBYTASKID,
  POST_TASKINFO_ADDDATATASK,
  GET_TOPICS_STARTVIDEOTOPIC,
  GET_TOPICS_STOPVIDEOTOPIC,
  POST_TOPICS_UPDATEVIDEOTOPIC,
  GET_TOPICS_STATISTICSALLLOGGERTOPICBYDAYTIME,
  GET_TOPICS_STOPLOGGERCOLLECTIONTASK,
  GET_TOPICS_STARTLOGGERCOLLECTIONTASK,
  GET_STATISTICS_STATVIDEOTOPICDATA,
  POST_TASKINFO_UPDATETASKINFORDB,
  GET_TASKINFO_FINDALLMYTASK,
  GET_TASKINFO_DELETEDATATASK,
  GET_TASKINFO_UPDATETASKINFOSTATE,
  GET_TASKINFO_RUNTASKAGAIN,
  GET_TASKINFO_FINDALLMYTASKBYID,
  GET_TASKINFO_FINDTRANSCATIONLOG,
  GET_LOGMGT_VIEWLOG_LOG_SYSLOGCOUNT,
  GET_OFFLINE_SELECTTOPICBYTYPE,
  GET_OFFLINE_SELECTOFFLINELOG,
  POST_USER_UPDATEPASSWORD
}

export default REQUEST_NAME
