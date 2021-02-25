<template>
  <div id="topicSubExamine">
    <v-row>
      <v-col cols="3">
        <v-text-field
          solo
          dense
          height="35px"
          placeholder="请输入要查询的订阅用户名"
          clearable
          append-icon="mdi-magnify"
          @click:append="searchExamine"
          @click:clear="
            searchMethod(true, {
              pageSize: pageSize,
              pageNum: pageNum
            })
          "
          v-model.trim="queryExamineUser"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <h-table
      :headers="headers"
      :desserts="desserts"
      :loading="loading"
      :pageNum="pageNum"
      :paginationLength="paginationLength"
    >
      <template v-slot:buttons="{ item }">
        <v-btn text color="primary" @click="dataStructure(item)">数据结构详情</v-btn>
      </template>
      <template v-slot:operation="{ item }">
        <v-btn text color="success" @click="examine(item, 1)">审核通过</v-btn>
        <v-btn text color="warning" @click="examine(item, 2)">审核拒绝</v-btn>
      </template>
    </h-table>

    <t-dialog v-if="dialogFlag" v-model="dialogFlag">
      <data-structure-dialog :rowObj="rowObj"></data-structure-dialog>
    </t-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { paramsType, returnDataType } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import { topicTable } from '@/type/topic.type'
import HTable from '@/components/h-table.vue'
import util from '@/decorator/utilsDecorator'
import Enum from '@/decorator/enumDecorator'
import TDialog from '@/components/t-dialog.vue'
import DataStructureDialog from './childComponent/dataStructureDialog.vue'
@Component({
  components: {
    HTable,
    TDialog,
    DataStructureDialog
  }
})
@http
@util
@Enum([
  {
    tsFileName: 'topic-list-enum',
    enumName: 'queneType'
  }
])
export default class TopicSubExamine extends Vue {
  @Provide('formProvide') private formObj = new Vue({
    data() {
      return {
        title: '',
        btnName: [] as string[],
        methodName: '',
        formObj: {}
      }
    }
  })

  private desserts: Array<topicTable> = []
  private rowObj: object = {}
  private pageNum = 1
  private pageSize = 20
  private dialogFlag = false
  private paginationLength = 0
  private loading = true
  private queryExamineUser = ''
  private headers = [
    {
      text: '主题名称',
      align: 'center',
      value: 'topicName'
    },
    {
      text: '所属用户',
      align: 'center',
      value: 'belongUserName'
    },
    {
      text: '订阅用户',
      align: 'center',
      value: 'userName'
    },
    {
      text: '订阅时间',
      align: 'center',
      value: 'subscribe',
      format: (time: number): string => {
        return this.h_utils.timeUtil.stamptoTime(time, '-')
      }
    },
    {
      text: '消息类型',
      align: 'center',
      value: 'queneType',
      format: (quene: number): number => {
        return this.h_enum['queneType'][quene]
      }
    },
    {
      text: '数据结构',
      align: 'center',
      slot: 'buttons'
    },
    {
      text: '操作',
      align: 'center',
      slot: 'operation'
    }
  ]

  async searchMethod(bool: boolean, params: paramsType): Promise<void> {
    this.loading = true
    const { data }: returnDataType = bool
      ? await this.h_request['httpGET']<object>('GET_SUBMODERATIONS_SELECTBYUSERNAMESTATUS', params)
      : await this.h_request['httpGET']<object>('GET_SUB_MODERATIONS_SELECT_STATUS', params)
    this.paginationLength = Math.ceil(data['total'] / this.pageSize) || 1
    this.desserts = data['list']
    this.loading = false
  }

  private dataStructure(item: any) {
    this.dialogFlag = true
    this.rowObj = item
    this.formObj.title = '数据结构详情'
  }

  private async examine(item: any, status: number) {
    const { success } = await this.h_request['httpPOST']('POST_SUBMODERATIONS_UPDATESUBMODERATION', {
      status: status,
      subUserId: item.subUserId,
      topicId: item.id
    })

    if (success) {
      this.h_utils['alertUtil'].open(
        status === 1 ? '主题已审核通过' : '主题已审核拒绝',
        true,
        status === 1 ? 'success' : 'error'
      )

      this.searchMethod(false, {
        pageSize: this.pageSize,
        pageNum: 1
      })
      this.pageNum = 1
      this.queryExamineUser = ''
    }
  }

  private searchExamine() {
    if (!this.queryExamineUser) {
      this.searchMethod(false, {
        pageSize: this.pageSize,
        pageNum: 1
      })
    } else {
      this.searchMethod(true, {
        userName: this.queryExamineUser,
        pageSize: this.pageSize,
        pageNum: 1
      })
    }
    this.pageNum = 1
  }

  created(): void {
    this.searchMethod(true, {
      pageSize: this.pageSize,
      pageNum: 1
    })
    this.pageNum = 1
  }
}
</script>
