<template>
  <div id="topicSub">
    <v-row>
      <transition name="fade" mode="out-in">
        <HSearch
          v-if="searchMode === `id`"
          v-model="queryTopicID"
          :label="`请输入主题ID`"
          @append="searchTopic"
          @enter="searchTopic"
          @clear="tabChange(tab)"
          v-only-num
          key="id"
        />

        <HSearch
          v-else-if="searchMode === `topicName`"
          v-model="queryTopicID"
          :label="`请输入主题名称`"
          @append="searchTopic"
          @enter="searchTopic"
          @clear="tabChange(tab)"
          key="topicName"
        />
      </transition>
      <v-switch
        style="padding-top: 2px; width: 180px"
        class="ml-6"
        dense
        v-model="switchMode"
        flat
        :label="switchMode ? `按照主题ID查询` : `按照主题名称查询`"
        @change="changeSearchMode"
      ></v-switch>
    </v-row>
    <!-- tab -->
    <HTabs v-model="tab" :items="items" @change="tabChange" />
    <!-- <v-tabs v-model="tab" @change="tabChange">
      <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
    </v-tabs> -->
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
          <!-- 订阅用户 -->
          <template v-slot:subUsers="{ item }">
            <v-btn
              :disabled="item.userSubNameList.length === 0"
              text
              color="primary"
              @click="showUserSubNameList(item)"
              >{{ item.userSubNameList.length }}</v-btn
            >
          </template>
          <!-- 数据结构详情 -->
          <template v-slot:buttons="{ item }">
            <v-btn text color="primary" @click="dataStructure(item)">数据结构详情</v-btn>
          </template>
          <!-- 订阅 -->
          <template v-slot:operation="{ item }">
            <v-btn text v-if="!item.status" color="primary" :loading="!!item.subloading" @click="subscribe(item)"
              >订阅</v-btn
            >
            <v-btn text v-if="item.status" :loading="!!item.subloading" color="warning" @click="cancelScribe(item)"
              >取消订阅</v-btn
            >
          </template>
          <!-- 订阅状态 -->
          <template v-slot:subStatus="{ item }">
            <v-btn text :color="examineTypeColor[item.subStatus]" class="my-2">{{ examineType[item.subStatus] }}</v-btn>
          </template>
        </h-table>
      </v-tab-item>
    </v-tabs-items>
    <t-dialog v-if="dialogFlag" v-model="dialogFlag">
      <DataStructureDialog :rowObj="rowObj" v-if="tDialogShow === 1" />
      <UserSubNameList :rowObj="rowObj" v-else-if="tDialogShow === 2" />
      <HContentDetails :row="str" v-else-if="tDialogShow === 3" />
    </t-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { returnType, returnTypeData } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import { topicTable } from '@/type/topic.type'
import HTable from '@/components/h-table.vue'
import TDialog from '@/components/t-dialog.vue'
import DataStructureDialog from './childComponent/dataStructureDialog.vue'
import UserSubNameList from './childComponent/userSubNameList.vue'
import { mdiMagnify } from '@mdi/js'
import { tableHeaderType } from '@/type/table.type'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum'
import HSearch from '@/components/h-search.vue'
import HTabs from '@/components/h-tabs.vue'
import HContentDetails from '@/components/h-content-details.vue'
import { queneType } from '@/enum/topic-list-enum'
import { examineType, examineTypeColor } from '@/enum/topic-audit-enum'
// topicInterFaceType = 1，4，6
@Component({
  components: {
    HTable,
    TDialog,
    DataStructureDialog,
    HSearch,
    UserSubNameList,
    HTabs,
    HContentDetails
  }
})
@http
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

  private queneType = queneType
  private examineType = examineType
  private examineTypeColor = examineTypeColor
  private mdiMagnify = mdiMagnify
  private tab = null
  private items = ['可订阅主题', '我的订阅']

  private desserts: Array<topicTable> = []
  private rowObj: object = {}
  private str: string | undefined = ''
  private pageNum = 1
  private pageSize = 20
  private paginationLength = 0
  private dialogFlag = false
  private tDialogShow = 0
  private queryTopicID = ''
  private loading = true

  // 搜索方法，默认搜索id
  private searchMode: `id` | `topicName` = `id`
  // 切换开关
  private switchMode = true

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
        text: '订阅用户数',
        align: 'center',
        slot: 'subUsers',
        isHide: !!this.tab
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
        format: (quene: number): string => {
          return queneType[quene]
        }
      },
      {
        text: '显示详情',
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

  // 改变用户
  private changeSearchMode() {
    this.searchMode === `id` ? (this.searchMode = `topicName`) : (this.searchMode = `id`)
  }

  // 统一请求方法
  private async searchMethod(bool: boolean, params: object, tab?: boolean): Promise<void> {
    this.loading = true
    let _data: returnTypeData

    if (tab) {
      const { data }: returnType = bool
        ? await this.h_request['httpGET']<object>('GET_SUBMODERATIONS_SELECTMYSUBTOPICBYTOPICIDORNAME', params)
        : await this.h_request['httpGET']<object>('GET_SUBMODERATIONS_SELECTMYSUBTOPICLIST', params)
      _data = data ? { ...data } : undefined
    } else {
      const { data }: returnType = bool
        ? await this.h_request['httpGET']<object>('GET_TOPICS_SELECTSUBTOPICBYIDORNAME', params)
        : await this.h_request['httpGET']<object>('GET_TOPICS_FINDALLSUBTOPIC', params)
      _data = data ? { ...data } : undefined
    }

    this.desserts = _data ? [..._data.list] : []
    this.paginationLength = Math.ceil(_data?.total / this.pageSize) || 1
    this.loading = false
  }

  // 数据结构展示方法
  private dataStructure(item: topicTable) {
    this.dialogFlag = true
    this.formObj.title = '数据结构详情'
    // protobuf
    if (item.topicInterFaceType === 6) {
      this.tDialogShow = 3
      this.str = item.dataStruct
    } else {
      // rest
      this.tDialogShow = 1
      this.rowObj = item
    }
  }

  // 订阅用户详情
  private showUserSubNameList(item: topicTable) {
    this.rowObj = item
    this.dialogFlag = true
    this.tDialogShow = 2
    this.formObj.title = '订阅用户详情'
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
          id: this.searchMode === `id` ? this.queryTopicID : '',
          topicName: this.searchMode === `topicName` ? this.queryTopicID : '',
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

  // 分页
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
<style>
/* fade-transform */
.fade-leave-active,
.fade-enter-active {
  transition: all 0.5s;
}

.fade-enter {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
