<template>
  <div id="topicAuditRecords">
    <v-row>
      <HSearch
        v-model="queryTopicID"
        v-only-num
        placeholder="请输入要查询的主题ID"
        @append="searchTopicID"
        @enter="searchTopicID"
        @clear="
          searchMethod(false, {
            pageSize: pageSize,
            pageNum: pageNum,
            status: btnAction
          })
        "
      />
      <v-col>
        <v-btn
          class="mr-6"
          outlined
          :color="btnAction === index ? 'primary' : ''"
          v-for="(item, index) in 3"
          :key="index"
          @click="btnClickMethod(index)"
          >{{ examineType[index] }}</v-btn
        >
      </v-col>
    </v-row>
    <!-- <v-row no-gutters>
      <v-col>
        <v-btn
          class="mr-4 mb-6"
          outlined
          :color="btnAction === index ? 'primary' : ''"
          v-for="(btnName, index) in btnNames"
          :key="index"
          @click="btnClickMethod(index)"
          >{{ btnName }}</v-btn
        >
      </v-col>
    </v-row> -->
    <h-table
      :headers="headers"
      :desserts="desserts"
      :loading="loading"
      :pageNum="pageNum"
      :paginationLength="paginationLength"
    >
      <template v-slot:buttons="{ item }">
        <v-btn text color="primary" :disabled="item.topicInterFaceType === 6" @click="dataStructure(item)"
          >数据结构详情</v-btn
        >
      </template>
      <template v-slot:examineType="{}">
        <v-btn text :color="examineTypeColor[btnAction]">{{ examineType[btnAction] }}</v-btn>
      </template>
    </h-table>

    <t-dialog v-model="dialogFlag">
      <data-structure-dialog :rowObj="rowObj"></data-structure-dialog>
    </t-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { paramsType, returnType } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import { topicTable } from '@/type/topic.type'
import HTable from '@/components/h-table.vue'
import util from '@/decorator/utilsDecorator'
import Enum from '@/decorator/enumDecorator'
import TDialog from '@/components/t-dialog.vue'
import DataStructureDialog from './childComponent/dataStructureDialog.vue'
import { mdiMagnify } from '@mdi/js'
import HSearch from '@/components/h-search.vue'
import { examineType, examineTypeColor } from '@/enum/topic-audit-enum'
import { tableHeaderType } from '@/type/table.type'

@Component({
  components: {
    HTable,
    TDialog,
    DataStructureDialog,
    HSearch
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
export default class TopicAuditRecords extends Vue {
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

  private examineType = examineType
  private examineTypeColor = examineTypeColor
  private mdiMagnify = mdiMagnify
  private desserts: Array<topicTable> = []

  private btnAction = 0
  private rowObj: object = {}
  private pageNum = 1
  private pageSize = 20
  private paginationLength = 0
  private dialogFlag = false
  private queryTopicID = ''
  private loading = true
  private get headers(): Array<tableHeaderType> {
    return [
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
        value: 'belongUserName'
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
        text: '审核时间',
        align: 'center',
        value: 'auditTime',
        isHide: this.btnAction === 0,
        format: (time: number): string => {
          return time ? this.h_utils.timeUtil.stamptoTime(time, '-') : '-'
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
        text: '审核状态',
        align: 'center',
        slot: 'examineType'
      }
    ]
  }

  async searchMethod(bool: boolean, params: paramsType): Promise<void> {
    this.loading = true
    const { data }: returnType = bool
      ? await this.h_request['httpGET']<object>('GET_SUBMODERATIONS_SELECTAUDITSTATUSBYTOPICID', params)
      : await this.h_request['httpGET']<object>('GET_SUB_MODERATIONS_SELECT_AUDIT_STATUS', params)
    this.desserts = data ? [...data.list] : []
    this.paginationLength = Math.ceil(data?.total / this.pageSize) || 1
    this.loading = false
  }

  private dataStructure(item: any) {
    this.dialogFlag = true
    this.rowObj = item
    this.formObj.title = '数据结构详情'
  }

  private btnClickMethod(index: number) {
    this.searchMethod(false, {
      pageSize: this.pageSize,
      pageNum: 1,
      status: index
    })
    this.btnAction = index
    this.pageNum = 1
  }

  private searchTopicID() {
    if (!this.queryTopicID) {
      this.searchMethod(false, {
        pageSize: this.pageSize,
        pageNum: 1,
        status: this.btnAction
      })
    } else {
      this.searchMethod(true, {
        topicId: this.queryTopicID,
        pageSize: this.pageSize,
        pageNum: 1,
        status: this.btnAction
      })
    }
    this.pageNum = 1
  }

  created(): void {
    this.searchMethod(false, {
      pageSize: this.pageSize,
      pageNum: 1,
      status: this.btnAction
    })
    this.pageNum = 1
  }
}
</script>
