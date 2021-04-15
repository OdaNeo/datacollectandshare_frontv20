<template>
  <div id="topicAuditRecords">
    <v-row>
      <HSearch
        v-model="queryTopicID"
        v-only-num
        label="请输入要查询的主题ID"
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
    <h-table
      :headers="headers"
      :desserts="desserts"
      :loading="loading"
      :pageNum="pageNum"
      :paginationLength="paginationLength"
    >
      <!-- 数据结构详情 -->
      <template v-slot:buttons="{ item }">
        <v-btn text color="primary" :disabled="item.topicInterFaceType === 6" @click="dataStructure(item)"
          >数据结构详情</v-btn
        >
      </template>
      <!-- 详情 -->
      <template v-slot:subDetails="{ item }">
        <v-btn text color="primary" @click="showSubDetails(item)">订阅详情</v-btn>
      </template>
      <!-- 详情 -->
      <template v-slot:details="{ item }">
        <v-btn text color="primary" @click="showAllDetails(item)">订阅与审核详情</v-btn>
      </template>
      <!-- 审核状态 -->
      <template v-slot:examineType="{}">
        <v-btn text :color="examineTypeColor[btnAction]">{{ examineType[btnAction] }}</v-btn>
      </template>
    </h-table>

    <t-dialog v-model="dialogFlag">
      <DataStructureDialog v-if="dialogShow === 1" :rowObj="rowObj" />
      <SubDetails v-else-if="dialogShow === 2" :rowObj="rowObj" />
      <AllDetails v-else-if="dialogShow === 3" :rowObj="rowObj" />
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
import SubDetails from './childComponent/subDetails.vue'
import AllDetails from './childComponent/allDetails.vue'
import { mdiMagnify } from '@mdi/js'
import HSearch from '@/components/h-search.vue'
import { examineType, examineTypeColor } from '@/enum/topic-audit-enum'
import { tableHeaderType } from '@/type/table.type'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum'

@Component({
  components: {
    HTable,
    TDialog,
    DataStructureDialog,
    HSearch,
    SubDetails,
    AllDetails
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
/* 接口类型  订阅用户-订阅时间 审核人-审核时间*/
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
  private rowObj: topicTable = {}
  private pageNum = 1
  private pageSize = 20
  private paginationLength = 0
  private dialogFlag = false
  private dialogShow = 0
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
        text: '订阅详情',
        align: 'center',
        slot: 'subDetails',
        isHide: this.btnAction !== 0
      },
      {
        text: '订阅与审核详情',
        align: 'center',
        slot: 'details',
        isHide: this.btnAction === 0
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
      ? await this.h_request['httpGET']<paramsType>('GET_SUBMODERATIONS_SELECTAUDITSTATUSBYTOPICID', params)
      : await this.h_request['httpGET']<paramsType>('GET_SUB_MODERATIONS_SELECT_AUDIT_STATUS', params)
    this.desserts = data ? [...data.list] : []
    this.paginationLength = Math.ceil(data?.total / this.pageSize) || 1
    this.loading = false
  }

  // 数据结构详情
  private dataStructure(item: topicTable) {
    this.rowObj = item
    this.formObj.title = '数据结构详情'
    this.dialogFlag = true
    this.dialogShow = 1
  }

  // 订阅详情
  private showSubDetails(item: topicTable) {
    this.rowObj = item
    this.formObj.title = '订阅详情'
    this.dialogFlag = true
    this.dialogShow = 2
  }

  // 订阅与审核详情
  private showAllDetails(item: topicTable) {
    this.rowObj = item
    this.formObj.title = '订阅与审核详情'
    this.dialogFlag = true
    this.dialogShow = 3
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
