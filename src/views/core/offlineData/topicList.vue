<template>
  <div id="offLineTopicList">
    <v-row>
      <HSearch
        v-model="queryTopicID"
        v-only-num
        label="请输入查找的离线主题ID"
        @append="searchTopic"
        @enter="searchTopic"
        @clear="tabChange(tab)"
      />
      <v-col>
        <!-- <v-btn color="primary" depressed class="mr-6" small dark @click="createDataBaseAcquisition()">数据库采集</v-btn> -->
        <v-btn color="primary" depressed class="mr-6" small dark @click="createServePull()">主动拉取</v-btn>
        <v-btn color="primary" depressed class="mr-6" small dark @click="pullFTP">FTP</v-btn>
      </v-col>
    </v-row>
    <!-- tab -->
    <HTabs v-model="tab" :items="items" @change="tabChange" />

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
          <!-- 数据结构 -->
          <template v-slot:buttons="{ item }">
            <v-btn :disabled="item.topicInterFaceType === 5" text color="primary" @click="dataStructureDetails(item)"
              >数据结构详情
            </v-btn>
          </template>
          <!-- 附加信息 -->
          <template v-slot:details="{ item }">
            <v-btn
              text
              color="primary"
              :loading="!!item.loading"
              :disabled="item.topicInterFaceType === 5"
              @click="getTopicInformation(item)"
              >查看附加信息</v-btn
            >
          </template>
          <!-- 操作 -->
          <template v-slot:buttons2="{ item }">
            <!-- 操作下拉框 -->
            <v-menu close-delay="150" left offset-x bottom max-width="90px" min-width="90px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" text v-bind="attrs" v-on="on">...</v-btn>
              </template>
              <v-list dense>
                <v-list-item dense v-for="(i, index) in buttonItems" :key="index" class="pa-0">
                  <v-btn
                    :disabled="
                      (i.tab && !i.tab.includes(tab)) || (i.faceType && item.topicInterFaceType !== i.faceType)
                    "
                    class="pa-0"
                    width="100%"
                    :color="i.color ? i.color : `primary`"
                    text
                    @click="i.handle && i.handle(item)"
                    >{{ i.text }}</v-btn
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </h-table>
      </v-tab-item>
    </v-tabs-items>

    <!-- 表单展示 -->
    <f-dialog v-if="fDialogFlag" v-model="fDialogFlag">
      <CreateDataBaseAcquisition v-if="fDialogShow === 1" />
      <CreateServePull v-else-if="fDialogShow === 2" @changeTopic="handleSelectTopic" />
      <PullFTP v-else-if="fDialogShow === 3" />
    </f-dialog>

    <!-- 表格显示 -->
    <t-dialog v-model="tDialogFlag">
      <DataStructureDialog :rowObj="rowObj" v-if="tDialogShow === 1" />
      <TopicAncillaryInformationDialog :otherObj="otherObj" v-else-if="tDialogShow === 2" />
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
import HConfirm from '@/components/h-confirm.vue'
import Enum from '@/decorator/enumDecorator'
import TDialog from '@/components/t-dialog.vue'
import FDialog from '@/components/h-dialog.vue'
import { TopicAdd } from '@/type/topic-add.type'
import util from '@/decorator/utilsDecorator'
import { dataType } from '@/enum/topic-datatype-enum'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum'
import { FormObj } from '@/type/dialog-form.type'
import CreateDataBaseAcquisition from './childComponent/createDataBaseAcquisition.vue'
import CreateServePull from './childComponent/createServePull.vue'
import PullFTP from './childComponent/pullFTP.vue'
import HSearch from '@/components/h-search.vue'
import DataStructureDialog from './childComponent/dataStructureDialog.vue'
import TopicAncillaryInformationDialog from './childComponent/topicAncillaryInformationDialog.vue'
import HTabs from '@/components/h-tabs.vue'
import { tableHeaderType } from '@/type/table.type'

@Component({
  components: {
    HTable,
    HConfirm,
    FDialog,
    TDialog,
    CreateDataBaseAcquisition,
    CreateServePull,
    PullFTP,
    DataStructureDialog,
    TopicAncillaryInformationDialog,
    HSearch,
    HTabs
  }
})
@http
@Enum([
  {
    tsFileName: 'topic-list-enum',
    enumName: 'queneType'
  }
])
@util
export default class OfflineTopicList extends Vue {
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
  private tab = 0
  private items = ['所有任务', '我的任务', '主题列表']
  private fDialogFlag = false // 弹窗展示
  private tDialogFlag = false // 表格展示

  private fDialogShow = 0 // 展示哪个弹窗 1.数据库采集 2.服务主动拉取 3.拉取FTP
  private tDialogShow = 0 // 展示哪个弹窗 1.数据结构 2.其他信息

  private rowObj: object = {}
  private otherObj: object = {}

  private loading = true

  private activeTopicIDs = [`新建主题`, '123', '1231', '23423', '34534'] // 第0项 为新建主题，其余异步获取

  private HConfirmShow = false
  private HConfirmItem = {
    id: '',
    topicName: '',
    topicInterFaceType: 0
  }

  private protoFile: File | null = null
  private protoForms = new FormData()

  private desserts: Array<topicTable> = [] // 数据列表
  private queryTopicID = '' // 查询主题ID input框内容
  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 20 // 每页展示多少条数据
  private get headers(): Array<tableHeaderType> {
    return [
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
        text: '接口类型',
        align: 'center',
        value: 'topicInterFaceType',
        format: (val: number) => {
          return topicInterFaceType[val]
        }
      },
      {
        text: '数据结构',
        align: 'center',
        slot: 'buttons'
      },
      {
        text: '附加信息',
        align: 'center',
        slot: 'details',
        isHide: this.tab === 2
      },
      {
        text: '操作',
        align: 'center',
        slot: 'buttons2'
      }
    ]
  }

  // 操作下拉框
  private buttonItems = [
    {
      text: `创建任务`,
      tab: [2],
      faceType: 3,
      handle: this.addTask
    },
    // {
    //   text: `增加字段`,
    //   tab: [1],
    //   faceType: 3,
    //   handle: this.addItems
    // },
    {
      text: `启动`,
      tab: [1]
    },
    {
      text: `停止`,
      tab: [1]
    },
    {
      text: '删除',
      tab: [1],
      color: `error`,
      handle: this.handelDeleteTopic
    }
  ]

  // 数据库采集
  private createDataBaseAcquisition(item?: any) {
    this.fDialogFlag = true
    this.fDialogShow = 1
    this.formProvide.btnName = ['立即提交']
    this.formProvide.title = '数据库采集'
    this.formProvide.methodName = 'addDataBaseAcquisition' // 立即提交

    // 修改
    if (item) {
      const obj1: any = JSON.parse(item.dsAnnotation)
      const obj2: any = JSON.parse(item.dataStruct)[0]
      let _topicList = []
      for (const k in obj1) {
        _topicList.push({
          key: k,
          description: obj1[k],
          type: typeof obj2[k] === 'number' && obj2[k] > 1 ? 'TimeStamp' : obj2[k],
          disabled: true
        })
      }
      this.formProvide.formObj = {
        canNotEdit: true,
        id: item.id,
        topicName: item.topicName,
        dataBaseType: item.dataBaseType,
        dataBaseIp: item.dataBaseIp,
        topicList: _topicList
      }
    } else {
      this.formProvide.formObj = {
        topicList: [
          {
            key: '',
            description: '',
            type: '',
            disabled: false
          }
        ]
      }
    }
  }
  // 数据库采集
  private async addDataBaseAcquisition(formObj: TopicAdd) {
    const canNotEdit = formObj.canNotEdit

    const dataStruct: any = {}
    const dataStructNumber: any = {}

    formObj.topicList.forEach(val => {
      dataStruct[val.key] = val.description
      dataStructNumber[val.key] = val.type === 'TimeStamp' ? Date.now() : val.type
    })
    const _numberS = JSON.stringify(dataStruct)
    const _keyS = '[' + JSON.stringify(dataStructNumber) + ']'
    const params: any = {
      dataStruct: _keyS,
      dsAnnotation: _numberS,
      dataType: dataType['结构化']
    }
    params.topicName = formObj.topicName
    params.dataBaseType = formObj.dataBaseType
    params.dataBaseIp = formObj.dataBaseIp
    params.topicInterFaceType = 2

    canNotEdit && (params.id = formObj.id)

    const { success } = await this.h_request['httpPOST'](!canNotEdit ? 'POST_TOPICS_ADD' : 'POST_TOPICS_UPDATE', params)
    if (success) {
      this.h_utils['alertUtil'].open(!canNotEdit ? '主题创建成功' : '主题修改成功', true, 'success')
      this.searchMethod(
        false,
        {
          pageSize: this.pageSize,
          pageNum: 1
        },
        this.tab
      )
      this.pageNum = 1
      return Promise.resolve(success)
    }
  }

  // 服务主动拉取 新建任务 和 修改
  private createServePull(item?: any) {
    this.formProvide.btnName = ['立即提交']
    this.formProvide.title = '服务主动拉取'
    this.formProvide.methodName = 'addServePull'
    this.fDialogFlag = true
    this.fDialogShow = 2
    const _obj = {
      activeTopicIDs: [...this.activeTopicIDs],
      id: this.activeTopicIDs[0]
    }

    if (item) {
      const obj1: any = JSON.parse(item.dsAnnotation)
      const obj2: any = JSON.parse(item.dataStruct)[0]
      let _topicList = []
      for (const k in obj1) {
        _topicList.push({
          key: k,
          description: obj1[k],
          type: typeof obj2[k] === 'number' && obj2[k] > 1 ? 'TimeStamp' : obj2[k],
          disabled: true
        })
      }
      const _header = JSON.parse(item.header)
      this.formProvide.formObj = {
        ..._obj,
        canNotEdit: true,
        topicName: item.topicName,
        id: item.id,
        url: item.url,
        type: item.type,
        body: item.body,
        topicList: _topicList,
        AuthorizationObj: [
          {
            key: '***',
            value: '***'
          }
        ],
        header: _header.length
          ? _header
          : [
              {
                key: '',
                value: ''
              }
            ]
      }
    } else {
      this.formProvide.formObj = {
        ..._obj,
        AuthorizationObj: [
          {
            key: '',
            value: ''
          }
        ],
        header: [
          {
            key: '',
            value: ''
          }
        ],
        topicList: [
          {
            key: '',
            description: '',
            type: '',
            disabled: false
          }
        ]
      }
    }
  }
  // addServePull
  private async addServePull(formObj: TopicAdd) {
    const canNotEdit = formObj.canNotEdit
    const dataStruct: any = {}
    const dataStructNumber: any = {}

    formObj.topicList.forEach(val => {
      dataStruct[val.key] = val.description
      dataStructNumber[val.key] = val.type === 'TimeStamp' ? Date.now() : val.type
    })
    const _numberS = JSON.stringify(dataStruct)
    const _keyS = '[' + JSON.stringify(dataStructNumber) + ']'
    const params: any = {
      dataStruct: _keyS,
      dsAnnotation: _numberS,
      dataType: dataType['结构化']
    }
    canNotEdit && (params.id = formObj.id)

    // 去除key为空的项
    let _obj = [...this.cleanObj(formObj.header)]
    // 只在添加的时候 转base64
    if (!canNotEdit && formObj.AuthorizationObj[0].key && formObj.AuthorizationObj[0].value) {
      _obj.unshift(this.authorizationBase64(formObj.AuthorizationObj))
    }

    params.topicInterFaceType = 3
    params.topicName = formObj.topicName
    params.url = formObj.url
    params.header = JSON.stringify(_obj)
    params.type = formObj.type
    // 如果是post请求，会有body字段
    formObj.body && (params.body = formObj.body.replace(/\s+/g, ''))

    const { success } = await this.h_request['httpPOST'](!canNotEdit ? 'POST_TOPICS_ADD' : 'POST_TOPICS_UPDATE', params)

    if (success) {
      this.h_utils['alertUtil'].open(!canNotEdit ? '主题创建成功' : '主题修改成功', true, 'success')
      this.searchMethod(
        false,
        {
          pageSize: this.pageSize,
          pageNum: 1
        },
        this.tab
      )
      this.pageNum = 1
      return Promise.resolve(true)
    }
  }
  // 转64
  private authorizationBase64(obj: any) {
    return {
      key: 'Authorization',
      value: 'Basic ' + window.btoa(obj.key + ':' + obj.value + '')
    }
  }

  // 去除obj中key为空的项
  private cleanObj(obj: Array<{ key: unknown }>): Array<{ key: unknown }> {
    const _obj = [...obj]
    const _object: Array<{ key: unknown }> = []

    _obj.forEach(item => {
      if (item.key || typeof item.key === 'number') {
        _object.push(item)
      }
    })
    return _object
  }

  // pullFTP
  private pullFTP() {
    this.fDialogFlag = true
    this.fDialogShow = 3
    this.formProvide.btnName = ['立即提交']
    this.formProvide.title = '拉取FTP'
    this.formProvide.methodName = 'addFTP' // 立即提交
    this.formProvide.formObj = {
      ftp: [
        {
          host: '',
          port: ''
        }
      ]
    }
  }
  // addFTP
  private async addFTP(formObj: TopicAdd) {
    const params: any = {}

    params.dataType = dataType['结构化']
    params.topicInterFaceType = 5
    params.topicName = formObj.topicName
    params.port = formObj.ftp[0].port
    params.host = formObj.ftp[0].host
    params.baseUrl = formObj.baseUrl
    params.userName = formObj.userName
    params.password = formObj.password

    const { success } = await this.h_request['httpPOST']('POST_TOPICS_ADD', params)
    if (success) {
      this.h_utils['alertUtil'].open('主题创建成功', true, 'success')
      this.searchMethod(
        false,
        {
          pageSize: this.pageSize,
          pageNum: 1
        },
        this.tab
      )
      this.pageNum = 1
      return Promise.resolve(success)
    }
  }

  // 添加
  private addItems(item: { topicInterFaceType: number }) {
    if (item.topicInterFaceType === 2) {
      // 数据库采集
      this.createDataBaseAcquisition(item)
    } else if (item.topicInterFaceType === 3) {
      // 服务端主动拉取
      this.createServePull(item)
    }
  }

  // 创建任务
  private addTask(item: any) {
    this.createServePull()
    this.handleSelectTopic(item.id)
  }

  // 选择主题回显
  private handleSelectTopic(val: string) {
    // 非新建
    if (val && val !== this.activeTopicIDs[0]) {
      this.formProvide.formObj.id = val
      this.formProvide.formObj.useSelectID = true
      this.formProvide.formObj.topicName = val
      this.formProvide.formObj.topicList = [
        {
          key: '123',
          description: '1',
          type: '1',
          disabled: true
        }
      ]
    } else {
      // 新建
      this.formProvide.formObj.id = val
      this.formProvide.formObj.useSelectID = false
      this.formProvide.formObj.topicName = ''
      this.formProvide.formObj.topicList = [
        {
          key: '',
          description: '',
          type: '',
          disabled: false
        }
      ]
    }
  }

  // 查询通用调用方法 结构化数据
  private async searchMethod(bool: boolean, params: paramsType, tab: number) {
    this.loading = true
    let _data: returnTypeData

    params.dataType = dataType['结构化']
    // params.faceTypes = `${topicInterFaceType['数据库采集']},${topicInterFaceType['服务主动拉取']},${topicInterFaceType['拉取FTP']}`
    params.faceTypes = `${topicInterFaceType['服务主动拉取']},${topicInterFaceType['拉取FTP']}`
    if (tab === 1) {
      const { data }: returnType = bool
        ? await this.h_request['httpGET']<object>('GET_TOPICS_MYTOPICSBYID', params)
        : await this.h_request['httpGET']<object>('GET_TOPICS_MYTOPICS', params)
      _data = data ? { ...data } : undefined
    } else {
      const { data }: returnType = bool
        ? await this.h_request['httpGET']<object>('GET_TOPICS_SELECTTOPIC', params)
        : await this.h_request['httpGET']<object>('GET_TOPICS_FIND_ALL', params)
      _data = data ? { ...data } : undefined
    }
    // flag用于标识是否已经拉取附加信息
    this.desserts = _data
      ? [
          ..._data.list.map(item => {
            return { ...item, flag: false }
          })
        ]
      : []
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
        this.tab
      )
    } else {
      this.searchMethod(
        true,
        {
          topicID: this.queryTopicID,
          pageNum: 1,
          pageSize: this.pageSize
        },
        this.tab
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
      tab
    )
    this.pageNum = 1
  }

  // 数据结构展示方法
  private dataStructureDetails(item: object) {
    this.tDialogFlag = true
    this.tDialogShow = 1
    this.rowObj = item
    this.formProvide.title = '数据结构详情'
  }

  // 附加信息
  private async getTopicInformation(item: any) {
    if (!item.flag) {
      this.$set(item, 'loading', true)

      const { data } = await this.h_request['httpGET']('GET_TOPICS_INFORMATION', {
        topicID: item.id,
        topicName: item.topicName,
        topicInterFaceType: item.topicInterFaceType
      })

      if (data && data.length > 0) {
        item.dataBaseIp = data[0].dataBaseIp
        item.dataBaseType = data[0].dataBaseType
        item.url = data[0].url
        item.header = data[0].header
        item.flag = true
      } else if (data.length === 0) {
        // 数据为空
        item.flag = true
      } else {
        // 查询失败
        this.$set(item, 'loading', false)
        item.flag = false
        return
      }
    }
    this.$set(item, 'loading', false)
    this.tDialogFlag = true
    this.tDialogShow = 2
    this.otherObj = {}
    this.formProvide.title = '附加信息'
    this.otherObj = { ...item }
  }

  // 删除
  private async deleteTopic() {
    if (this.HConfirmItem.id === undefined) {
      return
    }
    const { success } = await this.h_request['httpGET']('GET_TOPICS_DELETE', {
      topicID: this.HConfirmItem.id,
      topicName: this.HConfirmItem.topicName,
      topicInterFaceType: this.HConfirmItem.topicInterFaceType
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
        this.tab
      )
      this.pageNum = 1
    }
  }

  // handelDeleteTopic
  private handelDeleteTopic(item: { id: string; topicName: string; topicInterFaceType: number }) {
    this.HConfirmShow = true
    this.HConfirmItem = { ...item }
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
      this.tab
    )
  }
}
</script>
