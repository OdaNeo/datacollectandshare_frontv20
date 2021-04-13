<template>
  <div id="onLineTopicList">
    <v-row>
      <HSearch
        v-model="queryTopicID"
        placeholder="请输入查找的实时主题ID"
        @append="searchTopic"
        @enter="searchTopic"
        @clear="tabChange(tab)"
        v-only-num
      />
      <v-col>
        <v-btn color="primary" depressed class="mr-6" small dark @click="createRest()">REST</v-btn>
        <!-- <v-btn color="primary" depressed class="mr-6" small dark @click="createJson">JSON</v-btn> -->
        <v-btn color="primary" depressed class="mr-6" small dark @click="createProtobuf">PROTO</v-btn>
      </v-col>
    </v-row>
    <v-tabs v-model="tab" @change="tabChange">
      <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item">
        <h-table
          :headers="headers"
          :desserts="desserts"
          :pageNum="pageNum"
          :loading="loading"
          @PaginationNow="PaginationNow"
          :paginationLength="paginationLength"
        >
          <template v-slot:buttons2="{ item }">
            <v-btn :disabled="item.topicInterFaceType === 6" text color="primary" @click="dataStructure(item)"
              >数据结构详情</v-btn
            >
            <v-btn text color="primary" @click="showUserSubNameList(item)">订阅用户</v-btn>
            <v-btn text color="primary" @click="ancillaryInformation(item)">附加信息</v-btn>
          </template>
          <template v-slot:buttons="{ item }">
            <!-- <v-btn
              v-if="tab"
              :disabled="item.topicInterFaceType !== 1"
              text
              color="primary"
              @click.stop="addItems(item)"
              >增加字段</v-btn
            >
            <v-btn :disabled="item.topicInterFaceType !== 6" text color="primary" @click.stop="downloadFile(item)"
              >下载</v-btn
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
            </v-btn> -->
            <!-- 操作下拉框 -->
            <v-menu open-on-hover left offset-x bottom max-width="90px" min-width="90px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" text v-bind="attrs" v-on="on">...</v-btn>
              </template>
              <v-list dense>
                <v-list-item dense v-for="(i, index) in buttonItems" :key="index" class="pa-0">
                  <v-btn
                    :disabled="(i.tab && tab !== i.tab) || (i.faceType && item.topicInterFaceType !== i.faceType)"
                    class="pa-0"
                    width="100%"
                    :color="i.color ? i.color : `primary`"
                    text
                    @click.stop="i.handle(item)"
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
      <create-rest v-if="fDialogShow === 1" @upload-file="upLoadFile" ref="createRest"></create-rest>
      <create-protobuf v-else-if="fDialogShow === 2" @upload-proto-file="uploadProtoFile" />
      <create-json v-else-if="fDialogShow === 3"></create-json>
    </f-dialog>

    <!-- 表格显示 -->
    <t-dialog v-model="tDialogFlag">
      <DataStructureDialog :rowObj="rowObj" v-if="tDialogShow === 1" />
      <TopicAncillaryInformationDialog :rowObj="rowObj" v-else-if="tDialogShow === 2" />
      <UserSubNameList :rowObj="rowObj" v-else-if="tDialogShow === 3" />
    </t-dialog>

    <h-confirm v-model="HConfirmShow" @hconfirm="deleteTopic" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide, Ref } from 'vue-property-decorator'
import { paramsType, returnType, returnTypeData } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import upload from '@/decorator/uploadDecorator'
import download from '@/decorator/downloadDecorator'
import { topicTable } from '@/type/topic.type'
import HTable from '@/components/h-table.vue'
import HConfirm from '@/components/h-confirm.vue'
import Enum from '@/decorator/enumDecorator'
import TDialog from '@/components/t-dialog.vue'
import FDialog from '@/components/f-dialog.vue'
import { TopicAdd } from '@/type/topic-add.type'
import util from '@/decorator/utilsDecorator'
import { dataType } from '@/enum/topic-datatype-enum'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum'
import XLSX from 'xlsx'
import { FormObj } from '@/type/dialog-form.type'
import CreateRest from './childComponent/createRest.vue'
import CreateProtobuf from './childComponent/createProtobuf.vue'
import createJson from './childComponent/createJson.vue'
import DataStructureDialog from './childComponent/dataStructureDialog.vue'
import TopicAncillaryInformationDialog from './childComponent/topicAncillaryInformationDialog.vue'
import UserSubNameList from './childComponent/userSubNameList.vue'
import HSearch from '@/components/h-search.vue'
import { onlineDataParamType } from '@/type/online-data.type'
import { mdiMagnify } from '@mdi/js'

@Component({
  components: {
    HTable,
    TDialog,
    FDialog,
    HConfirm,
    CreateRest,
    CreateProtobuf,
    createJson,
    DataStructureDialog,
    TopicAncillaryInformationDialog,
    HSearch,
    UserSubNameList
  }
})
@http
@upload
@download
@Enum([
  {
    tsFileName: 'topic-list-enum',
    enumName: 'queneType'
  }
])
@util
// 1，4，6
export default class OnlineDataTopicList extends Vue {
  @Ref('createRest') readonly crRef!: Vue
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

  private mdiMagnify = mdiMagnify
  private tab = null
  private items = ['所有主题', '我的主题']

  private fDialogFlag = false // 弹窗展示
  private tDialogFlag = false // 表格展示

  private fDialogShow = 0 // 展示哪个弹窗 1.rest 2.Protobuf 3.JSON
  private tDialogShow = 0 // 展示哪个弹窗 1.数据结构 2.其他信息

  private rowObj: topicTable = {}
  private sheetObj: any

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
  private loading = true
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
      text: '接口类型',
      align: 'center',
      value: 'topicInterFaceType',
      format: (val: number) => {
        return topicInterFaceType[val]
      }
    },
    {
      text: '消息类型',
      align: 'center',
      value: 'queneType',
      format: (quene: number) => {
        return this.h_enum['queneType'][quene]
      }
    },
    {
      text: '显示详情',
      align: 'center',
      slot: 'buttons2'
    },
    {
      text: '操作',
      align: 'center',
      slot: 'buttons'
    }
  ]

  private buttonItems = [
    {
      text: `增加字段`,
      tab: 1,
      faceType: 1,
      handle: this.addItems
    },
    {
      text: `下载`,
      faceType: 6,
      handle: this.downloadFile
    },
    {
      text: `启动`,
      tab: 1
    },
    {
      text: `停止`,
      tab: 1
    },
    {
      text: '删除',
      tab: 1,
      color: `error`,
      handle: this.handelDeleteTopic
    }
  ]

  // REST
  private createRest(item?: topicTable) {
    this.fDialogFlag = true
    this.fDialogShow = 1
    this.formProvide.btnName = ['立即提交']
    this.formProvide.title = '通过REST接口创建主题'
    this.formProvide.methodName = 'addRest' // 立即提交
    // 修改
    if (item) {
      const obj1 = item.dsAnnotation ? JSON.parse(item.dsAnnotation) : undefined
      const obj2 = item.dataStruct ? JSON.parse(item.dataStruct)[0] : undefined

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
        queneType: item.queneType,
        redisTimer: item.redisTimer,
        topicName: item.topicName,
        // writeElasticsearch: item.writeElasticsearch === 1 ? '是' : '否',
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
        // writeElasticsearch: '是'
      }
    }
  }

  private async addRest(formObj: TopicAdd) {
    const canNotEdit = formObj.canNotEdit

    const dataStruct: any = {}
    const dataStructNumber: any = {}

    formObj.topicList.forEach(val => {
      dataStruct[val.key] = val.description
      dataStructNumber[val.key] = val.type === 'TimeStamp' ? Date.now() : val.type
    })
    const _numberS = JSON.stringify(dataStruct)
    const _keyS = '[' + JSON.stringify(dataStructNumber) + ']'

    const params: Partial<onlineDataParamType> = {
      dataStruct: _keyS,
      dsAnnotation: _numberS,
      dataType: dataType['结构化']
    }
    // params.writeElasticsearch = formObj.writeElasticsearch === '是' ? 1 : 0
    params.writeElasticsearch = 1
    params.topicName = formObj.topicName
    params.redisTimer = formObj.redisTimer
    params.queneType = formObj.queneType
    params.topicInterFaceType = 1

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

  // createProtobuf
  private createProtobuf() {
    this.fDialogFlag = true
    this.fDialogShow = 2
    this.formProvide.btnName = ['立即提交']
    this.formProvide.title = '上传PROTO文件'
    this.formProvide.methodName = 'addProtobuf' // 立即提交
    this.formProvide.formObj = {}
  }

  // addProtobuf
  private async addProtobuf(formObj: TopicAdd) {
    if (!this.protoFile) {
      return
    }
    this.protoForms = new FormData()
    // topicInterFaceType = 6
    this.protoForms.append('protoFile', this.protoFile)
    this.protoForms.append('redisTimer', formObj.redisTimer.toString())
    this.protoForms.append('topicName', formObj.topicName.toString())
    // 如果此处vetur报错，请将工程文件放在vscode根目录下 https://github.com/vuejs/vetur/issues/2602
    const { success } = await this.h_upload.httpPOST('POST_TOPIC_ADDPROTOBUFTOPIC', this.protoForms)

    if (success) {
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

  // createJson
  private createJson() {
    this.fDialogFlag = true
    this.fDialogShow = 3
    this.formProvide.btnName = ['立即提交']
    this.formProvide.title = '创建JSON'
    this.formProvide.methodName = 'addJson' // 立即提交
    this.formProvide.formObj = {
      // writeElasticsearch: '是'
    }
  }
  // addJson
  private async addJson(formObj: TopicAdd) {
    const params: Partial<onlineDataParamType> = {}

    params.dataType = dataType['结构化']
    params.topicInterFaceType = 4
    params.topicName = formObj.topicName
    params.queneType = formObj.queneType
    params.redisTimer = formObj.redisTimer
    // params.writeElasticsearch = formObj.writeElasticsearch === '是' ? 1 : 0
    params.writeElasticsearch = 1
    params.dataStructSchema = formObj.dataStructSchema.replace(/\s+/g, '')

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
  private addItems(item: topicTable) {
    // rest
    if (item.topicInterFaceType === 1) {
      this.createRest(item)
    }
  }

  // 查询通用调用方法 结构化数据
  private async searchMethod(bool: boolean, params: paramsType, tab?: boolean) {
    this.loading = true
    let _data: returnTypeData

    // params.faceTypes = `${topicInterFaceType['通用Rest接口']},${topicInterFaceType['多级嵌套免校验']},${topicInterFaceType['PROTOBUF']}`
    params.faceTypes = `${topicInterFaceType['通用Rest接口']},${topicInterFaceType['PROTOBUF']}`
    params.dataType = dataType['结构化']

    if (tab) {
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
  private dataStructure(item: topicTable) {
    this.rowObj = item
    this.tDialogFlag = true
    this.tDialogShow = 1
    this.formProvide.title = '数据结构详情'
  }

  // 附加信息
  private ancillaryInformation(item: topicTable) {
    this.rowObj = item
    this.tDialogFlag = true
    this.tDialogShow = 2
    this.formProvide.title = '附加信息'
  }

  // 订阅用户详情
  private showUserSubNameList(item: topicTable) {
    this.rowObj = item
    this.tDialogFlag = true
    this.tDialogShow = 3
    this.formProvide.title = '订阅用户详情'
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

  // 上传文件
  private upLoadFile(e: File) {
    const file = e as File
    if (!file) {
      return
    }
    // xlsx 或者 xls 格式才能上传
    if (
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result)
        const { Sheets } = XLSX.read(data, { type: 'array' })

        // 表格需命名为sheet1
        if (!Sheets[`sheet1`]) {
          this.h_utils['alertUtil'].open('表格格式有误', true, 'error')
          return
        } else {
          this.sheetObj = Sheets[`sheet1`]
        }

        // 格式不对报错
        if (!this.sheetObj['!ref'] && !this.sheetObj['!ref'].includes('C')) {
          this.h_utils['alertUtil'].open('表格格式有误', true, 'error')
          return
        }

        const _l: number = this.sheetObj['!ref'].split('C')[1]
        const _topicList: Array<any> = []

        for (let i = 1; i < _l; i++) {
          _topicList.push({
            [this.handleObjKey('A') as string]: this.handleObjKeyType(this.sheetObj[`A${i + 1}`]?.v),
            [this.handleObjKey('B') as string]: this.handleObjKeyType(this.sheetObj[`B${i + 1}`]?.v),
            [this.handleObjKey('C') as string]: this.handleObjKeyType(this.sheetObj[`C${i + 1}`]?.v),
            disabled: false
          })
        }
        // 填充列表
        this.formProvide.formObj = {
          topicName: file.name.split('.')[0],
          queneType: 1,
          topicList: _topicList
          // writeElasticsearch: '是'
        }

        // 上传文件手动触发校验
        const parent = this.crRef.$parent as any
        this.$nextTick(() => {
          parent.validate()
        })
      }
    } else {
      this.h_utils.alertUtil.open('文件格式错误', true, 'error')
    }
  }
  //
  private handleObjKey(k: string) {
    switch (this.sheetObj[`${k}1`].v) {
      case '字段名':
        return 'key'
      case '字段类型(Int,String,TimeStamp)':
        return 'type'
      case '字段含义':
        return 'description'
    }
  }
  // ['序号','字段名','字段类型(Int,String,TimeStamp)','字段含义']
  // this.formObj.formObj.topicList.type 转义
  private handleObjKeyType(k?: string) {
    switch (k) {
      case 'Int':
        return 1
      case 'String':
        return 'str'
      case 'TimeStamp':
        return 'TimeStamp'
      default:
        return k
    }
  }

  // uploadProtoFile
  private uploadProtoFile(e: File) {
    console.log(e)
    if (!e) {
      return
    }
    this.protoFile = e
  }

  // 下载 proto
  private async downloadFile(item: { id: number }) {
    const data = await this.h_download.httpGET('GET_TOPICS_PROTOBUFDOWNLOAD', {
      id: item.id
    })

    if (data.filename) {
      const blob = new Blob([data] as any, {
        type: 'application/octet-stream'
      })
      const tempLink = document.createElement('a')
      const blobURL = window.URL.createObjectURL(blob)

      tempLink.style.display = 'none'
      tempLink.href = blobURL
      tempLink.setAttribute('download', decodeURI(data.filename))

      if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank')
      }
      document.body.appendChild(tempLink)
      tempLink.click()
      document.body.removeChild(tempLink)
      window.URL.revokeObjectURL(blobURL)
    } else {
      this.h_utils['alertUtil'].open('文件不存在或者下载失败', true, 'error')
    }
  }

  // handelDeleteTopic
  private handelDeleteTopic(item: { id: string; topicName: string; topicInterFaceType: number }) {
    this.HConfirmShow = true
    this.HConfirmItem = { ...item }
  }
}
</script>
