<template>
  <v-row id="createCmdDialog">
    <!-- 弹框 展示数据结 -->
    <v-col cols="9" style="padding: 0">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        height="32"
        class="dialogInput"
        v-model="formProvide.formObj.videoTopicName"
        :rules="[...h_validator.videoTopicNameValidate(), ...topicRepeat]"
        @input="inputEvent(formProvide.formObj.videoTopicName)"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>主题名称：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="9" style="padding: 0">
      <v-text-field 
        single-line 
        outlined 
        clearable 
        dense 
        height="32" 
        class="dialogInput" 
        v-model="formProvide.formObj.dataSource"
        :rules="[...h_validator.videoDataSourceValidate()]"
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>数据源地址：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="9" style="padding: 0">
      <v-text-field 
        single-line 
        outlined 
        clearable 
        dense 
        height="32" 
        class="dialogInput" 
        v-model="formProvide.formObj.cameraPosition"
        :rules="[...h_validator.videoCameraPositionValidate()]"
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>摄像头位置：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import http from '../../../../decorator/httpDecorator'
import validator from '../../../../decorator/validatorDecorator'
import { H_Vue } from '../../../../declaration/vue-prototype'
import alertUtil from '../../../../utils/alertUtil'

@Component
@http
@validator(['videoTopicNameValidate', 'videoDataSourceValidate','videoCameraPositionValidate'])
export default class CreateVideoTopicDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private systemList: Array<{ name: string }> = []
  private topicRepeat: Function[] = []

  private async inputEvent(v: string) {
    // if (v && v != '') {
    //   const { success } = await this.h_request['httpGET']('GET_CMD_CHECKED', {
    //     cmdName: v,
    //   })
    //   if (success) {
    //     this.topicRepeat = [(v: string) => '命令名称已被注册']
    //   } else {
    //     this.topicRepeat = []
    //   }
    // } else {
    //   this.topicRepeat = []
    // }
  }
}
</script>

<style scoped>
.text-label {
  width: 130px;
  display: inline-block;
  text-align: right;
}
.text-label p {
  color: red;
}
.btn-line {
  padding-bottom: 20px;
}
.btn-line .v-btn {
  margin-right: 10px;
}

.checkbox-container {
  width: 400px;
  margin-left: 130px;
  margin-top: -20px;
  margin-right: -10px;
}
.checkbox-item {
  min-width: 70px;
  height: 40px;
}
.text-label-line {
  width: 130px;
  display: inline-block;
  box-sizing: border-box;
  padding-right: 14px;
  font-size: 16px;
  text-align: right;
  color: #000;
}
.text-label-line label {
  font-size: 16px;
}
.require-span {
  color: red;
  margin-right: 4px;
}
.dialogInput .v-input__slot {
  box-shadow: 2px 2px 10px #dddddd !important;
}
</style>
