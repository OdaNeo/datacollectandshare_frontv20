<template>
  <div id="transactionalDataList">
    <v-row>
      <HSearch
        v-model="queryTopicID"
        :label="`请输入查找的${searchLabel}ID`"
        @append="searchTopic"
        @enter="searchTopic"
        @clear="tabChange(tab)"
        v-only-num
      />
      <v-col>
        <v-btn
          color="primary"
          depressed
          class="mr-6"
          :loading="createLoading"
          small
          dark
          @click="createTransactionalData()"
          >创建任务</v-btn
        >
        <v-btn color="primary" :loading="uploadBtnLoading" depressed class="mr-6" small dark @click="uploadSQL">
          上传SQL
        </v-btn>
      </v-col>
    </v-row>

    <!-- tab -->
    <HTabs v-model="tab" :items="items" @change="tabChange" />

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
          <!-- 关联主题 -->
          <template v-slot:topic="{ item }">
            <v-btn text color="primary" @click.stop="showTopicDetail(item)">详情</v-btn>
          </template>
          <!-- 当前状态 -->
          <template v-slot:state="{ item }">
            <v-btn text :color="stateColor[item.isRun]">{{ transactionalState[item.isRun] }}</v-btn>
          </template>
          <!-- 脚本 -->
          <template v-slot:content="{ item }">
            <v-btn text color="primary" :disabled="!item.t.sqlMaxContent" @click="sqlMaxContentDetails(item.t)"
              >自增属性</v-btn
            >
            <v-btn text color="primary" @click="jsonContentDetails(item.t)">DataX</v-btn>
          </template>
          <!-- 日志 -->
          <template v-slot:log="{ item }">
            <v-btn text color="primary" :loading="!!item.loading" @click.stop="getCurrentLog(item)">最新</v-btn>
            <v-btn text color="primary" @click.stop="getHistoryLog(item.id)">历史</v-btn>
            <v-btn text color="primary" @click.stop="showTimerLog(item)">其他</v-btn>
          </template>
          <!-- 主题数据结构 -->
          <template v-slot:column="{ item }">
            <v-btn text color="primary" @click.stop="showColumn(item)">主题数据结构</v-btn>
          </template>
          <!-- 关联任务 -->
          <template v-slot:taskInfoList="{ item }">
            <v-btn
              text
              color="primary"
              :disabled="!item.taskInfoList || (item.taskInfoList && !item.taskInfoList.length > 0)"
              @click.stop="showTaskInfoList(item)"
            >
              关联任务详情
            </v-btn>
          </template>
          <!-- 操作 -->
          <template v-slot:buttons="{ item }">
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
    <HDialog v-if="fDialogFlag" v-model="fDialogFlag" :indeterminate="false" :value="upLoadingProgress">
      <CreateTransactionalData v-if="dialogFlag === 1" />
      <UploadSQL v-if="dialogFlag === 2" @change="transformSQLFile" />
    </HDialog>

    <!-- 表格显示 -->
    <TDialog v-if="tDialogFlag" v-model="tDialogFlag" :width="dialogFlag === 5 ? 950 : 700">
      <HContentDetails v-if="dialogFlag === 3" :row="row" />
      <HTable v-if="dialogFlag === 4 || dialogFlag === 5" :headers="headersObj" :desserts="dessertsObj"></HTable>
    </TDialog>

    <HConfirm v-model="HConfirmShow" @hconfirm="deleteTopic" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { paramsType, returnType } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import { topicTable } from '@/type/topic.type'
import HTable from '@/components/h-table.vue'
import HConfirm from '@/components/h-confirm.vue'
import TDialog from '@/components/t-dialog.vue'
import HDialog from '@/components/h-dialog.vue'
import util from '@/decorator/utilsDecorator'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum'
import { FormObj } from '@/type/dialog-form.type'
import CreateTransactionalData from './childComponent/createTransactionalData.vue'
import UploadSQL from './childComponent/uploadSQL.vue'
import HContentDetails from '@/components/h-content-details.vue'
import { tableHeaderType } from '@/type/table.type'
import upload from '@/decorator/uploadDecorator'
import HSearch from '@/components/h-search.vue'
import { uploadStoreModule } from '@/store/modules/upload'
import HTabs from '@/components/h-tabs.vue'
import { transactionalTableType } from '@/type/transactional-data.type'
import cronstrue from 'cronstrue/i18n'
import { topicState, stateColor, taskResult } from '@/enum/state-enum'
import { dataType } from '@/enum/topic-datatype-enum'

@Component({
  components: {
    HTable,
    HConfirm,
    TDialog,
    HDialog,
    CreateTransactionalData,
    HContentDetails,
    UploadSQL,
    HSearch,
    HTabs
  }
})
@http
@util
@upload
export default class transactionalDataList extends Vue {
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
  private fDialogFlag = false // 弹窗展示
  private dialogFlag = 0
  private tDialogFlag = false // 表格展示
  private queryTopicID = '' // 查询主题ID input框内容
  private searchLabel: `任务` | `主题` = `任务`

  private transactionalState = topicState
  private stateColor = stateColor

  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 20 // 每页展示多少条数据

  private HConfirmShow = false
  private HConfirmItem: Partial<transactionalTableType> = {
    id: '',
    topicName: '',
    topicInterFaceType: 0
  }

  private row = ''

  private headersObj: Array<tableHeaderType> = []
  private dessertsObj = {}

  private sqlFile: File | null = null
  private sqlForms = new FormData()
  private sqlTimer = 0

  private uploadBtnLoading = false
  private createLoading = false

  private get upLoadingProgress() {
    return uploadStoreModule.upLoadingProgress
  }

  private desserts: Array<topicTable> = [] // 数据列表
  private loading = true

  private get headers(): Array<tableHeaderType> {
    return [
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
        text: '所属用户',
        align: 'center',
        value: 'userName',
        isHide: this.tab === 1 || this.tab === 3
      },
      {
        text: '主题名称',
        align: 'center',
        value: 'topicName',
        isHide: this.tab === 0 || this.tab === 1
      },

      {
        text: '主题数据结构',
        align: 'center',
        slot: 'column',
        isHide: this.tab === 0 || this.tab === 1
      },
      {
        text: '关联任务',
        align: 'center',
        slot: 'taskInfoList',
        isHide: this.tab === 0 || this.tab === 1
      },
      {
        text: '任务名称',
        align: 'center',
        value: 'taskName',
        isHide: this.tab === 2 || this.tab === 3
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
          // cronstrue 插件报错会导致整个dom树崩掉
          let _corn = ''
          try {
            _corn = cronstrue.toString(cron, { locale: 'zh_CN', use24HourTimeFormat: true })
          } catch {
            _corn = cron
          }
          return _corn
        }
      },
      {
        text: '主题关联',
        align: 'center',
        slot: 'topic',
        isHide: this.tab === 2 || this.tab === 3
      },
      {
        text: '脚本',
        align: 'center',
        slot: 'content',
        isHide: this.tab === 2 || this.tab === 3
      },
      {
        text: '日志及其他',
        align: 'center',
        slot: 'log',
        isHide: this.tab === 2 || this.tab === 3
      },
      {
        text: '操作',
        align: 'center',
        slot: 'buttons',
        isHide: this.tab !== 1
      }
    ]
  }

  // 操作下拉框
  private buttonItems = [
    {
      text: `修改`,
      tab: [1],
      handle: this.createTransactionalData
    },
    {
      text: `启动`,
      tab: [1],
      state: `1`,
      handle: this.startTransactionalData
    },
    {
      text: `停止`,
      tab: [1],
      state: `0`,
      handle: this.stopTransactionalData
    },
    {
      text: `重跑`,
      tab: [1],
      handle: this.reloadTransactionalData
    },
    {
      text: '删除',
      tab: [1],
      color: `error`,
      handle: this.handelDeleteTopic
    }
  ]

  // 创建 修改事务性数据，添加任务
  private async createTransactionalData(items?: transactionalTableType) {
    items ? (this.createLoading = false) : (this.createLoading = true)
    //  异步获取主题列表
    const activeTopicIDs = await this.getActiveTopics()

    // loading
    this.createLoading = false

    this.formProvide.btnName = items ? ['立即修改'] : ['立即提交']
    this.formProvide.title = items ? '修改任务' : '创建任务'
    this.formProvide.methodName = 'addTransactionalData'

    this.fDialogFlag = true
    this.dialogFlag = 1

    // 修改 不能新建主题，只能复用
    if (items) {
      const _inputContent = JSON.parse(items.t.inputContent)
      activeTopicIDs.unshift({
        text: items.t.topicId.toString(),
        value: items.t.topicId.toString(),
        topicName: items.t.topicName,
        dataStruct: items.t.dataStruct
      })
      const _column: { field: string; type: string; description?: string; iskey: boolean }[] = JSON.parse(
        activeTopicIDs[0].dataStruct
      )

      this.formProvide.formObj = {
        isEdit: true,
        newTopics: false,
        taskId: items.id,
        id: items.t.topicId.toString(),
        taskConfigId: items.taskConfigId,
        topicName: items.t.topicName,
        activeTopicIDs: activeTopicIDs,
        taskName: items.taskName,
        t_id: items.t.id,
        maxValues: items.t.maxValues,
        cron: items.cron,
        increment: _inputContent.reader.info.increment,
        reader_database: _inputContent.reader.database,
        reader_jdbcUrl: _inputContent.reader.info.jdbcurl.replaceAll('jdbc:mysql://', ''),
        reader_password: _inputContent.reader.info.password,
        reader_table: _inputContent.reader.info.table,
        reader_username: _inputContent.reader.info.username,
        writer_database: _inputContent.writer.database,
        writer_table: _inputContent.writer.info.table,
        writer_zookeeper_url: _inputContent.writer.info.zookeeper_url,
        column: _column.map((item: { field: string; type: string; description?: string; iskey: boolean }) => {
          return {
            ...item,
            iskey: `${item.iskey}`,
            disabled: true
          }
        })
      }
    } else {
      // 创建
      activeTopicIDs.unshift({
        text: `新增主题`,
        value: '新增主题',
        topicName: '',
        dataStruct: ''
      })
      this.formProvide.formObj = {
        isEdit: false,
        newTopics: true,
        activeTopicIDs: activeTopicIDs,
        id: activeTopicIDs[0].value,
        cron: '* * * * * ?',
        column: [
          {
            field: '',
            type: 'string',
            iskey: 'false',
            description: '',
            disabled: false
          }
        ]
      }
    }
  }

  // 获得可用topics
  private async getActiveTopics() {
    const { data } = await this.h_request.httpGET(`GET_TASKINFO_SELECTTRANSCATIONTOPIC`, {})
    if (data) {
      const _data = data.map(({ id, topicName, dataStruct }: { id: number; topicName: string; dataStruct: string }) => {
        return {
          text: id.toString(),
          value: id.toString(),
          topicName: topicName,
          dataStruct: dataStruct
        }
      })
      return Promise.resolve(_data)
    } else {
      return Promise.resolve([])
    }
  }

  // 自增属性显示
  private sqlMaxContentDetails(t: { sqlMaxContent: string }) {
    this.tDialogFlag = true
    this.formProvide.title = '自增属性查询脚本'
    this.dialogFlag = 3
    this.row = JSON.parse(t.sqlMaxContent)
  }

  // datax回显
  private jsonContentDetails(t: { jsonContent: string }) {
    this.tDialogFlag = true
    this.formProvide.title = 'DataX脚本'
    this.dialogFlag = 3
    this.row = JSON.parse(t.jsonContent)
  }

  // 提交事务性数据 后台验重
  private async addTransactionalData(item: transactionalTableType) {
    const isEdit = item.isEdit
    const newTopics = item.newTopics
    const params: any = {}
    const {
      topicName,
      taskName,
      id,
      t_id,
      taskId,
      cron,
      column,
      increment,
      maxValues,
      taskConfigId,
      reader_database,
      reader_jdbcUrl,
      reader_password,
      reader_table,
      reader_username,
      writer_database,
      writer_table,
      writer_zookeeper_url
    } = item

    const topicId = !newTopics ? id : undefined
    const _id = isEdit ? taskId : undefined
    // 验证cron合法性
    const cronValidated = this.h_utils.lib.cronValidator(cron)
    if (!cronValidated) {
      return
    }

    // reader
    params.reader = {
      database: reader_database,
      info: {
        jdbcurl: `jdbc:mysql://${reader_jdbcUrl}`,
        username: reader_username,
        password: reader_password,
        table: reader_table,
        increment: increment
      }
    }
    // writer
    params.writer = {
      database: writer_database,
      info: {
        zookeeper_url: writer_zookeeper_url,
        table: writer_table
      }
    }

    // column
    params.column = column.map((item: { field: string; type: string; description?: string; iskey: string }) => {
      return {
        field: item.field,
        type: item.type,
        description: item.description,
        iskey: JSON.parse(item.iskey)
      }
    })

    // 全量更新
    const { success } = await this.h_request['httpPOST'](
      !isEdit ? 'POST_TASKINFO_ADDDATATASK' : 'POST_TASKINFO_UPDATETASKINFORDB',
      {
        id: _id,
        cron,
        taskType: topicInterFaceType[`事务数据`],
        taskName: taskName,
        taskConfigId,
        t: {
          maxValues: maxValues,
          inputContent: JSON.stringify(params),
          topicId,
          id: t_id,
          topicName,
          reader: JSON.stringify(params.reader),
          writer: JSON.stringify(params.writer),
          dataStruct: JSON.stringify(params.column),
          dsAnnotation: JSON.stringify(params.column[0])
        }
      }
    )

    if (success) {
      this.h_utils['alertUtil'].open(!isEdit ? '主题创建成功' : '主题修改成功', true, 'success')
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

  // 上传SQl文件
  private async uploadSQL() {
    // 查询当前是否有任务在执行
    this.uploadBtnLoading = true
    const { data } = await this.h_request.httpGET('GET_TOPICS_CHECKUSERUPLOADTASKSTATUS', {})
    this.uploadBtnLoading = false

    if (data === true) {
      this.fDialogFlag = true
      this.dialogFlag = 2
      this.formProvide.btnName = ['立即上传']
      this.formProvide.title = '上传SQL文件'
      this.formProvide.methodName = 'uploadSQLFile'
      this.formProvide.formObj = {}
    } else if (data === false) {
      this.h_utils['alertUtil'].open('当前用户已有任务在后台运行，请稍候', true, 'error')
    }
  }

  private async uploadSQLFile() {
    if (!this.sqlFile) {
      return
    }
    this.sqlForms = new FormData()
    this.sqlForms.append('ddlFile', this.sqlFile)

    const { success, data } = await this.h_upload.httpPOST('POST_TOPICS_ADDSQLFILE', this.sqlForms)

    if (success) {
      this.h_utils['alertUtil'].open('SQL文件上传成功，正在后台查询日志', true, 'success')
      this.getSQLFileLog(data)
      return Promise.resolve(success)
    }
  }

  // 轮询上传文件日志
  private async getSQLFileLog(id: unknown) {
    clearInterval(this.sqlTimer)

    // 0: 进行 1：成功 2: 失败 3：sql文件执行完毕
    this.sqlTimer = setInterval(async () => {
      const { data, message } = await this.h_request.httpGET('GET_TOPICS_SELECTSQLFILELOG', { id })

      if (data !== 0) {
        // SQL日志详情
        this.row = message
        this.tDialogFlag = true
        this.dialogFlag = 3
        this.formProvide.title = 'SQL日志详情'

        clearInterval(this.sqlTimer)
      }
    }, 5000)
  }

  // transformSQLFile
  private transformSQLFile(e: File) {
    if (!e) {
      return
    }
    this.sqlFile = e
  }
  // 查询通用调用方法
  private async searchMethod(bool: boolean, params: paramsType, tab: number) {
    this.loading = true
    // 事务 任务/主题 =8

    if (tab === 0) {
      params.type = topicInterFaceType[`事务数据`]
      // 所有任务
      const { data }: returnType = bool
        ? await this.h_request['httpGET']('GET_TASKINFO_FINDALLTASKBYTASKID', params)
        : await this.h_request['httpGET']('GET_TASKINFO_FINDALLTASK', params)

      this.desserts = data ? [...data.list] : []
      this.paginationLength = Math.ceil(data?.total / this.pageSize) || 1
    } else if (tab === 1) {
      params.type = topicInterFaceType[`事务数据`]
      // 我的任务
      const { data }: returnType = bool
        ? await this.h_request['httpGET']('GET_TASKINFO_FINDALLMYTASKBYID', params)
        : await this.h_request['httpGET']('GET_TASKINFO_FINDALLMYTASK', params)

      this.desserts = data ? [...data.list] : []
      this.paginationLength = Math.ceil(data?.total / this.pageSize) || 1
    } else if (tab === 2) {
      params['faceTypes'] = topicInterFaceType['事务数据']
      params['dataType'] = dataType['结构化']
      // 所有主题
      const { data }: returnType = bool
        ? await this.h_request['httpGET']('GET_TOPICS_SELECTTOPIC', params)
        : await this.h_request['httpGET']('GET_TOPICS_FIND_ALL', params)

      this.desserts = data ? [...data.list] : []
      this.paginationLength = Math.ceil(data?.total / this.pageSize) || 1
    } else {
      params['faceTypes'] = topicInterFaceType['事务数据']
      params['dataType'] = dataType['结构化']
      // 我的主题
      const { data }: returnType = bool
        ? await this.h_request['httpGET']('GET_TOPICS_MYTOPICSBYID', params)
        : await this.h_request['httpGET']('GET_TOPICS_MYTOPICS', params)

      this.desserts = data ? [...data.list] : []
      this.paginationLength = Math.ceil(data?.total / this.pageSize) || 1
    }
    this.loading = false
  }

  // handelDeleteTopic
  private handelDeleteTopic(item: Partial<transactionalTableType>) {
    this.HConfirmShow = true
    this.HConfirmItem = { ...item }
  }

  // 删除
  private async deleteTopic() {
    if (this.HConfirmItem.id === undefined) {
      return
    }
    const { success } = await this.h_request['httpGET']('GET_TASKINFO_DELETEDATATASK', {
      taskId: this.HConfirmItem.id
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

  // 主题详情
  private showTopicDetail(item: { t: object }) {
    this.headersObj = [
      {
        text: '主题ID',
        align: 'center',
        value: 'topicId'
      },
      {
        text: '主题名称',
        align: 'center',
        value: 'topicName'
      }
    ]
    item.t && (this.dessertsObj = { ...item.t })
    this.tDialogFlag = true
    this.dialogFlag = 4
    this.formProvide.title = '主题信息'
  }

  // 启动
  private async startTransactionalData(item: { id: number }) {
    const { success } = await this.h_request['httpGET']('GET_TASKINFO_UPDATETASKINFOSTATE', {
      id: item.id,
      isRun: 1
    })

    if (success) {
      this.h_utils['alertUtil'].open(`任务${item.id}已启动`, true, 'success')
      // 乐观更新
      this.$set(item, `isRun`, 1)
    }
  }

  // 停止
  private async stopTransactionalData(item: { id: number }) {
    const { success } = await this.h_request['httpGET']('GET_TASKINFO_UPDATETASKINFOSTATE', {
      id: item.id,
      isRun: 0
    })

    if (success) {
      this.h_utils['alertUtil'].open(`任务${item.id}已停止`, true, 'success')
      // 乐观更新
      this.$set(item, `isRun`, 0)
    }
  }

  // 重跑
  private async reloadTransactionalData(item: { id: number }) {
    const { success } = await this.h_request['httpGET']('GET_TASKINFO_RUNTASKAGAIN', {
      taskId: item.id
    })
    if (success) {
      this.h_utils['alertUtil'].open(`任务${item.id}已重跑`, true, 'success')
    }
  }

  // 最新日志
  private async getCurrentLog(item: { id: number }) {
    this.$set(item, `loading`, true)
    this.row = ''
    const { data } = await this.h_request.httpGET('GET_TASKINFO_FINDTRANSCATIONLOG', {
      taskId: item.id,
      type: topicInterFaceType['事务数据'],
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
        <div>状态：${taskResult[item.result]}</div>
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
    this.dialogFlag = 3
  }

  // 历史日志
  private async getHistoryLog(taskId: number) {
    this.$router.push({
      name: `事务数据统计`,
      query: {
        taskId: `${taskId}`
      }
    })
  }

  // 时间信息
  private showTimerLog(item: transactionalTableType) {
    this.headersObj = [
      {
        text: '自增属性最大值',
        align: 'center',
        value: 't',
        format: (t: { maxValues: string }) => {
          return t.maxValues
        }
      },
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
    this.dessertsObj = item
    this.tDialogFlag = true
    this.dialogFlag = 4
    this.formProvide.title = '其他信息'
  }

  // 主题数据结构
  private showColumn(item: transactionalTableType) {
    this.formProvide.title = '主题数据结构'
    this.dessertsObj = item.dataStruct ? JSON.parse(item.dataStruct) : ''
    this.headersObj = [
      {
        text: '字段名',
        align: 'center',
        value: 'field'
      },
      {
        text: '字段类型',
        align: 'center',
        value: 'type'
      },
      {
        text: '描述',
        align: 'center',
        value: `description`
      },
      {
        text: '是否为key',
        align: 'center',
        value: 'iskey'
      }
    ]
    this.tDialogFlag = true
    this.dialogFlag = 4
  }

  // 关联任务
  private showTaskInfoList(item: transactionalTableType) {
    this.dessertsObj = item.taskInfoList
    this.headersObj = [
      {
        text: '任务ID',
        align: 'center',
        value: 'id'
      },
      {
        text: '任务名称',
        align: 'center',
        value: 'taskName'
      },
      {
        text: '运行周期',
        align: 'center',
        value: 'cron',
        format: (cron: string) => {
          return cron ? cronstrue.toString(cron, { locale: 'zh_CN', use24HourTimeFormat: true }) : ''
        }
      },
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
    this.tDialogFlag = true
    this.dialogFlag = 5
    this.formProvide.title = '关联任务列表'
  }

  // 清除timer
  beforeDestroy(): void {
    clearInterval(this.sqlTimer)
  }
}
</script>
