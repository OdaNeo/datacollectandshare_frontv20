<template>
  <div id="offLineTopicList">
    <v-row>
      <v-col cols="3">
        <v-text-field
          solo
          dense
          height="35px"
          placeholder="请输入查找的离线主题ID"
          clearable
          append-icon="mdi-magnify"
          @click:append="searchTopic"
          @keyup.enter="searchTopic"
          @click:clear="tabChange(tab)"
          v-model="queryTopicID"
          v-only-num
        >
        </v-text-field>
      </v-col>
      <v-col cols="9">
        <v-btn
          color="primary"
          width="95px"
          height="35px"
          depressed
          class="mr-6"
          small
          dark
          @click="createDataBaseAcquisition()"
          >数据库采集</v-btn
        >
        <v-btn color="primary" width="95px" height="35px" depressed class="mr-6" small dark @click="createServePull()"
          >服务主动拉取</v-btn
        >
        <v-btn color="primary" width="95px" height="35px" depressed class="mr-6" small dark @click="pullFTP"
          >拉取FTP</v-btn
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
          <template v-slot:buttons="{ item }">
            <v-btn :disabled="item.topicInterFaceType === 5" text color="primary" @click="dataStructureDetails(item)"
              >数据结构详情</v-btn
            >
          </template>
          <template v-slot:buttons2="{ item, index }">
            <v-btn
              v-if="tab"
              :disabled="item.topicInterFaceType !== 2 && item.topicInterFaceType !== 3"
              text
              color="primary"
              @click.stop="addItems(item)"
              >增加字段</v-btn
            >
            <v-btn
              v-if="tab"
              text
              color="primary"
              @click.stop="
                HConfirmShow = true
                HConfirmItem = item
              "
            >
              删除
            </v-btn>
            <v-btn
              text
              color="primary"
              :disabled="item.topicInterFaceType === 5"
              @click="getTopicInformation(item, index)"
              >查看附加信息</v-btn
            >
          </template>
        </h-table>
      </v-tab-item>
    </v-tabs-items>

    <!-- 表单展示 -->
    <f-dialog v-if="fDialogFlag" v-model="fDialogFlag">
      <CreateDataBaseAcquisition v-if="fDialogShow === 1" />
      <CreateServePull v-else-if="fDialogShow === 2" />
      <PullFTP v-else-if="fDialogShow === 3" />
    </f-dialog>

    <!-- 表格显示 -->
    <t-dialog v-if="tDialogFlag" v-model="tDialogFlag">
      <data-structure-dialog :rowObj="rowObj" v-if="tDialogShow === 1" />
      <topic-ancillary-information-dialog :otherObj="otherObj" v-else-if="tDialogShow === 2" />
    </t-dialog>

    <h-confirm v-if="HConfirmShow" v-model="HConfirmShow" @hconfirm="deleteTopic" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { paramsType, returnDataType } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import { topicTable } from '@/type/topic.type'
import HTable from '@/components/h-table.vue'
import HConfirm from '@/components/h-confirm.vue'
import Enum from '@/decorator/enumDecorator'
import TDialog from '@/components/t-dialog.vue'
import FDialog from '@/components/f-dialog.vue'
import { TopicAdd } from '@/type/topic-add.type'
import util from '@/decorator/utilsDecorator'
import { dataType } from '@/enum/topic-datatype-enum.ts'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum.ts'
import { FormObj } from '@/type/dialog-form.type'

import CreateDataBaseAcquisition from './childComponent/createDataBaseAcquisition.vue'
import CreateServePull from './childComponent/createServePull.vue'
import PullFTP from './childComponent/pullFTP.vue'

import DataStructureDialog from './childComponent/dataStructureDialog.vue'
import TopicAncillaryInformationDialog from './childComponent/topicAncillaryInformationDialog.vue'
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
    TopicAncillaryInformationDialog
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

  private tab = null
  private items = ['所有主题', '我的主题']
  private fDialogFlag = false // 弹窗展示
  private tDialogFlag = false // 表格展示

  private fDialogShow = 0 // 展示哪个弹窗 1.数据库采集 2.服务主动拉取 3.拉取FTP
  private tDialogShow = 0 // 展示哪个弹窗 1.数据结构 2.其他信息

  private rowObj: object = {}
  private otherObj: object = {}

  // private sheetObj: any
  private loading = true

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
      text: '订阅用户',
      align: 'center',
      value: 'userSubNameList',
      format: (userSubNameList: Array<string>) => {
        return userSubNameList.toString()
      }
    },
    {
      text: '接口类型',
      align: 'center',
      value: 'topicInterFaceType',
      format: (val: number) => {
        return topicInterFaceType[val]
      }
    },
    // {
    //   text: '消息类型',
    //   align: 'center',
    //   value: 'queneType',
    //   format: (quene: number) => {
    //     return this.h_enum['queneType'][quene]
    //   }
    // },
    {
      text: '数据结构',
      align: 'center',
      slot: 'buttons'
    },
    {
      text: '操作',
      align: 'center',
      slot: 'buttons2'
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
        !!this.tab
      )
      this.pageNum = 1
      return Promise.resolve(success)
    }
  }

  // 服务主动拉取
  private createServePull(item?: any) {
    this.fDialogFlag = true
    this.fDialogShow = 2
    this.formProvide.btnName = ['立即提交']
    this.formProvide.title = '服务主动拉取'
    this.formProvide.methodName = 'addServePull'

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
        !!this.tab
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
        !!this.tab
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
    //
  }

  // 查询通用调用方法 结构化数据
  private async searchMethod(bool: boolean, params: paramsType, tab?: boolean) {
    // console.log(bool)
    // console.log(params)
    // console.log(tab)
    this.loading = true

    params.dataType = dataType['结构化']
    params.faceTypes = `${topicInterFaceType['数据库采集']},${topicInterFaceType['服务主动拉取']},${topicInterFaceType['拉取FTP']}`
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

  // TODO 离线查询到实时 与 事务性？
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

  // 数据结构展示方法
  private dataStructure(item: any, str: string) {
    this.tDialogFlag = true
    this.tDialogShow = 1
    this.rowObj = item
    this.formProvide.title = str
  }

  // 附加信息
  private ancillaryInformation(info: any, str: string) {
    this.tDialogFlag = true
    this.tDialogShow = 2
    this.otherObj = info
    this.formProvide.title = str
  }

  private dataStructureDetails(item: any) {
    this.dataStructure(item, '数据结构详情')
  }

  private async getTopicInformation(item: any, index: number) {
    if (!this.desserts[index].flag) {
      const { data }: any = await this.h_request['httpGET']('GET_TOPICS_INFORMATION', {
        topicID: item.id,
        topicName: item.topicName,
        topicInterFaceType: item.topicInterFaceType
      })

      if (data.length > 0) {
        this.desserts[index].dataBaseIp = data[0].dataBaseIp
        this.desserts[index].dataBaseType = data[0].dataBaseType
        this.desserts[index].url = data[0].url
        this.desserts[index].header = data[0].header
      }
      // info = {...data[0],topicInterFaceType:item.topicInterFaceType,redisTimer:item.redisTimer}
      this.desserts[index].flag = true
    }
    this.ancillaryInformation(this.desserts[index], '附加信息')
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
        true
      )
      this.pageNum = 1
    }
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
