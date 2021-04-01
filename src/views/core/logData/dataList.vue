<template>
  <div id="LogDataList">
    <v-row>
      <HSearch
        v-model="queryTopicID"
        pl
        placeholder="请输入查找的日志主题ID"
        @append="searchTopic"
        @enter="searchTopic"
        @clear="tabChange(tab)"
        v-only-num
      />
      <v-col>
        <v-btn color="primary" depressed class="mr-6" small dark @click="createLogTopic()">创建日志主题</v-btn>
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
          <template v-slot:buttons="{ item }">
            <v-btn v-if="!tab" text color="primary" @click="showLogDataDetail(item)">数据详情</v-btn>
            <v-btn v-if="tab" text color="primary" @click="createLogTopic(item)">修改</v-btn>
            <v-btn
              v-if="tab"
              text
              color="primary"
              @click="
                HConfirmShow = true
                HConfirmItem = item
              "
              >删除</v-btn
            >
          </template>
        </h-table>
      </v-tab-item>
    </v-tabs-items>

    <!-- 表单展示 -->
    <f-dialog v-if="fDialogFlag" v-model="fDialogFlag" :loading="createTopicLoading">
      <CreateLogTopic v-if="fDialogShow === 1" />
    </f-dialog>

    <!-- 表格显示 -->
    <t-dialog v-model="tDialogFlag">
      <LogDataDialog v-if="tDialogShow === 1" :headersObj="headersObj" :dessertsObj="dessertsObj" />
    </t-dialog>

    <h-confirm v-model="HConfirmShow" @hconfirm="deleteTopic" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { paramsType, returnType, returnTypeData } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import { topicTable } from '@/type/topic.type'
import HTable from '@/components/h-table.vue'
import FDialog from '@/components/f-dialog.vue'
import TDialog from '@/components/t-dialog.vue'
import { TopicAdd } from '@/type/topic-add.type'
import util from '@/decorator/utilsDecorator'
import { dataType } from '@/enum/topic-datatype-enum'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum'
import { FormObj } from '@/type/dialog-form.type'
import CreateLogTopic from './childComponent/createLogTopic.vue'
import LogDataDialog from './childComponent/logDataDialog.vue'
import HConfirm from '@/components/h-confirm.vue'
import { mdiMagnify } from '@mdi/js'
import HSearch from '@/components/h-search.vue'

@Component({
  components: {
    HConfirm,
    HTable,
    FDialog,
    CreateLogTopic,
    LogDataDialog,
    TDialog,
    HSearch
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
  mdiMagnify = mdiMagnify
  private tab = null
  private items = ['所有主题', '我的主题']
  private fDialogFlag = false // 弹窗展示
  private fDialogShow = 0

  private tDialogFlag = false
  private tDialogShow = 0

  private queryTopicID = '' // 查询主题ID input框内容
  private loading = true

  private HConfirmShow = false
  private HConfirmItem = {
    id: '',
    topicName: '',
    topicInterFaceType: 0
  }

  private createTopicLoading = false

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
      value: 'savePath'
    },
    {
      text: '服务器地址',
      align: 'center',
      value: 'logIp'
    },
    {
      text: '服务器用户名',
      align: 'center',
      value: 'logUserName'
    },
    {
      text: '落盘策略',
      align: 'center',
      value: 'saveType'
    },
    {
      text: '采集校验关键字',
      align: 'center',
      value: 'keywords'
    },
    {
      text: '操作',
      align: 'center',
      slot: 'buttons'
    }
  ]

  // 表格显示
  private headersObj: Array<any> = []
  private dessertsObj: Array<topicTable> = []

  // 创建日志主题
  private createLogTopic(item?: any) {
    this.fDialogFlag = true
    this.fDialogShow = 1
    this.formProvide.btnName = item ? ['立即修改'] : ['立即创建']
    this.formProvide.title = item ? '修改日志主题' : '创建日志主题'
    this.formProvide.methodName = 'addLogTopic' // 立即提交
    this.createTopicLoading = false

    if (item) {
      this.formProvide.formObj = {
        canNotEdit: true,
        id: item.id,
        topicName: item.topicName,
        logIp: item.logIp,
        logUserName: item.logUserName,
        savePath: item.savePath,
        saveType: item.saveType?.split('+'),
        keywords: item.keywords ? item.keywords : ''
      }
    } else {
      this.formProvide.formObj = {}
    }
  }

  // 创建日志主题
  private async addLogTopic(formObj: TopicAdd) {
    const canNotEdit = formObj.canNotEdit
    // 创建主题 有loading，修改主题没有loading
    !canNotEdit ? (this.createTopicLoading = true) : (this.createTopicLoading = false)

    const params: any = {
      dataType: dataType['结构化']
    }
    params.topicName = formObj.topicName
    params.logIp = formObj.logIp
    params.logUserName = formObj.logUserName
    // 修改不传密码，传id
    if (!canNotEdit) {
      params.logPassWord = formObj.logPassWord
    } else {
      params.id = formObj.id
    }
    params.savePath = formObj.savePath
    params.saveType = formObj.saveType.join('+')
    params.keywords = formObj.keywords ? formObj.keywords : ''
    params.topicInterFaceType = 9

    console.log(params)

    const { success } = await this.h_request['httpPOST'](
      !canNotEdit ? 'POST_TOPICS_ADDLOGGERTOPIC' : 'POST_TOPICS_UPDATELOGGERTOPIC',
      params
    )
    // 关闭loading
    this.createTopicLoading = false

    if (success) {
      this.h_utils['alertUtil'].open(!canNotEdit ? '主题创建成功' : '主题修改成功', true, 'success')
      this.searchMethod(
        false,
        {
          pageSize: this.pageSize,
          pageNum: 1
        },
        !!this.tab
      )
      this.pageNum = 1
      return Promise.resolve(success)
    }
  }

  // 查询数据详情
  private showLogDataDetail(item: any) {
    this.formProvide.title = '日志数据详情'
    this.tDialogFlag = true
    this.tDialogShow = 1
    this.headersObj = [
      {
        text: '日志采集路径',
        align: 'center',
        value: 'savePath'
      },
      {
        text: '服务器地址',
        align: 'center',
        value: 'logIp'
      },
      {
        text: '服务器用户名',
        align: 'center',
        value: 'logUserName'
      }
    ]

    this.dessertsObj = [{ ...item }]
  }

  // 查询通用调用方法
  private async searchMethod(bool: boolean, params: paramsType, tab?: boolean) {
    this.loading = true

    let _data: returnTypeData
    params.dataType = dataType['结构化']
    params.faceTypes = `${topicInterFaceType['日志主题']}`

    if (tab) {
      const { data }: returnType = bool
        ? await this.h_request['httpGET']<object>('GET_TOPICS_MYTOPICSBYID', params)
        : await this.h_request['httpGET']<object>('GET_TOPICS_MYTOPICS', params)
      _data = data ? { ...data } : undefined
    } else {
      const { data }: returnType = bool
        ? await this.h_request['httpGET']<object>('GET_TOPICS_SELECTLOGGERTOPICBYTOPICID', {
            topicId: this.queryTopicID
          })
        : await this.h_request['httpGET']<object>('GET_TOPICS_FIND_ALL', params)
      _data = data ? { ...data } : undefined
    }

    this.desserts = _data ? [..._data.list] : []
    this.paginationLength = Math.ceil(_data?.total / this.pageSize) || 1
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

  // 删除
  private async deleteTopic() {
    if (this.HConfirmItem.id === undefined) {
      return
    }

    const { success } = await this.h_request['httpGET']('GET_TOPICS_DELETELOOGGERTOPIC', {
      topicId: this.HConfirmItem.id
    })

    if (success) {
      this.HConfirmShow = false
      this.h_utils['alertUtil'].open('主题删除成功', true, 'success')
      this.searchMethod(
        false,
        {
          pageSize: this.pageSize,
          pageNum: 1
        },
        true
      )
      this.pageNum = 1
    }
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
