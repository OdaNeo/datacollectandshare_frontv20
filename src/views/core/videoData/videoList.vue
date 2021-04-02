<template>
  <div>
    <v-row>
      <HSearch
        v-model="queryVideoTopicID"
        v-only-num
        placeholder="请输入查找的视频主题ID"
        @append="searchVideoTopic"
        @enter="searchVideoTopic"
        @clear="tabChange(tab)"
      />
      <v-col>
        <v-btn color="primary" depressed dark small @click.stop="createTopicVideo">创建视频主题</v-btn>
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
          <template v-slot:buttons2="{ item }">
            <v-btn text color="primary" @click.stop="showDateRangePopup(item)">查看视频</v-btn>
            <v-btn
              v-if="tab"
              text
              color="primary"
              @click="
                HConfirmShow = true
                HConfirmItem = item
              "
              >删除
            </v-btn>
          </template>
        </h-table>
      </v-tab-item>
    </v-tabs-items>
    <!-- 表单 -->
    <f-dialog v-if="dialogFlag" v-model="dialogFlag" :loading="dialogLoading">
      <create-video-topic-dialog v-if="dialogShow === 1" />
      <set-date-range v-else-if="dialogShow === 2" />
    </f-dialog>

    <!-- 视频 -->
    <video-popup
      :videoList="videoList"
      :videoCountsReal="videoCountsReal"
      v-if="showVideoPopup"
      v-model="showVideoPopup"
    />

    <h-confirm v-model="HConfirmShow" @hconfirm="deleteVideoTopic" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { paramsType, returnTypeData } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import HTable from '@/components/h-table.vue'
import HConfirm from '@/components/h-confirm.vue'
import CreateVideoTopicDialog from './childComponent/createVideoTopicDialog.vue'
import SetDateRange from './childComponent/setDateRange.vue'
import VideoPopup from './childComponent/videoPopup.vue'
import { VideoTopicAdd } from '@/type/video-add.type'
import util from '@/decorator/utilsDecorator'
import Enum from '@/decorator/enumDecorator'
import { dataType } from '@/enum/topic-datatype-enum'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum'
import FDialog from '@/components/f-dialog.vue'
import { FormObj } from '@/type/dialog-form.type'
import { topicTable } from '@/type/topic.type'
import { tableHeaderType } from '@/type/table.type'
import { mdiMagnify } from '@mdi/js'
import HSearch from '@/components/h-search.vue'

@Component({
  components: {
    HTable,
    HConfirm,
    CreateVideoTopicDialog,
    VideoPopup,
    SetDateRange,
    FDialog,
    HSearch
  }
})
@http
@util
@Enum([
  {
    tsFileName: 'topic-datatype-enum',
    enumName: 'dataType'
  }
])
export default class VideoDataList extends Vue {
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
  private dialogFlag = false // 弹窗展示
  private dialogShow = 0 // 展示哪个弹窗 1.创建主题 2.日期选择
  // 删除确认
  private HConfirmShow = false
  private HConfirmItem = {
    id: '',
    topicName: '',
    topicInterFaceType: 0
  }
  private showVideoPopup = false

  private desserts: Array<topicTable> = [] // 数据列表
  private queryVideoTopicID = '' // 查询主题ID input框内容
  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 20 // 每页展示多少条数据
  private loading = true
  private dialogLoading = false

  // 表头内容 所有主题
  private headers: tableHeaderType[] = [
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
    // {
    //   text: '视频流m3u8地址',
    //   align: 'center',
    //   value: 'm3u8Url'
    // },
    {
      text: '本系统rtmp地址',
      align: 'center',
      width: 200,
      value: 'serverUrl'
    },
    {
      text: '摄像头物理地址',
      align: 'center',
      width: 200,
      value: 'address'
    },
    {
      text: '摄像头rtsp/rtmp地址',
      align: 'center',
      width: 200,
      value: 'sourceUrl'
    },
    {
      text: 'minio桶名称',
      align: 'center',
      value: 'bucketName'
    },
    {
      text: '操作',
      align: 'center',
      slot: 'buttons2'
    }
  ]
  // 查询到视频数量（不包含空视频）
  private videoList: Array<{ timer: string; url: string }> = []

  private curItem: any

  // private videoCounts = 0 // 总共应该显示多少视频
  private videoCountsReal = 0 // 实际视频数量
  //  创建主题
  private createTopicVideo() {
    this.dialogFlag = true
    this.dialogShow = 1
    this.formProvide.title = '创建视频主题'
    this.formProvide.btnName = ['立即提交']
    this.formProvide.methodName = 'addVideoTopic'
    this.formProvide.formObj = {}
  }
  // 时间选择弹窗
  private showDateRangePopup(item: any) {
    this.curItem = item
    this.dialogLoading = false
    this.dialogFlag = true
    this.dialogShow = 2
    this.formProvide.title = '选择日期范围'
    this.formProvide.btnName = ['查看视频']
    this.formProvide.methodName = 'getVideoList'
    this.formProvide.formObj = {
      startHour: 0,
      endHour: 1
    }
  }

  //  提交创建 非结构化数据
  private async addVideoTopic(formObj: VideoTopicAdd) {
    const params: any = {}

    params['topicName'] = formObj.topicName
    params['address'] = formObj.address
    params['sourceUrl'] = formObj.sourceUrl
    params['topicInterFaceType'] = topicInterFaceType['VIDEO']
    params['dataType'] = dataType['非结构化']

    const { success } = await this.h_request['httpPOST']('POST_TOPICS_ADD', params)
    if (success) {
      this.h_utils['alertUtil'].open('主题创建成功', true, 'success')
      this.searchMethod(
        false,
        {
          pageSize: this.pageSize,
          pageNum: 1
        },
        !!this.tab
      )
      this.pageNum = 1
      return Promise.resolve(true)
    }
  }

  // 获得视频列表
  private async getVideoList(formObj: any) {
    this.videoList = []
    this.videoCountsReal = 0
    this.dialogLoading = true
    const params: any = {}
    // -8小时时差
    // 2020-1-1-0时 ~ 2020-1-1-1时 视频文件数：1，overTime - beginTime=0ms
    params.beginTime = this.h_utils.timeUtil.timeToStamp(formObj.startTime, '-') + (formObj.startHour - 8) * 3600 * 1000
    params.overTime = this.h_utils.timeUtil.timeToStamp(formObj.endTime, '-') + (formObj.endHour - 8 - 1) * 3600 * 1000
    params.topicId = this.curItem.id
    params.bucketName = this.curItem.bucketName
    // 总共显示的视频数
    // this.videoCounts = ((params.overTime - params.beginTime) / (3600 * 1000) + 1) * 3
    const { data } = await this.h_request['httpGET']('GET_VIDEO_ADDRESS', params)
    // console.log(data)
    // const data = [
    //   { timer: '2021-01-01 02', url: [] },
    //   { timer: '2021-01-01 03', url: ['1', '', '3'] },
    //   { timer: '2021-01-01 04', url: [] }
    // ]
    data.forEach((item: { timer: string; url: Array<string> }) => {
      if (item.url.length === 0) {
        return
      } else {
        item.url.forEach((_item, _index) => {
          if (_item) {
            this.videoList.push({ timer: item.timer + '时' + '-' + (_index + 1), url: item.url[_index] })
            this.videoCountsReal++
          }
        })
      }
      // else {
      //   this.videoList.push({ timer: item.timer + '时', url: '' })
      // }
    })
    // console.log(this.videoList)
    this.dialogLoading = false
    // 有视频，才弹出视频弹窗
    if (this.videoList.length > 0) {
      this.showVideoPopup = true
      return Promise.resolve(true)
    } else {
      this.h_utils['alertUtil'].open('该时间段视频不存在', true, 'error', 3000)
      return Promise.resolve(false)
    }
  }

  // 查询通用调用方法
  private async searchMethod(bool: boolean, params: paramsType, tab?: boolean) {
    this.loading = true
    let _data: returnTypeData
    // 非结构化数据
    params.dataType = dataType['非结构化']
    params.faceTypes = topicInterFaceType['VIDEO']

    if (tab) {
      const { data } = bool
        ? await this.h_request['httpGET']<object>('GET_TOPICS_MYTOPICSBYID', params)
        : await this.h_request['httpGET']<object>('GET_TOPICS_MYTOPICS', params)

      _data = data ? { ...data } : undefined
    } else {
      const { data } = bool
        ? await this.h_request['httpGET']<object>('GET_TOPICS_SELECTTOPIC', params)
        : await this.h_request['httpGET']<object>('GET_TOPICS_FIND_ALL', params)
      _data = data ? { ...data } : undefined
    }
    this.desserts = _data ? [..._data.list] : []
    this.paginationLength = Math.ceil(_data?.total / this.pageSize) || 1
    this.loading = false
  }

  // 非结构化主题查询
  private searchVideoTopic() {
    if (!this.queryVideoTopicID) {
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
          pageNum: 1,
          pageSize: this.pageSize,
          topicID: this.queryVideoTopicID
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

  // 删除主题
  private async deleteVideoTopic() {
    if (!this.HConfirmItem.id) {
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
