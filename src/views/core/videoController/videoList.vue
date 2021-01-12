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
          <template v-slot:dataSourceList>
            <v-btn small text color="primary" @click.stop="showDateRangePopup">输入日期</v-btn>
          </template>
          <template v-slot:buttons2="{ item }">
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
    <h-dialog v-if="dialogFlag" v-model="dialogFlag">
      <create-video-topic-dialog slot="dialog-content" v-if="dialogShow === 1" />
      <set-date-range slot="dialog-content" v-else-if="dialogShow === 2" />
    </h-dialog>
    <video-popup :videoList="videoList" v-if="showVideoPopup" />
    <h-confirm v-if="HConfirmShow" @hcancel="HConfirmShow = false" @hconfirm="deleteVideoTopic" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import HTable from '@/components/h-table.vue'
import HConfirm from '@/components/h-confirm.vue'
import HDialog from '@/components/h-dialog.vue'
import CreateVideoTopicDialog from './childComponent/createVideoTopicDialog.vue'
import SetDateRange from './childComponent/setDateRange.vue'
import VideoPopup from './childComponent/videoPopup.vue'
import { VideoTopicAdd, VideoTimeRange } from '@/type/video-add.type'
import util from '@/decorator/utilsDecorator'

@Component({
  components: {
    HTable,
    HDialog,
    HConfirm,
    CreateVideoTopicDialog,
    VideoPopup,
    SetDateRange
  }
})
@http
@util
export default class CmdList extends Vue {
  @Provide('formProvide') private formObj = new Vue({
    data() {
      return {
        title: '',
        btnName: [] as string[],
        methodName: '',
        formObj: {
          videoTopicName: '', // 视频主题名
          dataSource: '', // 数据源地址
          cameraPosition: '', // 摄像头位置
          startTime: '',
          startHour: 0,
          endTime: '',
          endHour: 0
        }
      }
    }
  })
  private tab = null
  private items = ['所有主题', '我的主题']
  private dialogFlag = false // 弹窗展示
  private dialogShow = 0 // 展示哪个弹窗 1.创建主题 2.日期选择
  private otherObj: any = {} // 描述

  private HConfirmShow = false
  private HConfirmItem = {
    id: ''
  }
  private showVideoPopup = false

  private desserts: Array<any> = [] // 数据列表
  private queryVideoTopicID = '' // 查询主题ID input框内容
  private paginationLength = 0 // 分页数
  private pageNum = 1 // 第几页
  private pageSize = 20 // 每页展示多少条数据
  private headers = [
    // 表头内容 所有主题
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
      text: '数据源地址',
      align: 'center',
      value: 'dataSource'
    },
    {
      text: '摄像头位置',
      align: 'center',
      value: 'cameraPosition'
    },
    {
      text: '数据存储目录',
      align: 'center',
      slot: 'dataSourceList'
    },
    {
      text: '操作',
      align: 'center',
      slot: 'buttons2'
    }
  ]
  private videoList: Array<string> = []
  //  创建主题
  private createTopicVideo() {
    this.dialogFlag = true
    this.dialogShow = 1
    this.formObj.btnName = ['立即提交']
    this.formObj.title = '创建非结构化主题'
    this.formObj.methodName = 'addVideoTopic' // 立即提交
    this.formObj.formObj = {
      videoTopicName: '', // 视频主题名
      dataSource: '', // 数据源地址
      cameraPosition: '', // 摄像头位置
      startTime: '',
      startHour: 0,
      endTime: '',
      endHour: 0
    }
  }

  //  提交创建 非结构化数据
  private async addVideoTopic(formObj: VideoTopicAdd) {
    console.log(formObj)

    const params: any = {}
    //  ADD 不提交id，UPDATE提交id
    // formObj.canNotEdit && (params['id'] = formObj.id)
    // params['cmdName'] = formObj.cmdName
    // params['consumers'] = formObj.consumers.join(',')
    // params['producer'] = formObj.producer
    // params['description'] = formObj.description
    params['dataType'] = 1

    const { success } = await this.h_request['httpPOST'](
      !formObj.canNotEdit ? 'POST_CMD_ADD' : 'POST_CMD_UPDATE',
      params
    )

    if (success) {
      this.h_utils['alertUtil'].open(!formObj.canNotEdit ? '主题创建成功' : '主题修改成功', true, 'success')

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

  // 时间选择弹窗
  private showDateRangePopup() {
    this.dialogFlag = true
    this.dialogShow = 2
    this.formObj.title = '选择日期范围'
    this.formObj.btnName = ['查看视频']
    this.formObj.methodName = 'getVideoList'
    this.formObj.formObj = {
      videoTopicName: '', // 视频主题名
      dataSource: '', // 数据源地址
      cameraPosition: '', // 摄像头位置
      startTime: '',
      startHour: 0,
      endTime: new Date().toISOString().substr(0, 10),
      endHour: 0
    }
  }

  // 获得视频列表
  private getVideoList(formObj: VideoTimeRange) {
    console.log(formObj)
    this.showVideoPopup = true
    this.videoList = [
      'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      'http://172.51.216.106:8080/live/test.m3u8',
      'http://172.51.216.118:9000/topic31/03u8.m3u8?x-OSS-process=hls/type'
    ]
    return Promise.resolve(true)
  }

  // 查询通用调用方法
  private async searchMethod(bool: boolean, params: any, tab?: boolean) {
    // 非结构化数据
    params.dataType = 2
    // const data = {
    //   list: [
    //     {
    //       id: 123123,
    //       topicName: 1231,
    //       userName: 'user2',
    //       dataSource: 'ATS',
    //       cameraPosition: 'Position1',
    //       dataSourceList: [
    //         'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    //         'http://172.51.216.106:8080/live/test.m3u8',
    //         'http://172.51.216.118:9000/topic31/03u8.m3u8?x-OSS-process=hls/type'
    //       ]
    //     }
    //   ],
    //   total: 1
    // }
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
    if (this.HConfirmItem.id === undefined) {
      return
    }
    // const { success } = await this.h_request["httpGET"]("GET_CMD_DELETE", {
    //   id: this.HConfirmItem.id,
    // });
    // if (success) {
    //   this.HConfirmShow = false;
    //   this.h_utils["alertUtil"].open("主题删除成功", true, "success");
    //   this.searchMethod(
    //     false,
    //     {
    //       pageSize: this.pageSize,
    //       pageNum: 1,
    //     },
    //     true
    //   );
    //   this.pageNum=1
    // }
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
