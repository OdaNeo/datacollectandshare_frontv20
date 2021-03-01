import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Login from '@/views/Login/Login.vue'
import StatePage from '@/views/layout/index.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      access: false
    }
  },
  {
    path: '/statePage',
    name: 'statePage',
    component: StatePage,
    redirect: '/statePage/welcome',
    meta: {
      title: 'tct',
      access: false
    },
    children: [
      {
        path: 'welcome',
        component: () => import('@/views/core/statePage/welcome.vue'),
        name: 'welcome',
        meta: {
          title: '欢迎页面',
          access: false
        }
      },
      {
        path: '404',
        component: () => import('@/views/core/statePage/404Page.vue'),
        name: '404',
        meta: {
          title: '404页面',
          access: false
        }
      }
    ]
  },
  // 权限管理
  {
    path: '/rootMGT',
    name: '权限管理',
    component: StatePage,
    redirect: '/rootMGT/userMGT',
    meta: {
      title: '权限管理',
      icon: 'mdi-shield-lock',
      access: true,
      url: '/rootMGT'
    },
    children: [
      {
        path: 'userMGT',
        component: () => import('@/views/core/root/user.vue'),
        name: '用户管理',
        meta: {
          title: '用户管理',
          // icon: 'mdi-shield-account',
          access: true,
          url: '/rootMGT/userMGT'
        }
      },
      {
        path: 'roleMGT',
        component: () => import('@/views/core/root/role.vue'),
        name: '角色管理',
        meta: {
          title: '角色管理',
          // icon: 'mdi-account-tie',
          access: true,
          url: '/rootMGT/roleMGT'
        }
      },
      {
        path: 'resourcesMGT',
        component: () => import('@/views/core/root/resources.vue'),
        name: '资源管理',
        meta: {
          title: '资源管理',
          // icon: 'mdi-briefcase-check',
          access: true,
          url: '/rootMGT/resourcesMGT'
        }
      }
    ]
  },
  // 实时数据
  {
    path: '/onLineData',
    name: '实时数据',
    component: StatePage,
    redirect: '/onLineData/topicList',
    meta: {
      title: '实时数据',
      icon: 'mdi-folder-cog-outline',
      access: true,
      url: '/onLineData'
    },
    children: [
      {
        path: 'topicList',
        component: () => import('@/views/core/onLineData/topicList.vue'),
        name: '实时主题',
        meta: {
          title: '实时主题',
          // icon: 'mdi-folder-multiple',
          access: true,
          url: '/onLineData/topicList'
        }
      },
      {
        path: 'dataStatistics',
        component: () => import('@/views/core/onLineData/dataStatistics.vue'),
        name: '实时数据统计',
        meta: {
          title: '实时数据统计',
          // icon: 'mdi-folder-multiple',
          access: true,
          url: '/onLineData/dataStatistics'
        }
      },
      {
        path: 'topicSub',
        component: () => import('@/views/core/onLineData/topicSub.vue'),
        name: '主题订阅',
        meta: {
          title: '主题订阅',
          // icon: 'mdi-folder-heart',
          access: true,
          url: '/onLineData/topicSub'
        }
      },
      {
        path: 'topicSubExamine',
        component: () => import('@/views/core/onLineData/topicSubExamine.vue'),
        name: '主题订阅审核',
        meta: {
          title: '主题订阅审核',
          // icon: 'mdi-folder-edit',
          access: true,
          url: '/onLineData/topicSubExamine'
        }
      },
      {
        path: 'topicAuditRecords',
        component: () => import('@/views/core/onLineData/topicAuditRecords.vue'),
        name: '主题审核记录',
        meta: {
          title: '主题审核记录',
          // icon: 'mdi-folder-clock',
          access: true,
          url: '/onLineData/topicAuditRecords'
        }
      }
    ]
  },
  // 视频数据
  {
    path: '/videoData',
    name: '视频数据',
    component: StatePage,
    redirect: '/videoData/videoList',
    meta: {
      title: '视频数据',
      icon: 'mdi-video-box',
      access: true,
      url: '/videoData'
    },
    children: [
      {
        path: 'videoList',
        component: () => import('@/views/core/videoData/videoList.vue'),
        name: '视频主题',
        meta: {
          title: '视频主题',
          // icon: 'mdi-file-video',
          access: true,
          url: '/videoData/videoList'
        }
      },
      {
        path: 'dataStatistics',
        component: () => import('@/views/core/videoData/dataStatistics.vue'),
        name: '视频数据统计',
        meta: {
          title: '视频数据统计',
          // icon: 'mdi-file-video',
          access: true,
          url: '/videoData/dataStatistics'
        }
      }
    ]
  },
  // 离线数据
  {
    path: '/offlineData',
    name: '离线数据',
    component: StatePage,
    redirect: '/offlineData/topicList',
    meta: {
      title: '离线数据',
      icon: 'mdi-file-replace-outline',
      access: true,
      url: '/offlineData'
    },
    children: [
      {
        path: 'topicList',
        component: () => import('@/views/core/offlineData/topicList.vue'),
        name: '离线主题',
        meta: {
          title: '离线主题',
          // icon: 'mdi-file-video',
          access: true,
          url: '/offlineData/topicList'
        }
      },
      {
        path: 'dataStatistics',
        component: () => import('@/views/core/offlineData/dataStatistics.vue'),
        name: '离线数据统计',
        meta: {
          title: '离线数据统计',
          // icon: 'mdi-file-video',
          access: true,
          url: '/offlineData/dataStatistics'
        }
      }
    ]
  },
  // 事务数据
  {
    path: '/transactionalData',
    name: '事务数据',
    component: StatePage,
    redirect: '/transactionalData/dataList',
    meta: {
      title: '事务数据',
      icon: 'mdi-file-excel-box-outline',
      access: true,
      url: '/transactionalData'
    },
    children: [
      {
        path: 'dataList',
        component: () => import('@/views/core/transactionalData/dataList.vue'),
        name: '事务主题',
        meta: {
          title: '事务主题',
          // icon: 'mdi-file-video',
          access: true,
          url: '/transactionalData/dataList'
        }
      },
      {
        path: 'dataStatistics',
        component: () => import('@/views/core/transactionalData/dataStatistics.vue'),
        name: '事务数据统计',
        meta: {
          title: '事务数据统计',
          // icon: 'mdi-file-video',
          access: true,
          url: '/transactionalData/dataStatistics'
        }
      }
    ]
  },
  // 日志数据
  {
    path: '/logData',
    name: '日志数据',
    component: StatePage,
    redirect: '/logData/dataList',
    meta: {
      title: '日志数据',
      icon: 'mdi-file-table-box-outline',
      access: true,
      url: '/logData'
    },
    children: [
      {
        path: 'dataList',
        component: () => import('@/views/core/logData/dataList.vue'),
        name: '日志主题',
        meta: {
          title: '日志主题',
          // icon: 'mdi-file-video',
          access: true,
          url: '/logData/dataList'
        }
      },
      {
        path: 'dataStatistics',
        component: () => import('@/views/core/logData/dataStatistics.vue'),
        name: '日志数据统计',
        meta: {
          title: '日志数据统计',
          // icon: 'mdi-file-video',
          access: true,
          url: '/logData/dataStatistics'
        }
      }
    ]
  },
  // 可靠通道
  {
    path: '/cmdInfoData',
    name: '可靠通道',
    component: StatePage,
    redirect: '/cmdInfoData/cmdList',
    meta: {
      title: '可靠通道',
      icon: 'mdi-console',
      access: true,
      url: '/cmdInfoData'
    },
    children: [
      {
        path: 'cmdList',
        component: () => import('@/views/core/cmdInfoData/cmdList.vue'),
        name: '可靠通道主题',
        meta: {
          title: '可靠通道主题',
          access: true,
          url: '/cmdInfoData/cmdList'
        }
      }
    ]
  },
  // 采集监控 ：时间 主题（事务 视频 日志） 服务名 状态（告警error 离线offline 警告warring） 轮询
  {
    path: '/dataMonitor',
    name: '采集监控',
    component: StatePage,
    redirect: '/dataMonitor/dataList',
    meta: {
      title: '采集监控',
      icon: 'mdi-monitor-screenshot',
      access: true,
      url: '/dataMonitor'
    },
    children: [
      {
        path: 'dataList',
        component: () => import('@/views/core/dataMonitor/dataList.vue'),
        name: '监控日志',
        meta: {
          title: '监控日志',
          access: true,
          url: '/dataMonitor/dataList'
        }
      }
    ]
  },
  // 系统管理
  {
    path: '/systemMGT',
    name: '系统管理',
    component: StatePage,
    redirect: '/systemMGT/systemConfig',
    meta: {
      title: '系统管理',
      icon: 'mdi-devices ',
      access: true,
      url: '/systemMGT'
    },
    children: [
      {
        path: 'systemConfig',
        component: () => import('@/views/core/system/systemConfig.vue'),
        name: '系统配置',
        meta: {
          title: '系统配置',
          // icon: 'mdi-monitor-edit',
          access: true,
          url: '/systemMGT/systemConfig'
        }
      },
      {
        path: 'bindNetwork',
        component: () => import('@/views/core/system/bindNetwork.vue'),
        name: '绑定网络',
        meta: {
          title: '绑定网络',
          // icon: 'mdi-monitor-star',
          access: true,
          url: '/systemMGT/bindNetwork'
        }
      }
    ]
  },
  // 操作日志
  {
    path: '/logMGT',
    name: '操作日志',
    component: StatePage,
    redirect: '/logMGT/viewLog',
    meta: {
      title: '操作日志',
      icon: 'mdi-clipboard-text-multiple',
      access: true,
      url: '/logMGT'
    },
    children: [
      {
        path: 'viewLog',
        component: () => import('@/views/core/log/viewLog.vue'),
        name: '日志审查',
        meta: {
          title: '日志审查',
          // icon: 'mdi-clipboard-search',
          access: true,
          url: '/logMGT/viewLog'
        }
      }
    ]
  },
  // 系统统计
  {
    path: '/dataMGT',
    name: '系统统计',
    component: StatePage,
    redirect: '/dataMGT/dataStatistics',
    meta: {
      title: '系统统计',
      icon: 'mdi-database-cog',
      access: true,
      url: '/dataMGT'
    },
    children: [
      {
        path: 'dataStatistics',
        component: () => import('@/views/core/data/dataStatistics.vue'),
        name: '数据统计',
        meta: {
          title: '数据统计',
          // icon: 'mdi-database-clock',
          access: true,
          url: '/dataMGT/dataStatistics'
        }
      }
    ]
  },
  {
    path: '/private',
    name: '内部调试页面',
    component: StatePage,
    redirect: '/private/topicProducerAndconsume',
    meta: {
      title: '内部调试页面',
      access: false
    },
    children: [
      {
        path: 'topicProducerAndconsume',
        component: () => import('@/views/private/topicProducerAndConsume.vue'),
        name: '主题生产消费测试',
        meta: {
          title: '主题生产消费测试',
          access: false
        }
      },
      {
        path: 'bulkCreateTopic',
        name: '批量创建主题',
        meta: {
          title: '批量创建主题',
          access: false
        },
        component: () => import('@/views/private/bulkCreateTopic.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
