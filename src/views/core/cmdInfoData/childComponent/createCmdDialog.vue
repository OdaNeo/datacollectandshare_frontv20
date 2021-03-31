<template>
  <v-row no-gutters>
    <HSimpleInput
      v-model="formProvide.formObj['cmdName']"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('命令名称'), ...noRepeat]"
      @input="handleCmdNameNoRepeat"
      :description="`命令名称`"
    />

    <HSimpleInput
      v-model="formProvide.formObj['producer']"
      disabled
      :rules="[...h_validator.noEmpty('生产系统名')]"
      :description="`生产系统名`"
    />

    <HMultiCheckBoxes
      v-model="formProvide.formObj['consumers']"
      :items="systemList"
      :description="`订阅系统名`"
      :rules="[...h_validator.noEmpty('订阅系统名')]"
    />

    <HSimpleInput v-model="formProvide.formObj['description']" :required="false" :description="`描述`" />

    <!-- body示例及弹窗 -->
    <label class="label mr-6">Body示例</label>
    <v-btn color="grey" outlined @click="showConstruction = true">查看</v-btn>
    <v-dialog v-model="showConstruction" width="450">
      <v-card>
        <v-card-title style="font-size: 18px">Body示例</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-5">
          {<br />
          "cmddata": "{/"cmdId/":/"900001/",/"cmdContent/":/"这是一条测试信息/"}"
          <br />}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showConstruction = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HMultiCheckBoxes from '@/components/h-multi-checkboxes.vue'
import HSimpleInput from '@/components/h-simple-input.vue'

@Component({
  components: {
    HMultiCheckBoxes,
    HSimpleInput
  }
})
@http
@Validator(['cmdNameFormatter', 'noEmpty'])
export default class CreateCmdDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private systemList: Array<{ text: string; value: string }> = []
  private noRepeat: string[] = []
  private timer = 0

  private showConstruction = false

  private async getProducerList() {
    let data: Array<{ name: string; id: string }>
    this.systemList.length = 0

    if (sessionStorage.systemInfo) {
      data = JSON.parse(sessionStorage.systemInfo)
    } else {
      const res = await this.h_request['httpGET']('GET_USER_ADDUSER_GET_SYSTEM_INFO_ADD_ADDUSER', {})
      data = res.data
      sessionStorage.systemInfo = JSON.stringify(data)
    }

    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.systemList.push({ text: data[i].name, value: data[i].name })
      }
    }
  }

  // validation cmdName no-repeat
  private handleCmdNameNoRepeat(val: string) {
    if (!val) {
      return
    }
    clearTimeout(this.timer)
    this.timer = setTimeout(async () => {
      const { success } = await this.h_request['httpGET']('GET_CMD_CHECKED', {
        cmdName: val,
        producer: this.formProvide.formObj.producer
      })
      if (success) {
        this.noRepeat = ['命令名称已被注册']
      } else {
        this.noRepeat = []
      }
    }, 150)
  }

  created(): void {
    this.getProducerList()
  }
}
</script>
