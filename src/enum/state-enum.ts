/* eslint-disable no-unused-vars */
export enum stateColor {
  warning,
  success
}

// 视频
export enum videoState {
  已停止,
  已启动
}

// 日志
export enum logState {
  已停止,
  已启动
}

// 离线
export enum offlineState {
  已停止,
  已启动
}

// 事务
export enum transactionalState {
  已停止,
  已启动
}

// 事务执行结果
export enum transactionalResult {
  失败,
  成功,
  异常
}
export enum transactionalResultColor {
  error,
  success,
  warning
}
// 离线执行结果
export enum offlineResult {
  失败,
  成功,
  异常
}
export enum offlineResultColor {
  error,
  success,
  warning
}
