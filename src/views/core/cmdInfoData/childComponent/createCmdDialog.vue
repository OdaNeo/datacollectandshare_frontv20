<template>
  <v-row no-gutters>
    <!-- <v-col cols="11">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput"
        v-model="formProvide.formObj.cmdName"
        :rules="[...h_validator.cmdNameValidate(), ...cmdRepeat]"
        :disabled="formProvide.formObj.canNotEdit"
        @input="inputEvent(formProvide.formObj.cmdName, formProvide.formObj.producer)"
        required
      >
        <template v-slot:prepend>
          <label class="text-label"><span class="require-span">*</span>命令名称：</label>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="11">
      <v-text-field class="dialogInput" single-line outlined dense solo v-model="formProvide.formObj.producer" disabled>
        <template v-slot:prepend>
          <label class="text-label"><span class="require-span">*</span>生产系统名：</label>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="11">
      <v-radio-group row>
        <template v-slot:prepend>
          <label class="text-label"><span class="require-span">*</span>订阅系统名：</label>
        </template>
      </v-radio-group>
      <v-row class="checkbox-container" justify="start">
        <v-checkbox
          required
          v-model="formProvide.formObj.consumers"
          :rules="[...h_validator.cmdConsumersValidate()]"
          v-for="item in systemList"
          :key="item.id"
          class="mx-2 checkbox-item"
          :label="item.name"
          :value="item.name"
        >
        </v-checkbox>
      </v-row>
    </v-col>
    <v-col cols="11">
      <v-text-field
        class="dialogInput"
        solo
        single-line
        outlined
        clearable
        dense
        v-model="formProvide.formObj.description"
      >
        <template v-slot:prepend>
          <label class="text-label">描述：</label>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="11">
      <v-radio-group row>
        <template v-slot:prepend>
          <label class="text-label"><span class="require-span"></span>Body示例：</label>
        </template>
        <v-btn solo @click.native="showConstruction = true">查看</v-btn>
      </v-radio-group>
    </v-col> -->

    <h-input v-for="item in formTypeObj" :key="item.id" :formTypeItem="item" />
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
import HInput from '@/components/h-input.vue'
import { InputType } from '@/type/dialog-form.type'
import Validator from '@/decorator/validatorDecorator'

@Component({
  components: {
    HInput
  }
})
@http
@Validator(['cmdNameFormatter'])
export default class CreateCmdDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private systemList: Array<{ text: string; value: string }> = []

  private formTypeObj: Array<InputType> = [
    {
      label: '命令名称',
      valueName: 'cmdName',
      type: 'input',
      require: true,
      disabled: !!this.formProvide.formObj.cmdName,
      otherRules: this.h_validator.cmdNameFormatter()
    },
    {
      label: '生产系统名',
      valueName: 'producer',
      type: 'input',
      require: true,
      disabled: !!this.formProvide.formObj.producer
    },
    {
      label: '订阅系统名',
      valueName: 'consumers',
      type: 'select',
      multiple: true,
      items: this.systemList,
      require: true
    },
    {
      label: '描述',
      valueName: 'description',
      type: 'input',
      require: false
    }
  ]

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
    for (let i = 0; i < data.length; i++) {
      this.systemList.push({ text: data[i].name, value: data[i].name })
    }
  }

  created(): void {
    this.getProducerList()
  }
}
</script>
