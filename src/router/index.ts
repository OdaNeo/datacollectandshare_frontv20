import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Login from '@/views/Login/Login.vue'
import StatePage from '@/views/layout/index.vue'


Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect:"/login"
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/statePage",
    name: "statePage",
    component: StatePage,
    redirect: "/statePage/welcome",
    meta: {
      title:"tct"
    },
    children: [
      {
        path: "welcome",
        component: () => import("@/views/core/statePage/welcome.vue"),
        name: "welcome",
        meta: {
          title: "欢迎页面"
        }
      },
      {
        path: "404",
        component: () => import("@/views/core/statePage/404Page.vue"),
        name: "404",
        meta: {
          title:"404页面"
        }
      }
    ]
  },
  {
    path:"/rootMGT",
    name:"权限管理",
    component:StatePage,
    redirect:"/rootMGT/userMGT",
    meta:{
      title:"权限管理",
      icon:"mdi-shield-lock"
    },
    children:[
      {
          path:"userMGT",
          component:() => import("@/views/core/root/user.vue"),
          name:"用户管理",
          meta:{
              title:"用户管理",
              icon:"mdi-shield-account"
          }
      },
      {
          path:"roleMGT",
          component:() => import("@/views/core/root/role.vue"),
          name:"角色管理",
          meta:{
              title:"角色管理",
              icon:"mdi-account-tie"
          }
      },
      {
          path:"resourcesMGT",
          component:() => import("@/views/core/root/resources.vue"),
          name:"资源管理",
          meta:{
              title:"资源管理",
              icon:"mdi-briefcase-check"
          }
      }
    ]
  },
  {
    path: "/topicController",
    name: "主题管理",
    component: StatePage,
    redirect: "/topicController/topicList",
    meta: {
      title: '主题管理',
      icon:"mdi-shield-lock"
    },
    children: [
      {
        path: "topicList",
        component: () => import("@/views/core/topicController/topicList.vue"),
        name: "主题列表",
        meta: {
          title: "主题列表",
          icon:"mdi-shield-lock"
        }
      },
      {
        path: "topicSub",
        component: () => import("@/views/core/topicController/topicSub.vue"),
        name: "主题订阅",
        meta: {
          title: "主题订阅",
          icon:"mdi-shield-lock"
        }
      },
      {
        path: "topicSubExamine",
        component: () => import("@/views/core/topicController/topicSubExamine.vue"),
        name: "主题订阅审核",
        meta: {
          title: "主题订阅审核",
          icon:"mdi-shield-lock"
        }
      },
      {
        path: "topicAuditRecords",
        component: () => import("@/views/core/topicController/topicAuditRecords.vue"),
        name: "主题审核记录",
        meta: {
          title: "主题审核记录",
          icon:"mdi-shield-lock"
        }
      },
    ]
  },
  {
    path:"/systemMGT",
    name:"系统管理",
    component:StatePage,
    redirect:"/systemMGT/systemConfig",
    meta:{
      title:"系统管理",
      icon:"mdi-shield-lock"
    },
    children:[
      {
        path:"systemConfig",
        component:() => import("@/views/core/system/systemConfig.vue"),
        name:"系统配置",
        meta:{
          title:"系统配置",
          icon:"mdi-shield-lock"
        }
      },
      {
        path:"bindNetwork",
        component:()=>import("@/views/core/system/bindNetwork.vue"),
        name:"绑定网络",
        meta:{
          title:"绑定网络",
          icon:"mdi-shield-lock"
        }
      }
    ]
  },
  {
    path:"/logMGT",
    name:"日志管理",
    component:StatePage,
    redirect:"/logMGT/viewLog",
    meta:{
      title:"日志管理",
      icon:"mdi-shield-lock"
    },
    children:[
      {
        path:'viewLog',
        component:() => import("@/views/core/log/viewLog.vue"),
        name:"日志审查",
        meta:{
          title:"日志审查",
          icon:"mdi-shield-lock"
        }
      }
    ]
  },
  {
    path:"/dataMGT",
    name:"数据管理",
    component:StatePage,
    redirect:"/dataMGT/dataStatistics",
    meta:{
      title:"数据管理",
      icon:"mdi-shield-lock"
    },
    children:[
      {
        path:"dataStatistics",
        component: () => import("@/views/core/data/dataStatistics.vue"),
        name:"数据统计",
        meta:{
          title:"数据统计",
          icon:"mdi-shield-lock"
        }
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
