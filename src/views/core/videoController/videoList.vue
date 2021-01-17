<template>
  <div>
    <v-row>
      <v-col cols="3">
        <v-text-field
          solo
          dense
          placeholder="请输入查找的非结构化主题ID"
          clearable
          append-icon="mdi-magnify"
          @click:append="searchVideoTopic"
          v-model="queryVideoTopicID"
          v-only-num="{
            set: this,
            name: 'userID'
          }"
        >
        </v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn color="primary" height="38" dark @click.stop="createTopicVideo">创建非结构化主题</v-btn>
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
          @PaginationsNow="PaginationsNow"
          :paginationLength="paginationLength"
        >
          <template v-slot:buttons2="{ item }">
            <v-btn small text color="primary" @click.stop="showDateRangePopup(item)">查看视频</v-btn>
            <v-btn
              small
              v-if="tab"
              text
              color="primary"
              class="my-2"
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
    <t-dialog v-if="dialogFlag" v-model="dialogFlag">
      <create-video-topic-dialog v-if="dialogShow === 1" />
      <set-date-range v-else-if="dialogShow === 2" />
    </t-dialog>
    <video-popup :videoCounts="videoCounts" :videoList="videoList" v-if="showVideoPopup" v-model="showVideoPopup" />

    <h-confirm v-if="HConfirmShow" v-model="HConfirmShow" @hconfirm="deleteVideoTopic" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { paramsType } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import HTable from '@/components/h-table.vue'
import HConfirm from '@/components/h-confirm.vue'
import HDialog from '@/components/h-dialog.vue'
import CreateVideoTopicDialog from './childComponent/createVideoTopicDialog.vue'
import SetDateRange from './childComponent/setDateRange.vue'
import VideoPopup from './childComponent/videoPopup.vue'
import { VideoTopicAdd } from '@/type/video-add.type'
import util from '@/decorator/utilsDecorator'
import Enum from '@/decorator/enumDecorator'
import { dataType } from '@/enum/topic-datatype-enum.ts'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum.ts'

import TDialog from '@/components/t-dialog.vue'
import { FormObj } from '@/type/dialog-form.type'

@Component({
  components: {
    HTable,
    HDialog,
    HConfirm,
    CreateVideoTopicDialog,
    VideoPopup,
    SetDateRange,
    TDialog
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
export default class CmdList extends Vue {
  @Provide('formProvide') private formProvide: FormObj = {
    title: '' as string,
    btnName: [] as Array<string>,
    methodName: '' as string,
    formObj: {}
  }

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

  private desserts: Array<any> = [] // 数据列表
  private queryVideoTopicID = '' // 查询主题ID input框内容
  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 20 // 每页展示多少条数据

  // 表头内容 所有主题
  private headers = [
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
      text: '视频流m3u8地址',
      align: 'center',
      value: 'm3u8Url'
    },
    {
      text: '本系统rtmp地址',
      align: 'center',
      value: 'serverUrl'
    },
    {
      text: '摄像头物理地址',
      align: 'center',
      value: 'address'
    },
    {
      text: '摄像头rtsp/rtmp地址',
      align: 'center',
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
  private videoList: Array<string> = []
  private curItem: any
  private videoCounts = 0 // 总共应该显示多少视频

  //  创建主题
  private createTopicVideo() {
    this.dialogFlag = true
    this.dialogShow = 1
    this.formProvide.title = '创建非结构化主题'
    this.formProvide.btnName = ['立即提交']
    this.formProvide.methodName = 'addVideoTopic'
    this.formProvide.formObj = {}
  }
  // 时间选择弹窗
  private showDateRangePopup(item: any) {
    this.curItem = item
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
    const params: any = {}
    // -8小时时差
    // 2020-1-1-0时 ~ 2020-1-1-1时 视频文件数：1，overTime - beginTime=0ms
    params.beginTime = this.h_utils.timeutil.timeToStamp(formObj.startTime, '-') + (formObj.startHour - 8) * 3600 * 1000
    params.overTime = this.h_utils.timeutil.timeToStamp(formObj.endTime, '-') + (formObj.endHour - 8 - 1) * 3600 * 1000
    params.topicId = this.curItem.id
    params.bucketName = this.curItem.bucketName
    console.log(params)
    // 总共显示的视频数
    this.videoCounts = (params.overTime - params.beginTime) / (3600 * 1000) + 1
    // const data = await this.h_request['httpGET']('GET_VIDEO_ADDRESS', params)

    this.videoList = [
      'http://172.51.216.118:9000/topic31/03u8.m3u8?x-OSS-process=hls/type',
      'http://172.51.216.118:9000/topic31/03u8.m3u8?x-OSS-process=hls/type',
      'http://172.51.216.118:9000/topic31/03u8.m3u8?x-OSS-process=hls/type',
      'http://172.51.216.118:9000/topic31/03u8.m3u8?x-OSS-process=hls/type',
      'http://172.51.216.118:9000/topic31/03u8.m3u8?x-OSS-process=hls/type',
      'http://172.51.216.118:9000/topic31/03u8.m3u8?x-OSS-process=hls/type',
      'http://172.51.216.118:9000/topic31/03u8.m3u8?x-OSS-process=hls/type',
      'http://172.51.216.118:9000/topic31/03u8.m3u8?x-OSS-process=hls/type',
      'http://172.51.216.118:9000/topic31/03u8.m3u8?x-OSS-process=hls/type',
      'http://172.51.216.118:9000/topic31/03u8.m3u8?x-OSS-process=hls/type'
      // 'http://172.51.216.118:9000/topic31/03u8.m3u8?x-OSS-process=hls/type'
      // 'http://172.51.216.106:8080/live/push/push.m3u8',
      // 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      // 'http://172.51.216.106:8080/live/test.m3u8',
      // 'http://172.51.216.118:9000/topic31/03u8.m3u8?x-OSS-process=hls/type'
    ]

    this.showVideoPopup = true
    return Promise.resolve(true)
  }

  // 查询通用调用方法
  private async searchMethod(bool: boolean, params: paramsType, tab?: boolean) {
    // 非结构化数据
    params.dataType = dataType['非结构化']

    if (tab) {
      const { data } = bool
        ? await this.h_request['httpGET']<object>('GET_TOPICS_MYTOPICSBYID', params)
        : await this.h_request['httpGET']<object>('GET_TOPICS_MYTOPICS', params)
      data.list &&
        (this.desserts = data.list.map((item: any) => {
          return { ...item, flag: false }
        }))

      this.paginationLength = Math.ceil(data['total'] / this.pageSize) || 1
    } else {
      const { data } = bool
        ? await this.h_request['httpGET']<object>('GET_TOPICS_SELECTTOPIC', params)
        : await this.h_request['httpGET']<object>('GET_TOPICS_FIND_ALL', params)
      data.list &&
        (this.desserts = data.list.map((item: any) => {
          return { ...item, flag: false }
        }))

      this.paginationLength = Math.ceil(data['total'] / this.pageSize) || 1
    }
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
  private PaginationsNow(page: number) {
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
