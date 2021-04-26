<template>
  <div id="offLineTopicList">
    <v-row>
      <HSearch
        v-model="queryTopicID"
        v-only-num
        :label="`请输入查找的${searchLabel}ID`"
        @append="searchTopic"
        @enter="searchTopic"
        @clear="tabChange(tab)"
      />
      <v-col>
        <!-- <v-btn color="primary" depressed class="mr-6" small dark @click="createDataBaseAcquisition()">数据库采集</v-btn> -->
        <v-btn color="primary" depressed class="mr-6" :loading="createUrlLoading" small dark @click="createServePull()"
          >主动拉取URL</v-btn
        >
        <v-btn color="primary" depressed class="mr-6" :loading="createFtpLoading" small dark @click="pullFTP()"
          >FTP</v-btn
        >
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
          <!-- 当前状态 -->
          <template v-slot:state="{ item }">
            <v-btn text :color="stateColor[item.isRun]">{{ offlineState[item.isRun] }}</v-btn>
          </template>
          <!-- 数据结构 -->
          <template v-slot:buttons="{ item }">
            <v-btn text color="primary" @click="dataStructureDetails(item)">数据结构详情</v-btn>
          </template>
          <!-- 日志 -->
          <template v-slot:log="{ item }">
            <v-btn text color="primary" :loading="!!item.loading" @click.stop="getCurrentLog(item)">最新</v-btn>
            <v-btn text color="primary" @click.stop="getHistoryLog(item.id)">历史</v-btn>
          </template>
          <!-- 附加信息 -->
          <template v-slot:details="{ item }">
            <v-btn text color="primary" @click.stop="showTimerLog(item)">时间信息</v-btn>

            <v-btn text color="primary" @click="getTopicInformation(item)">附加信息</v-btn>
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
                    :disabled="(i.tab && !i.tab.includes(tab)) || (i.state && item.isRun === Number(i.state))"
                    class="pa-0"
                    width="100%"
                    :color="i.color ? i.color : `primary`"
                    text
                    @click="i.handle && i.handle(item)"
                  >
                    {{ i.text }}
                  </v-btn>
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
      <CreateServePull v-else-if="fDialogShow === 2" />
      <PullFTP v-else-if="fDialogShow === 3" />
    </f-dialog>

    <!-- 表格显示 -->
    <t-dialog v-model="tDialogFlag">
      <DataStructureDialog :rowObj="rowObj" v-if="tDialogShow === 1" />
      <TopicAncillaryInformationDialog :otherObj="otherObj" v-else-if="tDialogShow === 2" />
      <HTable v-else-if="tDialogShow === 3" :headers="headersObj" :desserts="otherObj"></HTable>
      <HContentDetails v-if="tDialogShow === 4" :row="row" />
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
import { offlineTableType } from '@/type/offline-data.type'
import { offlineState, stateColor } from '@/enum/state-enum'
import cronstrue from 'cronstrue/i18n'
import { offlineResult } from '@/enum/state-enum'
import HContentDetails from '@/components/h-content-details.vue'
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
    HTabs,
    HContentDetails
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
  private items = ['所有任务', '我的任务', '所有主题', '我的主题']
  private searchLabel: `任务` | `主题` = `任务`
  private fDialogFlag = false // 弹窗展示
  private tDialogFlag = false // 表格展示
  private offlineState = offlineState
  private stateColor = stateColor

  private fDialogShow = 0 // 展示哪个弹窗 1.数据库采集 2.服务主动拉取 3.拉取FTP
  private tDialogShow = 0 // 展示哪个弹窗 1.数据结构 2.其他信息

  private rowObj: object = {}
  private otherObj: object = {}
  private row = ''

  private loading = true
  private createUrlLoading = false
  private createFtpLoading = false

  private HConfirmShow = false
  private HConfirmItem = {
    id: ''
  }

  private protoFile: File | null = null
  private protoForms = new FormData()

  private desserts: Array<topicTable> = [] // 数据列表
  private queryTopicID = '' // 查询主题ID input框内容
  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 20 // 每页展示多少条数据
  private headersObj: Array<tableHeaderType> = []

  private get headers(): Array<tableHeaderType> {
    return [
      // 表头内容 所有主题
      {
        text: '任务ID',
        align: 'center',
        value: 'id',
        isHide: this.tab === 2 || this.tab === 3
      },
      {
        text: '主题ID',
        align: 'center',
        value: 'id',
        isHide: this.tab === 0 || this.tab === 1
      },
      {
        text: '任务名称',
        align: 'center',
        value: 'taskName',
        isHide: this.tab === 2 || this.tab === 3
      },
      {
        text: '主题名称',
        align: 'center',
        value: 'topicName',
        isHide: this.tab === 0 || this.tab === 1
      },
      {
        text: '所属用户',
        align: 'center',
        value: 'userName',
        isHide: this.tab !== 2
      },
      {
        text: '当前状态',
        align: 'center',
        slot: 'state',
        isHide: this.tab === 2 || this.tab === 3
      },
      {
        text: '运行周期',
        align: 'center',
        value: 'cron',
        width: 100,
        isHide: this.tab === 2 || this.tab === 3,
        format: (cron: string) => {
          return cron ? cronstrue.toString(cron, { locale: 'zh_CN' }) : ''
        }
      },
      {
        text: '任务类型',
        align: 'center',
        value: 'taskType',
        isHide: this.tab === 2 || this.tab === 3,
        format: (val: number) => {
          return topicInterFaceType[val]
        }
      },
      {
        text: '主题类型',
        align: 'center',
        value: 'topicInterFaceType',
        isHide: this.tab === 0 || this.tab === 1,
        format: (val: number) => {
          return topicInterFaceType[val]
        }
      },
      {
        text: '数据结构',
        align: 'center',
        slot: 'buttons',
        isHide: this.tab === 0 || this.tab === 1
      },
      {
        text: '日志及其他',
        align: 'center',
        slot: 'log',
        isHide: this.tab === 2 || this.tab === 3
      },
      {
        text: '其他信息',
        align: 'center',
        slot: 'details',
        isHide: this.tab === 2 || this.tab === 3
      },
      {
        text: '操作',
        align: 'center',
        slot: 'buttons2',
        isHide: this.tab !== 1
      }
    ]
  }

  // 操作下拉框
  private buttonItems = [
    {
      text: `修改`,
      tab: [1],
      handle: this.updateItems
    },
    {
      text: `启动`,
      tab: [1],
      state: `1`,
      handle: this.startOfflineData
    },
    {
      text: `停止`,
      tab: [1],
      state: `0`,
      handle: this.stopOfflineData
    },
    {
      text: `重跑`,
      tab: [1],
      handle: this.reloadOfflineData
    },
    {
      text: '删除',
      tab: [1],
      color: `error`,
      handle: this.handelDeleteTopic
    }
  ]

  // 服务主动拉取 新建任务 和 修改
  private async createServePull(item?: any) {
    item ? (this.createUrlLoading = false) : (this.createUrlLoading = true)
    console.log(item)

    if (item) {
      const { cron, taskName, taskConfigId, uid } = item
      const { topicId, topicName, dataStruct, dsAnnotation, url, type, body, header, saveEs, saveHbase, id } = item.t
      const _header = JSON.parse(header)

      this.formProvide.formObj = {
        canNotEdit: true,
        isEdit: true,
        newTopics: false,
        topicName: topicName,
        taskName,
        taskId: item.id,
        taskConfigId,
        t_id: id,
        uid,
        activeTopicIDs: [
          {
            text: topicId.toString(),
            value: topicId.toString(),
            topicName: topicName,
            dataStruct: dataStruct,
            dsAnnotation: dsAnnotation
          }
        ],
        id: topicId.toString(),
        url: url,
        cron,
        type: type,
        body: body,
        saveEs: saveEs.toString(),
        saveHbase: saveHbase.toString(),
        topicList: [
          {
            key: '',
            description: '',
            type: '',
            disabled: false
          }
        ],
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
      // 创建
      //  异步获取主题列表
      const activeTopicIDs = await this.getActiveTopics(topicInterFaceType['服务主动拉取'])
      // loading
      this.createUrlLoading = false
      activeTopicIDs.unshift({
        text: `新增主题`,
        value: '新增主题',
        topicName: '',
        dataStruct: '',
        dsAnnotation: ''
      })
      this.formProvide.formObj = {
        isEdit: false,
        canNotEdit: true,
        newTopics: true,
        cron: '0',
        activeTopicIDs: activeTopicIDs,
        id: activeTopicIDs[0].value,
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
        saveEs: '1',
        saveHbase: `1`,
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

    this.formProvide.btnName = ['立即提交']
    this.formProvide.title = '服务主动拉取'
    this.formProvide.methodName = 'addServePull'
    this.fDialogFlag = true
    this.fDialogShow = 2
  }

  // addServePull
  private async addServePull(items: offlineTableType) {
    const {
      id,
      topicName,
      topicList,
      taskId,
      taskName,
      isEdit,
      newTopics,
      header,
      AuthorizationObj,
      url,
      t_id,
      type,
      body,
      cron,
      saveEs,
      uid,
      saveHbase,
      taskConfigId
    } = items

    const [numberS, keyS] = this.h_utils.topicListUtil.transTopicListToJson(topicList)

    // 去除key为空的项
    let _obj = [...this.h_utils.topicListUtil.cleanObj(header)]

    // 只在新建的时候 转base64
    if (!isEdit && AuthorizationObj[0].key && AuthorizationObj[0].value) {
      _obj.unshift(this.h_utils.topicListUtil.authorizationBase64(AuthorizationObj[0]))
    }

    // 请求体
    const params: any = {
      taskName,
      cron: `0 0 ${cron} * * ?`,
      t: {
        url,
        type,
        topicName,
        header: JSON.stringify(_obj),
        saveEs: Number(saveEs),
        saveHbase: Number(saveHbase)
      }
    }
    // 如果是post请求，会有body字段
    type === `post` && (params.t.body = body.replace(/\s+/g, ''))

    // 如果是复用主题，只传入id
    newTopics ? ((params.t.dataStruct = keyS), (params.t.dsAnnotation = numberS)) : (params.t.topicId = Number(id))

    isEdit && ((params.t.id = t_id), (params.taskConfigId = taskConfigId), (params.id = taskId), (params.uid = uid))

    const { success } = await this.h_request['httpPOST'](
      !isEdit ? 'POST_OFFLINE_SAVEURLTASK' : 'POST_OFFLINE_UPDATEURLTASK',
      params
    )

    if (success) {
      this.h_utils['alertUtil'].open(!isEdit ? '任务创建成功' : '任务修改成功', true, 'success')
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

  // pullFTP
  private async pullFTP(item?: any) {
    item ? (this.createFtpLoading = false) : (this.createFtpLoading = true)

    // 修改
    if (item) {
      const { cron, taskName, taskConfigId, uid } = item
      const {
        topicId,
        topicName,
        dataStruct,
        dsAnnotation,
        id,
        filePrefix,
        host,
        password,
        port,
        tableName,
        username,
        basePath
      } = item.t

      this.formProvide.formObj = {
        canNotEdit: true,
        isEdit: true,
        newTopics: false,
        topicName: topicName,
        taskName,
        taskId: item.id,
        taskConfigId,
        t_id: id,
        uid,
        activeTopicIDs: [
          {
            text: topicId.toString(),
            value: topicId.toString(),
            topicName: topicName,
            dataStruct: dataStruct,
            dsAnnotation: dsAnnotation
          }
        ],
        filePrefix,
        password,
        tableName,
        username,
        basePath,
        id: topicId.toString(),
        cron,
        ftp: [
          {
            host,
            port
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
    } else {
      // 创建
      //  异步获取主题列表
      const activeTopicIDs = await this.getActiveTopics(topicInterFaceType['拉取FTP'])
      // loading
      this.createFtpLoading = false

      activeTopicIDs.unshift({
        text: `新增主题`,
        value: '新增主题',
        topicName: '',
        dataStruct: '',
        dsAnnotation: ''
      })
      this.formProvide.formObj = {
        isEdit: false,
        canNotEdit: true,
        newTopics: true,
        cron: '0',
        activeTopicIDs: activeTopicIDs,
        id: activeTopicIDs[0].value,
        ftp: [
          {
            host: '',
            port: ''
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

    this.fDialogFlag = true
    this.fDialogShow = 3
    this.formProvide.btnName = ['立即提交']
    this.formProvide.title = '拉取FTP'
    this.formProvide.methodName = 'addFTP' // 立即提交
  }

  // addFTP
  private async addFTP(items: offlineTableType) {
    const {
      id,
      topicName,
      topicList,
      taskName,
      isEdit,
      newTopics,
      cron,
      t_id,
      taskId,
      uid,
      taskConfigId,
      basePath,
      filePrefix,
      tableName,
      username,
      password,
      ftp
    } = items

    // 获得转化后的 topicList
    const [numberS, keyS] = this.h_utils.topicListUtil.transTopicListToJson(topicList)

    const params: any = {
      taskName,
      cron: `0 0 ${cron} * * ?`,
      t: {
        basePath,
        filePrefix,
        tableName,
        username,
        password,
        topicName,
        host: ftp[0].host,
        port: Number(ftp[0].port)
      }
    }

    // 如果是复用主题，只传入id
    newTopics ? ((params.t.dataStruct = keyS), (params.t.dsAnnotation = numberS)) : (params.t.topicId = Number(id))
    isEdit && ((params.t.id = t_id), (params.taskConfigId = taskConfigId), (params.id = taskId), (params.uid = uid))

    const { success } = await this.h_request['httpPOST'](
      !isEdit ? 'POST_OFFLINE_SAVEFTPTASK' : 'POST_OFFLINE_UPDATEFTPTASK',
      params
    )

    if (success) {
      this.h_utils['alertUtil'].open(!isEdit ? '任务创建成功' : '任务修改成功', true, 'success')
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

  // 获得可用topics
  private async getActiveTopics(type: number) {
    const { data } = await this.h_request.httpGET(`GET_OFFLINE_SELECTTOPICBYTYPE`, {
      type
    })

    if (data) {
      const _data = data.map(
        ({
          id,
          topicName,
          dataStruct,
          dsAnnotation
        }: {
          id: number
          topicName: string
          dataStruct: string
          dsAnnotation: string
        }) => {
          return {
            text: id.toString(),
            value: id.toString(),
            topicName,
            dataStruct,
            dsAnnotation
          }
        }
      )
      return Promise.resolve(_data)
    } else {
      return Promise.resolve([])
    }
  }

  // 修改
  private updateItems(item: { taskType: number }) {
    if (item.taskType === 2) {
      // 数据库采集
      this.createDataBaseAcquisition(item)
    } else if (item.taskType === 3) {
      // 服务端主动拉取
      this.createServePull(item)
    } else if (item.taskType === 5) {
      // ftp
      this.pullFTP(item)
    }
  }

  // 查询通用调用方法 结构化数据
  private async searchMethod(bool: boolean, params: paramsType, tab: number) {
    this.loading = true
    let _data: returnTypeData
    if (tab === 2 || tab === 3) {
      params.dataType = dataType['结构化']
      // params.faceTypes = `${topicInterFaceType['数据库采集']},${topicInterFaceType['服务主动拉取']},${topicInterFaceType['拉取FTP']}`
      params.faceTypes = `${topicInterFaceType['服务主动拉取']},${topicInterFaceType['拉取FTP']}`
    }

    if (tab === 0) {
      const { data }: returnType = bool
        ? await this.h_request['httpGET']<object>('GET_OFFLINE_FINDALLTASKBYID', params)
        : await this.h_request['httpGET']<object>('GET_OFFLINE_FINDALLTASK', params)
      _data = data ? { ...data } : undefined
    } else if (tab === 1) {
      const { data }: returnType = bool
        ? await this.h_request['httpGET']<object>('GET_OFFLINE_FINDMYTASKBYID', params)
        : await this.h_request['httpGET']<object>('GET_OFFLINE_FINDMYTASK', params)
      _data = data ? { ...data } : undefined
    } else if (tab === 2) {
      const { data }: returnType = bool
        ? await this.h_request['httpGET']<object>('GET_TOPICS_SELECTTOPIC', params)
        : await this.h_request['httpGET']<object>('GET_TOPICS_FIND_ALL', params)
      _data = data ? { ...data } : undefined
    } else {
      const { data }: returnType = bool
        ? await this.h_request['httpGET']<object>('GET_TOPICS_MYTOPICSBYID', params)
        : await this.h_request['httpGET']<object>('GET_TOPICS_MYTOPICS', params)
      _data = data ? { ...data } : undefined
    }

    // flag用于标识是否已经拉取附加信息
    this.desserts = _data && _data.list ? [..._data.list] : []
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
      const _query = this.tab === 0 || this.tab === 1 ? `taskId` : `topicID`
      this.searchMethod(
        true,
        {
          [_query]: this.queryTopicID,
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
    tab === 0 || tab === 1 ? (this.searchLabel = '任务') : (this.searchLabel = '主题')
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
  private dataStructureDetails(item: { t: object }) {
    this.tDialogFlag = true
    this.tDialogShow = 1
    this.rowObj = this.tab === 0 || this.tab === 1 ? item.t : item
    this.formProvide.title = '数据结构详情'
  }
  // 最新日志
  private async getCurrentLog(item: { id: number }) {
    this.$set(item, `loading`, true)
    this.row = ''
    const { data } = await this.h_request.httpGET('GET_OFFLINE_SELECTOFFLINELOG', {
      taskId: item.id,
      pageNum: 1,
      pageSize: 1
    })
    if (!data) {
      this.$set(item, `loading`, false)
      return
    }

    if (data.list.length > 0) {
      const item = data.list[0]
      this.row = `
      <v-card-text>
        <div>时间：${item.executeTime}</div>
        <div>状态：${offlineResult[item.result]}</div>
        <div>日志：${item.log}</div>
      </v-card-text>
      `
      this.formProvide.title = `最新日志`
    } else {
      this.row = ''
      this.$set(item, `loading`, false)
      this.h_utils['alertUtil'].open(`未查询到最新日志`, true, 'error', 1500)
      return
    }

    this.$set(item, `loading`, false)
    this.tDialogFlag = true
    this.tDialogShow = 4
  }

  // 历史日志
  private async getHistoryLog(taskId: number) {
    this.$router.push({
      name: `离线数据统计`,
      query: {
        taskId: `${taskId}`
      }
    })
  }

  // 附加信息
  private async getTopicInformation(item: { t: object; taskType: number }) {
    this.tDialogFlag = true
    this.tDialogShow = 2
    this.formProvide.title = '附加信息'
    item.t && (this.otherObj = { taskType: item.taskType, ...item.t })
  }

  // 时间信息
  private showTimerLog(item: offlineTableType) {
    this.headersObj = [
      {
        text: '创建时间',
        align: 'center',
        value: 'createTime'
      },
      {
        text: '最后运行时间',
        align: 'center',
        value: 'lastRunTime'
      },
      {
        text: '修改时间',
        align: 'center',
        value: 'updateTime'
      }
    ]
    this.otherObj = item
    this.tDialogFlag = true
    this.tDialogShow = 3
    this.formProvide.title = '时间信息'
  }

  // 启动
  private async startOfflineData(item: { id: number }) {
    const { success } = await this.h_request['httpGET']('GET_OFFLINE_STARTTASK', {
      taskId: item.id
    })

    if (success) {
      this.h_utils['alertUtil'].open(`任务${item.id}已启动`, true, 'success')
      // 乐观更新
      this.$set(item, `isRun`, 1)
    }
  }

  // 停止
  private async stopOfflineData(item: { id: number }) {
    const { success } = await this.h_request['httpGET']('GET_OFFLINE_STOPTASK', {
      taskId: item.id
    })

    if (success) {
      this.h_utils['alertUtil'].open(`任务${item.id}已停止`, true, 'success')
      // 乐观更新
      this.$set(item, `isRun`, 0)
    }
  }

  // 重跑
  private async reloadOfflineData(item: { id: number }) {
    const { success } = await this.h_request['httpGET']('GET_OFFLINE_RUNTASKAGAIN', {
      taskId: item.id
    })
    if (success) {
      this.h_utils['alertUtil'].open(`任务${item.id}已重跑`, true, 'success')
    }
  }

  // 删除
  private async deleteTopic() {
    if (this.HConfirmItem.id === undefined) {
      return
    }
    const { success } = await this.h_request['httpGET']('GET_OFFLINE_DELETETASK', {
      taskId: this.HConfirmItem.id
    })
    if (success) {
      this.HConfirmShow = false
      this.h_utils['alertUtil'].open('任务删除成功', true, 'success')
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

  // 删除
  private handelDeleteTopic(item: { id: string }) {
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
}
</script>
