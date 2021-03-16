<template>
  <div id="transactionalDataList">
    <v-row>
      <v-col cols="3">
        <v-text-field
          solo
          dense
          height="35px"
          placeholder="请输入查找的事务主题ID"
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
      <v-col>
        <v-btn
          color="primary"
          width="95px"
          height="35px"
          depressed
          class="mr-6"
          small
          dark
          @click="createTransactionalData()"
        >
          创建事务主题
        </v-btn>
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
          <template v-slot:sqlMaxContent="{ item }">
            <v-btn text color="primary" @click="sqlMaxContentDetails(item)">自增属性查询脚本</v-btn>
          </template>
          <template v-slot:jsonContent="{ item }">
            <v-btn text color="primary" @click="jsonContentDetails(item)">DataX脚本</v-btn>
          </template>
          <template v-slot:buttons="{ item }">
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
              @click="stateOrStopTransactionalData(item.id, 1)"
              :disabled="item.state === -1 || item.state === 1"
              >启动</v-btn
            >
            <v-btn
              v-if="!tab"
              text
              color="primary"
              :disabled="item.state === -1 || item.state === 2"
              @click="stateOrStopTransactionalData(item.id, 2)"
              >停止</v-btn
            >
            <v-btn v-if="!tab" text color="primary" @click="reloadTransactionalData(item.id)">重跑</v-btn>
          </template>
        </h-table>
      </v-tab-item>
    </v-tabs-items>
    <!-- 表单展示 -->
    <f-dialog v-if="fDialogFlag" v-model="fDialogFlag">
      <CreateTransactionalData />
    </f-dialog>

    <!-- 表格显示 -->
    <t-dialog v-model="tDialogFlag">
      <ContentDetails :rowJson="rowJson" />
    </t-dialog>

    <h-confirm v-model="HConfirmShow" @hconfirm="deleteTopic" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { paramsType, returnDataType } from '@/type/http-request.type'
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
import { TopicAdd } from '@/type/topic-add.type'
import ContentDetails from './childComponent/contentDetails.vue'
import { tableHeaderType } from '@/type/table.type'

@Component({
  components: {
    HTable,
    HConfirm,
    TDialog,
    FDialog,
    CreateTransactionalData,
    ContentDetails
  }
})
@http
@util
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

  private tab = null
  private items = ['所有主题', '我的主题']
  private fDialogFlag = false // 弹窗展示
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
      text: '自增属性',
      align: 'center',
      slot: 'sqlMaxContent'
    },
    {
      text: 'DataX脚本',
      align: 'center',
      slot: 'jsonContent'
    },
    {
      text: '操作',
      align: 'center',
      slot: 'buttons'
    }
  ]
  // 创建 修改事务性数据
  private createTransactionalData(items?: any) {
    // 创建
    this.fDialogFlag = true
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
    this.rowJson = item.sqlMaxContent
  }

  // datax回显
  private jsonContentDetails(item: { jsonContent: string }) {
    this.tDialogFlag = true
    this.formProvide.title = 'DataX脚本'
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
        cron: `0 0 ${cron.replaceAll(' 时', '')} * * *`,
        sqlMaxContent: '',
        maxValue,
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

  // 查询通用调用方法 结构化数据
  private async searchMethod(bool: boolean, params: paramsType, tab?: boolean) {
    // console.log(bool)
    // console.log(params)
    // console.log(tab)
    this.loading = true
    params.faceTypes = `${topicInterFaceType['事务数据']}`
    params.dataType = dataType['结构化']

    if (tab) {
      const { data }: returnDataType = bool
        ? await this.h_request['httpGET']('GET_TOPICS_MYTOPICSBYID', params)
        : await this.h_request['httpGET']('GET_TOPICS_MYTOPICS', params)
      this.desserts = data.list.map((item: any) => {
        return { ...item }
      })
      this.paginationLength = Math.ceil(data['total'] / this.pageSize) || 1
    } else {
      // console.log(params)

      const { data }: returnDataType = bool
        ? await this.h_request['httpGET']('GET_TOPICS_SELECTTOPIC', params)
        : await this.h_request['httpGET']('GET_TOPICS_FIND_ALL', params)
      this.desserts = data.list.map((item: any) => {
        return { ...item }
      })
      this.paginationLength = Math.ceil(data['total'] / this.pageSize) || 1
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
  private async stateOrStopTransactionalData(topicId: number, state: number) {
    // console.log(topicId)
    const data = await this.h_request['httpGET']('GET_TOPICS_UPDATETRANSACTIONALTOPICSTATE', {
      topicId,
      state
    })
    console.log(data)
    if (data.success) {
      this.h_utils['alertUtil'].open(state === 1 ? '启动成功' : '停止成功', true, 'success')

      setTimeout(() => {
        this.searchMethod(
          false,
          {
            pageNum: 1,
            pageSize: this.pageSize
          },
          !!this.tab
        )
      }, 2500)
    }
  }
  // 重跑
  private reloadTransactionalData(topicId: number) {
    console.log(topicId)
  }
}
</script>
