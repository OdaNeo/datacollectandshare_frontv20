<template>
  <div id="topicSub">
    <v-row>
      <HSearch
        v-model="queryTopicID"
        placeholder="请输入查找的主题ID"
        @append="searchTopic"
        @enter="searchTopic"
        @clear="tabChange(tab)"
        v-only-num
      />
    </v-row>
    <v-tabs v-model="tab" @change="tabChange">
      <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item">
        <h-table
          :headers="headers"
          :desserts="desserts"
          :loading="loading"
          :pageNum="pageNum"
          @PaginationNow="PaginationNow"
          :paginationLength="paginationLength"
        >
          <template v-slot:buttons="{ item }">
            <v-btn
              text
              color="primary"
              :disabled="item.topicInterFaceType === 6"
              class="my-2"
              @click="dataStructure(item)"
              >数据结构详情</v-btn
            >
          </template>
          <template v-slot:operation="{ item }">
            <v-btn
              text
              v-if="!item.status"
              color="primary"
              :loading="!!item.subloading"
              class="my-2"
              @click="subscribe(item)"
              >订阅</v-btn
            >
            <v-btn
              text
              v-if="item.status"
              :loading="!!item.subloading"
              color="warning"
              class="my-2"
              @click="cancelScribe(item)"
              >取消订阅</v-btn
            >
          </template>
          <!-- 订阅状态 -->
          <template v-slot:subStatus="{ item }">
            <v-btn text :color="h_enum['examineTypeColor'][item.subStatus]" class="my-2">{{
              h_enum['examineType'][item.subStatus]
            }}</v-btn>
          </template>
        </h-table>
      </v-tab-item>
    </v-tabs-items>
    <t-dialog v-model="dialogFlag">
      <data-structure-dialog :rowObj="rowObj"></data-structure-dialog>
    </t-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { returnType, returnTypeData } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import { topicTable } from '@/type/topic.type'
import HTable from '@/components/h-table.vue'
import Enum from '@/decorator/enumDecorator'
import TDialog from '@/components/t-dialog.vue'
import DataStructureDialog from './childComponent/dataStructureDialog.vue'
import { mdiMagnify } from '@mdi/js'
import { tableHeaderType } from '@/type/table.type'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum'
import HSearch from '@/components/h-search.vue'
// topicInterFaceType = 1，4，6
@Component({
  components: {
    HTable,
    TDialog,
    DataStructureDialog,
    HSearch
  }
})
@http
@Enum([
  {
    tsFileName: 'topic-list-enum',
    enumName: 'queneType'
  },
  {
    tsFileName: 'topic-audit-enum',
    enumName: 'examineType'
  },
  {
    tsFileName: 'topic-audit-enum',
    enumName: 'examineTypeColor'
  }
])
export default class TopicSub extends Vue {
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
  private mdiMagnify = mdiMagnify
  private tab = null
  private items = ['可订阅主题', '我的订阅']

  private desserts: Array<topicTable> = []
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
        value: 'userName',
        isHide: !!this.tab
      },
      {
        text: '所属用户',
        align: 'center',
        value: 'belongUserName',
        isHide: !this.tab
      },
      {
        text: '订阅用户',
        align: 'center',
        value: 'userSubNameList',
        isHide: !!this.tab,
        format: (userSubNameList: Array<string>): string => {
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
        text: '订阅状态',
        align: 'center',
        slot: 'subStatus',
        isHide: !this.tab
      },
      {
        text: '操作',
        align: 'center',
        slot: 'operation',
        isHide: !!this.tab
      }
    ]
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

  private async searchMethod(bool: boolean, params: object, tab?: boolean): Promise<void> {
    this.loading = true
    let _data: returnTypeData

    if (tab) {
      const { data }: returnType = bool
        ? await this.h_request['httpGET']<object>('GET_SUBMODERATIONS_SELECTMYSUBTOPICBYTOPICID', params)
        : await this.h_request['httpGET']<object>('GET_SUBMODERATIONS_SELECTMYSUBTOPICLIST', params)
      _data = data ? { ...data } : undefined
    } else {
      const { data }: returnType = bool
        ? await this.h_request['httpGET']<object>('GET_TOPICS_SELECTSUBTOPICBYID', params)
        : await this.h_request['httpGET']<object>('GET_TOPICS_FINDALLSUBTOPIC', params)
      _data = data ? { ...data } : undefined
    }

    this.desserts = _data ? [..._data.list] : []
    this.paginationLength = Math.ceil(_data?.total / this.pageSize) || 1
    this.loading = false
  }

  private dataStructure(item: any) {
    this.dialogFlag = true
    this.rowObj = item
    this.formObj.title = '数据结构详情'
  }

  private searchTopic() {
    if (!this.queryTopicID) {
      this.searchMethod(
        false,
        {
          pageSize: this.pageSize,
          pageNum: 1
        },
        !!this.tab
      )
    } else {
      this.searchMethod(
        true,
        {
          id: this.queryTopicID,
          pageNum: 1,
          pageSize: this.pageSize
        },
        !!this.tab
      )
    }
    this.pageNum = 1
  }
  // <!-- 订阅按钮乐观更新 -->
  private async subscribe(item: { id: string }) {
    this.$set(item, 'subloading', true)

    const { success } = await this.h_request['httpPOST']('POST_SUBMODERATIONS_INSERTSUBMODERATION', {
      topicId: item.id
    })
    if (success) {
      this.$set(item, 'status', true)
    }

    this.$set(item, 'subloading', false)
  }

  // <!-- 取消订阅按钮乐观更新 -->
  private async cancelScribe(item: { id: string; userID: string }) {
    this.$set(item, 'subloading', true)

    const { success } = await this.h_request['httpPOST']('POST_TOPICS_DELSUBUSER', {
      topicID: item.id,
      subUserID: item.userID
    })
    if (success) {
      this.$set(item, 'status', false)
    }

    this.$set(item, 'subloading', false)
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
}
</script>
