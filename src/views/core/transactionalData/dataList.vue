<template>
  <div id="transactionalDataList">
    <v-row>
      <HSearch
        v-model="queryTopicID"
        pl
        placeholder="请输入查找的事务主题ID"
        @append="searchTopic"
        @enter="searchTopic"
        @clear="tabChange(tab)"
        v-only-num
      />
      <v-col>
        <v-btn color="primary" depressed class="mr-6" small dark @click="createTransactionalData()">
          创建事务主题
        </v-btn>
        <v-btn color="primary" :loading="uploadBtnLoading" depressed class="mr-6" small dark @click="uploadSQL"
          >上传SQL文件</v-btn
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
          :desserts="desserts"
          :pageNum="pageNum"
          :loading="loading"
          @PaginationNow="PaginationNow"
          :paginationLength="paginationLength"
        >
          <template v-slot:content="{ item }">
            <v-btn text color="primary" @click="sqlMaxContentDetails(item)">自增属性</v-btn>
            <v-btn text color="primary" @click="jsonContentDetails(item)">DataX</v-btn>
          </template>
          <template v-slot:buttons="{ item, index }">
            <v-btn v-if="tab" text color="primary" @click.stop="addItems(item)">修改</v-btn>
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
              v-if="!tab"
              text
              color="primary"
              @click="stateOrStopTransactionalData(item.id, index, 1)"
              :disabled="!item.state || item.state === -1 || item.state === 1"
              >启动</v-btn
            >
            <v-btn
              v-if="!tab"
              text
              color="primary"
              :disabled="!item.state || item.state === -1 || item.state === 2"
              @click="stateOrStopTransactionalData(item.id, index, 2)"
              >停止</v-btn
            >
            <v-btn
              v-if="!tab"
              text
              color="primary"
              :disabled="item.state === -1"
              @click="reloadTransactionalData(item.id)"
              >重跑</v-btn
            >
          </template>
          <template v-slot:log="{ item }">
            <v-btn text color="primary" :loading="!!item.loading" @click.stop="getCurrentLog(item)">最新日志</v-btn>
            <v-btn text color="primary" @click.stop="getHistoryLog(item.id)">历史日志</v-btn>
          </template>
        </h-table>
      </v-tab-item>
    </v-tabs-items>
    <!-- 表单展示 -->
    <f-dialog v-if="fDialogFlag" v-model="fDialogFlag">
      <CreateTransactionalData v-if="dialogFlag === 1" />
      <UploadSQL v-if="dialogFlag === 2" @change="transformSQLFile" />
    </f-dialog>

    <!-- 表格显示 -->
    <t-dialog v-model="tDialogFlag">
      <ContentDetails v-if="dialogFlag === 3" :rowJson="rowJson" />
      <SqlDetails v-if="dialogFlag === 4" :str="str" />
    </t-dialog>

    <h-confirm v-model="HConfirmShow" @hconfirm="deleteTopic" />
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
import FDialog from '@/components/f-dialog.vue'
import util from '@/decorator/utilsDecorator'
import { dataType } from '@/enum/topic-datatype-enum'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum'
import { FormObj } from '@/type/dialog-form.type'
import CreateTransactionalData from './childComponent/createTransactionalData.vue'
import UploadSQL from './childComponent/uploadSQL.vue'
import { TopicAdd } from '@/type/topic-add.type'
import ContentDetails from './childComponent/contentDetails.vue'
import { tableHeaderType } from '@/type/table.type'
import upload from '@/decorator/uploadDecorator'
import { mdiMagnify } from '@mdi/js'
import SqlDetails from './childComponent/sqlDetails.vue'
import HSearch from '@/components/h-search.vue'
import Moment from 'moment'

@Component({
  components: {
    HTable,
    HConfirm,
    TDialog,
    FDialog,
    CreateTransactionalData,
    ContentDetails,
    UploadSQL,
    SqlDetails,
    HSearch
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
  private mdiMagnify = mdiMagnify
  private tab = null
  private items = ['所有主题', '我的主题']
  private fDialogFlag = false // 弹窗展示
  private dialogFlag = 0
  private tDialogFlag = false // 表格展示
  private queryTopicID = '' // 查询主题ID input框内容

  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 20 // 每页展示多少条数据

  private HConfirmShow = false
  private HConfirmItem = {
    id: '',
    topicName: '',
    topicInterFaceType: 0
  }

  private rowJson = ''
  private str = ''
  private sqlFile: File | null = null
  private sqlForms = new FormData()
  private sqlTimer = 0

  private uploadBtnLoading = false

  private desserts: Array<topicTable> = [] // 数据列表
  private loading = true
  private headers: Array<tableHeaderType> = [
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
      text: '运行周期',
      align: 'center',
      value: 'cron'
    },
    {
      text: '自增属性最大值',
      align: 'center',
      value: 'maxValue'
    },
    {
      text: '脚本',
      align: 'center',
      slot: 'content'
    },
    {
      text: '操作',
      align: 'center',
      slot: 'buttons'
    },
    {
      text: '日志',
      align: 'center',
      slot: 'log'
    }
  ]
  // 创建 修改事务性数据
  private createTransactionalData(items?: any) {
    // 创建
    this.fDialogFlag = true
    this.dialogFlag = 1
    this.formProvide.btnName = items ? ['立即修改'] : ['立即提交']
    this.formProvide.title = items ? '修改事务主题' : '创建事务主题'
    this.formProvide.methodName = 'addTransactionalData'
    this.formProvide.formObj = {
      cron: '0 时',
      column: [
        {
          field: '',
          type: 'string',
          iskey: 'false'
        }
      ]
    }
    if (items) {
      // 修改
      this.formProvide.formObj.id = items.id
      this.formProvide.formObj.canNotEdit = true
      this.formProvide.formObj.topicName = items.topicName
      this.formProvide.formObj.maxValue = items.maxValue
      const _str = items.cron.replaceAll(' ', '')
      this.formProvide.formObj.cron = `${_str.slice(2, _str.length - 3)} 时`

      const _inputContent = JSON.parse(items.inputContent)
      console.log(_inputContent)
      this.formProvide.formObj.increment = _inputContent.reader.info.increment
      this.formProvide.formObj.reader_database = _inputContent.reader.database
      this.formProvide.formObj.reader_jdbcUrl = _inputContent.reader.info.jdbcurl.replaceAll('jdbc:mysql://', '')
      this.formProvide.formObj.reader_password = _inputContent.reader.info.password
      this.formProvide.formObj.reader_table = _inputContent.reader.info.table
      this.formProvide.formObj.reader_username = _inputContent.reader.info.username

      this.formProvide.formObj.writer_database = _inputContent.writer.database
      this.formProvide.formObj.writer_table = _inputContent.writer.info.table
      this.formProvide.formObj.writer_zookeeper_url = _inputContent.writer.info.zookeeper_url
      this.formProvide.formObj.column = _inputContent.column.map(
        (item: { field: string; type: string; iskey: boolean }) => {
          return {
            ...item,
            iskey: `${item.iskey}`
          }
        }
      )
      // this.formProvide.formObj.sqlMaxContent = items.sqlMaxContent
      // this.formProvide.formObj.jsonContent = items.jsonContent
    }
  }

  // 自增属性显示
  private sqlMaxContentDetails(item: { sqlMaxContent: string }) {
    this.tDialogFlag = true
    this.formProvide.title = '自增属性查询脚本'
    this.dialogFlag = 3
    this.rowJson = item.sqlMaxContent
  }

  // datax回显
  private jsonContentDetails(item: { jsonContent: string }) {
    this.tDialogFlag = true
    this.formProvide.title = 'DataX脚本'
    this.dialogFlag = 3
    this.rowJson = item.jsonContent
  }

  // 提交事务性数据
  private async addTransactionalData(item: any) {
    const canNotEdit = item.canNotEdit
    const params: any = {}
    const {
      topicName,
      id,
      cron,
      column,
      increment,
      maxValue,
      reader_database,
      reader_jdbcUrl,
      reader_password,
      reader_table,
      reader_username,
      writer_database,
      writer_table,
      writer_zookeeper_url
    } = item

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
    params.column = column.map((item: { field: string; type: string; iskey: string }) => {
      return {
        field: item.field,
        type: item.type,
        iskey: JSON.parse(item.iskey)
      }
    })
    console.log(params)

    const { success } = await this.h_request['httpPOST'](
      !canNotEdit ? 'POST_TOPICS_ADD' : 'POST_TOPICS_UPDATETRANSACTIONALTOPIC',
      {
        topicName,
        dataType: dataType['结构化'],
        topicInterFaceType: 8,
        cron: `0 0 ${cron.replaceAll(' 时', '')} * * ?`,
        sqlMaxContent: '',
        maxValue,
        state: 1,
        inputContent: JSON.stringify(params),
        id
      }
    )

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

  // 添加
  private addItems(item: TopicAdd) {
    // rest
    if (item.topicInterFaceType === 8) {
      this.createTransactionalData(item)
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
    // 0: 进行 1：完成
    this.sqlTimer = setInterval(async () => {
      const { data, message } = await this.h_request.httpGET('GET_TOPICS_SELECTSQLFILELOG', { id })

      if (data === 1) {
        // SQL日志详情
        this.str = message
        this.tDialogFlag = true
        this.dialogFlag = 4
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

  // 查询通用调用方法 结构化数据
  private async searchMethod(bool: boolean, params: paramsType, tab?: boolean) {
    // console.log(bool)
    // console.log(params)
    // console.log(tab)
    this.loading = true
    params.faceTypes = `${topicInterFaceType['事务数据']}`
    params.dataType = dataType['结构化']

    if (tab) {
      const { data }: returnType = bool
        ? await this.h_request['httpGET']('GET_TOPICS_MYTOPICSBYID', params)
        : await this.h_request['httpGET']('GET_TOPICS_MYTOPICS', params)
      this.desserts = data ? [...data.list] : []
      this.paginationLength = Math.ceil(data?.total / this.pageSize) || 1
    } else {
      // console.log(params)
      const { data }: returnType = bool
        ? await this.h_request['httpGET']('GET_TOPICS_SELECTTOPIC', params)
        : await this.h_request['httpGET']('GET_TOPICS_FIND_ALL', params)

      this.desserts = data ? [...data.list] : []
      this.paginationLength = Math.ceil(data?.total / this.pageSize) || 1
    }
    this.loading = false
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
  // 启停 1启动，2停止
  private async stateOrStopTransactionalData(topicId: number, index: number, state: number) {
    // console.log(topicId)
    const { success } = await this.h_request['httpGET']('GET_TOPICS_UPDATETRANSACTIONALTOPICSTATE', {
      topicId,
      state
    })
    // console.log(data)
    if (success) {
      this.h_utils['alertUtil'].open(state === 1 ? '启动成功' : '停止成功', true, 'success')
      // 乐观更新
      this.$set(this.desserts, index, {
        ...this.desserts[index],
        state
      })
    }
  }
  // 重跑
  private async reloadTransactionalData(topicId: number) {
    const { success } = await this.h_request['httpGET']('GET_TOPICS_RUNTRANSACTIONALTOPICAGAIN', {
      topicId
    })
    if (success) {
      this.h_utils['alertUtil'].open(`主题${topicId}重跑成功`, true, 'success')
    }
  }

  // 最新日志
  private async getCurrentLog(item: { id: number; loading: boolean | undefined }) {
    this.$set(item, `loading`, true)

    const { data } = await this.h_request.httpGET('GET_TOPICS_GETOFFLINELOGBYTOPICID', { topicId: item.id, num: 1 })
    if (data && data.list.length > 0) {
      this.rowJson = data.list[0].log
      this.formProvide.title = `创建时间：${Moment(data.list[0].createTime).format('YYYY/MM/DD k:mm:ss')}`
    } else {
      this.$set(item, `loading`, false)
      return
    }

    this.$set(item, `loading`, false)
    this.rowJson = ''
    this.tDialogFlag = true
    this.dialogFlag = 3
  }

  // 历史日志
  private async getHistoryLog(topicId: number) {
    this.$router.push({
      name: `事务数据统计`,
      query: {
        topicId: `${topicId}`
      }
    })
  }
  // 清除timer
  beforeDestroy(): void {
    clearInterval(this.sqlTimer)
  }
}
</script>
