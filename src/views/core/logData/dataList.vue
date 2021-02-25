<template>
  <div id="LogDataList">
    <v-row>
      <v-col cols="3">
        <v-text-field
          solo
          dense
          height="35px"
          placeholder="请输入查找的日志主题ID"
          clearable
          append-icon="mdi-magnify"
          @click:append="searchTopic"
          @click:clear="tabChange(tab)"
          v-model="queryTopicID"
          v-only-num
        >
        </v-text-field>
      </v-col>
      <v-col cols="9">
        <v-btn color="primary" width="95px" height="35px" depressed class="mr-6" small dark @click="createLogTopic"
          >创建日志主题</v-btn
        >
      </v-col>
    </v-row>
    <v-tabs v-model="tab" @change="tabChange">
      <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item">
        <h-table
          :headers="headers"
          :loading="loading"
          :desserts="desserts"
          :pageNum="pageNum"
          @PaginationNow="PaginationNow"
          :paginationLength="paginationLength"
        >
          <template v-slot:buttons>
            <!-- <v-btn text color="primary">操作</v-btn> -->
          </template>
        </h-table>
      </v-tab-item>
    </v-tabs-items>

    <!-- 表单展示 -->
    <f-dialog v-if="fDialogFlag" v-model="fDialogFlag">
      <CreateLogTopic v-if="fDialogShow === 1" />
    </f-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { paramsType, returnDataType } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import { topicTable } from '@/type/topic.type'
import HTable from '@/components/h-table.vue'
import FDialog from '@/components/f-dialog.vue'
import { TopicAdd } from '@/type/topic-add.type'
import util from '@/decorator/utilsDecorator'
import { dataType } from '@/enum/topic-datatype-enum.ts'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum.ts'
import { FormObj } from '@/type/dialog-form.type'
import CreateLogTopic from './childComponent/createLogTopic.vue'

@Component({
  components: {
    HTable,
    FDialog,
    CreateLogTopic
  }
})
@http
@util
export default class LogDataList extends Vue {
  @Provide('formProvide') private formProvide: FormObj = new Vue({
    data() {
      return {
        title: '',
        btnName: [] as string[],
        methodName: '',
        formObj: {}
      }
    }
  })

  private tab = null
  private items = ['所有主题', '我的主题']
  private fDialogFlag = false // 弹窗展示
  private fDialogShow = 0
  private queryTopicID = '' // 查询主题ID input框内容
  private loading = true

  private desserts: Array<topicTable> = [] // 数据列表
  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 20 // 每页展示多少条数据
  // 主题ID 主题名称 用户 日志采集路径 服务器地址 服务器用户名（暂定）
  private headers = [
    // 表头内容 所有主题
    {
      text: '主题ID',
      align: 'center',
      value: 'id'
    },
    {
      text: '主题名称',
      align: 'center',
      value: 'topicName'
    },
    {
      text: '所属用户',
      align: 'center',
      value: 'userName'
    },
    {
      text: '日志采集路径',
      align: 'center',
      value: 'topicInterFaceType'
    },
    {
      text: '服务器地址',
      align: 'center',
      value: 'serviceUrl'
    },
    {
      text: '服务器用户名',
      align: 'center',
      value: 'serviceUserName'
    },
    {
      text: '操作',
      align: 'center',
      slot: 'buttons'
    }
  ]

  // 创建日志主题
  private createLogTopic() {
    this.fDialogFlag = true
    this.fDialogShow = 1
    this.formProvide.btnName = ['立即创建']
    this.formProvide.title = '创建日志主题'
    this.formProvide.methodName = 'addLogTopic' // 立即提交
    this.formProvide.formObj = {
      passWord: '******'
    }
  }

  // 创建日志主题
  private async addLogTopic(formObj: TopicAdd) {
    console.log(formObj)
    // const canNotEdit = formObj.canNotEdit

    // const params: any = {
    //   dataType: dataType['结构化']
    // }
    // params.topicName = formObj.topicName
    // params.dataBaseType = formObj.dataBaseType
    // params.dataBaseIp = formObj.dataBaseIp
    // params.topicInterFaceType = 2

    // const { success } = await this.h_request['httpPOST'](!canNotEdit ? 'POST_TOPICS_ADD' : 'POST_TOPICS_UPDATE', params)
    // if (success) {
    //   this.h_utils['alertUtil'].open(!canNotEdit ? '主题创建成功' : '主题修改成功', true, 'success')
    //   this.searchMethod(
    //     false,
    //     {
    //       pageSize: this.pageSize,
    //       pageNum: 1
    //     },
    //     !!this.tab
    //   )
    //   this.pageNum = 1
    //   return Promise.resolve(success)
    // }
  }

  // 查询通用调用方法
  private async searchMethod(bool: boolean, params: paramsType, tab?: boolean) {
    this.loading = true

    params.dataType = dataType['结构化']
    params.faceTypes = `${topicInterFaceType['数据库采集']}`
    if (tab) {
      const { data }: returnDataType = bool
        ? await this.h_request['httpGET']<object>('GET_TOPICS_MYTOPICSBYID', params)
        : await this.h_request['httpGET']<object>('GET_TOPICS_MYTOPICS', params)
      this.desserts = data.list.map((item: any) => {
        return { ...item, flag: false }
      })
      this.paginationLength = Math.ceil(data['total'] / this.pageSize) || 1
    } else {
      const { data }: returnDataType = bool
        ? await this.h_request['httpGET']<object>('GET_TOPICS_SELECTTOPIC', params)
        : await this.h_request['httpGET']<object>('GET_TOPICS_FIND_ALL', params)
      this.desserts = data.list.map((item: any) => {
        return { ...item, flag: false }
      })
      this.paginationLength = Math.ceil(data['total'] / this.pageSize) || 1
    }
    this.loading = false
  }

  // 主题查询
  private searchTopic() {
    if (!this.queryTopicID) {
      this.searchMethod(
        false,
        {
          pageNum: 1,
          pageSize: this.pageSize
        },
        !!this.tab
      )
    } else {
      this.searchMethod(
        true,
        {
          topicID: this.queryTopicID,
          pageNum: 1,
          pageSize: this.pageSize
        },
        !!this.tab
      )
    }
    this.pageNum = 1
  }

  // tab切换方法
  private tabChange(tab: number) {
    this.searchMethod(
      false,
      {
        pageSize: this.pageSize,
        pageNum: 1
      },
      !!tab
    )
    this.pageNum = 1
  }

  // 分页方法
  private PaginationNow(page: number) {
    this.pageNum = page
    this.searchMethod(
      false,
      {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      },
      !!this.tab
    )
  }
}
</script>
