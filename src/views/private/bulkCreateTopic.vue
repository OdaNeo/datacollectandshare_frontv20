<template>
  <div>
    <div class="mt-6">First To the Egg: {{ BRANCH }}</div>
    <div class="mt-6">First To the Key: {{ COMMITHASH }}</div>
    <v-btn class="mt-6" color="primary" height="35px" width="95px" small dark @click.stop="createTopicVideo"
      >批量创建视频</v-btn
    >
    <f-dialog v-if="dialogFlag" v-model="dialogFlag">
      <v-row no-gutters>
        <!-- 主题名称母版 -->
        <v-col cols="12" class="d-flex">
          <label class="label mr-2"><span class="require-span">*</span>主题名称母版</label>
          <v-text-field
            v-model="formProvide.formObj['topicNameItem']"
            outlined
            dense
            clearable
            height="34"
            class="ml-4 mr-15"
            :rules="[v => !!v || `主题名称母版不能为空`]"
          ></v-text-field>
        </v-col>
        <!-- rtsp/rtmp地址 -->
        <v-col cols="12" class="d-flex">
          <label class="label mr-2">rtsp/rtmp地址</label>
          <v-text-field
            v-model="formProvide.formObj['sourceUrl']"
            outlined
            dense
            clearable
            height="34"
            class="ml-4 mr-15"
          ></v-text-field>
        </v-col>
        <!-- 批量创建数量 -->
        <v-col cols="12" class="d-flex">
          <label class="label mr-2"><span class="require-span">*</span>批量创建数量</label>
          <v-text-field
            v-model="formProvide.formObj['number']"
            outlined
            dense
            clearable
            height="34"
            class="ml-4 mr-15"
            :rules="[v => !!(typeof Number(v) === 'number' && !isNaN(v)) || '请输入数字']"
          ></v-text-field>
        </v-col>
      </v-row>
    </f-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import FDialog from '@/components/f-dialog.vue'
import { FormObj } from '@/type/dialog-form.type'
import { topicInterFaceType } from '@/enum/topic-interfacetype-enum.ts'
import { dataType } from '@/enum/topic-datatype-enum.ts'

@Component({
  components: {
    FDialog
  }
})
@http
export default class bulkCreateTopic extends Vue {
  @Provide('formProvide') private formProvide: FormObj = {
    title: '' as string,
    btnName: [] as Array<string>,
    methodName: '' as string,
    formObj: {}
  }
  private count = 0
  private COMMITHASH = process.env.COMMITHASH
  private BRANCH = process.env.BRANCH

  private dialogFlag = false // 弹窗展示
  //  创建主题
  private createTopicVideo() {
    this.dialogFlag = true
    this.formProvide.title = '创建非结构化主题'
    this.formProvide.btnName = ['立即提交', '取消']
    this.formProvide.methodName = 'bulkAddVideoTopic'
    this.formProvide.formObj = {}
  }

  //  提交创建 非结构化数据
  private async bulkAddVideoTopic(formObj: any) {
    this.count = 0
    const params: any = {}

    for (let i = 0; i < formObj.number; i++) {
      params['topicName'] = formObj.topicNameItem + '_' + i
      params['address'] = '海鹰路海鹰路海鹰路海鹰路'
      params['sourceUrl'] = formObj.sourceUrl || 'rtmp://58.200.131.2:1935/livetv/cctv8'
      params['topicInterFaceType'] = topicInterFaceType['VIDEO']
      params['dataType'] = dataType['非结构化']
      const { success } = await this.h_request['httpPOST']('POST_TOPICS_ADD', params)
      if (success) {
        this.count++
      }
    }
    alert(this.count)
    this.count = 0
  }
}
</script>
