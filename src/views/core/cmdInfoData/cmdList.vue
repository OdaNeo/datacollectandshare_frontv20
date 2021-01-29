<template>
  <div>
    <v-row>
      <v-col cols="3">
        <v-text-field
          solo
          dense
          height="35px"
          placeholder="请输入查找的命令ID"
          clearable
          append-icon="mdi-magnify"
          @click:append="searchCmd"
          v-model="queryCmdID"
          v-only-num="{
            set: this,
            name: 'userID'
          }"
        >
        </v-text-field>
      </v-col>
      <v-col cols="9">
        <v-btn color="primary" height="35px" dark @click.stop="createCommend(false)">创建命令</v-btn>
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
          @PaginationNow="PaginationNow"
          :paginationLength="paginationLength"
        >
          <template v-slot:buttons="{ item }">
            <v-btn text color="primary" @click="consumersSystem(item)">订阅系统信息详情</v-btn>
          </template>
          <template v-slot:buttons2="{ item }">
            <v-btn v-if="tab" text color="primary" @click.stop="createCommend(item)">修改</v-btn>
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
            <v-btn text color="primary" @click="getCmdDescription(item)">查看描述</v-btn>
          </template>
        </h-table>
      </v-tab-item>
    </v-tabs-items>
    <!-- form -->
    <f-dialog v-if="dialogFlag" v-model="dialogFlag">
      <create-cmd-dialog v-if="dialogShow === 1" />
    </f-dialog>

    <!-- table -->
    <t-dialog v-if="tDialogFlag" v-model="tDialogFlag">
      <cmd-information-dialog v-if="tDialogShow === 1" :headersObj="headersObj" :dessertsObj="dessertsObj" />
      <data-structure-dialog v-if="tDialogShow === 2" :headersObj="headersObj" :dessertsObj="dessertsObj" />
    </t-dialog>

    <h-confirm v-if="HConfirmShow" v-model="HConfirmShow" @hconfirm="deleteCmd" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { returnDataType } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import HConfirm from '@/components/h-confirm.vue'
import FDialog from '@/components/f-dialog.vue'
import TDialog from '@/components/t-dialog.vue'
import CreateCmdDialog from './childComponent/createCmdDialog.vue'
import { CmdAdd } from '@/type/cmd-add.type'
import util from '@/decorator/utilsDecorator'
import { rootStoreModule } from '@/store/modules/root'
import HTable from '@/components/h-table.vue'
import { FormObj } from '@/type/dialog-form.type'
import cmdInformationDialog from './childComponent/cmdInformationDialog.vue'
import DataStructureDialog from './childComponent/dataStructureDialog.vue'

@Component({
  components: {
    HTable,
    TDialog,
    FDialog,
    HConfirm,
    CreateCmdDialog,
    cmdInformationDialog,
    DataStructureDialog
  }
})
@http
@util
export default class CmdList extends Vue {
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
  private items = ['所有命令', '我的命令']
  private dialogFlag = false // 弹窗展示
  private dialogShow = 0 // 展示哪个弹窗 1.是添加和修改弹窗 2.是订阅系统详情和查看描述

  private dessertsObj: Array<any> = []
  private headersObj: Array<any> = []

  private onlyShowOther = false // 只显示补充信息

  private systemName = rootStoreModule.UserState.userMessage.systemName
  private producer = ''

  private HConfirmShow = false
  private HConfirmItem = {
    id: ''
  }
  private tDialogFlag = false
  private tDialogShow = 0

  private desserts: Array<any> = [] // 数据列表
  private queryCmdID = null // 查询命令ID input框内容
  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 20 // 每页展示多少条数据
  private headers = [
    // 表头内容 所有命令
    {
      text: '命令ID',
      align: 'center',
      value: 'id'
    },
    {
      text: '命令名称',
      align: 'center',
      value: 'cmdName'
    },
    {
      text: '所属用户',
      align: 'center',
      value: 'userName'
    },
    {
      text: '生产系统名',
      align: 'center',
      value: 'producer'
    },
    {
      text: '订阅系统信息',
      align: 'center',
      slot: 'buttons'
    },
    {
      text: '操作',
      align: 'center',
      slot: 'buttons2'
    }
  ]

  //  创建命令
  private createCommend(item: any) {
    this.dialogFlag = true
    this.dialogShow = 1
    this.formProvide.btnName = ['立即提交']
    this.formProvide.title = '创建命令'
    this.formProvide.methodName = 'addCmd' // 立即提交
    this.formProvide.formObj = {
      producer: this.producer
    }

    // 修改
    if (item) {
      this.formProvide.title = '修改命令'
      this.formProvide.formObj = {
        id: item.id, // 命令ID
        cmdName: item.cmdName, // 命令名称
        producer: item.producer, // 系统名称
        consumers: item.consumers.split(','), // 订阅系统名
        description: item.description // 描述（描述）
      }
    }
  }

  //  提交创建
  private async addCmd(formObj: CmdAdd) {
    const params: any = {}
    //  ADD 不提交id，UPDATE提交id
    formObj.id && (params.id = formObj.id)

    params.cmdName = formObj.cmdName
    params.producer = formObj.producer
    params.description = formObj.description
    params.consumers = formObj.consumers.join(',')

    const { success } = await this.h_request.httpPOST(!formObj.id ? 'POST_CMD_ADD' : 'POST_CMD_UPDATE', params)

    if (success) {
      this.h_utils.alertUtil.open(!formObj.canNotEdit ? '命令创建成功' : '命令修改成功', true, 'success')

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

  // 查询通用调用方法
  private async searchMethod(bool: boolean, params: object, tab?: boolean) {
    if (tab) {
      const { data }: returnDataType = bool
        ? await this.h_request.httpGET<object>('GET_CMD_MYCMDBYID', params)
        : await this.h_request.httpGET<object>('GET_CMD_MYCMD', params)

      data.list &&
        (this.desserts = data.list.map((item: any) => {
          return { ...item, flag: false }
        }))

      this.paginationLength = Math.ceil(data.total / this.pageSize) || 1
    } else {
      const { data }: returnDataType = bool
        ? await this.h_request.httpGET<object>('GET_CMD_SELECTCMD', params)
        : await this.h_request.httpGET<object>('GET_CMD_FIND_ALL', params)
      data.list &&
        (this.desserts = data.list.map((item: any) => {
          return { ...item, flag: false }
        }))

      this.paginationLength = Math.ceil(data.total / this.pageSize) || 1
    }
  }

  // 命令查询
  private searchCmd() {
    if (!this.queryCmdID) {
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
          id: this.queryCmdID
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
        pageNum: 1,
        pageSize: this.pageSize
      },
      !!tab
    )
    this.pageNum = 1
  }

  // 数据结构展示方法
  private consumersSystem(item: any) {
    this.tDialogFlag = true
    this.tDialogShow = 1
    this.formProvide.title = '订阅系统信息详情'
    this.headersObj = [
      {
        text: '数据编码',
        align: 'center',
        value: 'id'
      },
      {
        text: '订阅系统名称',
        align: 'center',
        value: 'key'
      },
      {
        text: '队列名',
        align: 'center',
        value: 'value'
      }
    ]

    this.dessertsObj = []
    const _consumers = item.consumers.split(',')
    const _queueNames = item.queueNames.split(',')
    for (let i = 0; i < _consumers.length; i++) {
      this.dessertsObj.push({
        id: i + 1,
        key: _consumers[i],
        value: _queueNames[i]
      })
    }
  }

  // 详情展示
  private getCmdDescription(info: any) {
    this.tDialogFlag = true
    this.tDialogShow = 1
    this.dessertsObj = info
    this.headersObj = [
      {
        text: '描述',
        align: 'center',
        value: 'description'
      }
    ]
    this.formProvide.title = '描述'
  }

  private async deleteCmd() {
    if (!this.HConfirmItem.id) {
      return
    }
    const { success } = await this.h_request.httpGET('GET_CMD_DELETE', {
      id: this.HConfirmItem.id
    })
    if (success) {
      this.HConfirmShow = false
      this.h_utils.alertUtil.open('命令删除成功', true, 'success')
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

  private async getProducerList() {
    const data = JSON.parse(sessionStorage.systemInfo)
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === this.systemName) {
        this.producer = data[i].name
        return
      }
    }
  }

  created(): void {
    this.getProducerList()
  }
}
</script>
