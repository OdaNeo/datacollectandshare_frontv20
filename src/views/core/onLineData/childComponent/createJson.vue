<template>
  <v-row no-gutters>
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>主题名称</label>
      <v-text-field
        v-model="formProvide.formObj['topicName']"
        :disabled="formProvide.formObj.canNotEdit"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter(), ...noRepeat]"
        class="ml-4 mr-15"
        v-topicNameNoRepeat="{
          set: n => {
            noRepeat = [...n]
          }
        }"
      ></v-text-field>
    </v-col>
    <!-- 消息类型 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>消息类型</label>
      <v-radio-group
        v-model="formProvide.formObj['queneType']"
        :disabled="formProvide.formObj.canNotEdit"
        row
        dense
        height="34"
        :rules="[...h_validator.noEmpty('消息类型')]"
        class="ml-4 my-0 pt-0 flex-grow-1"
      >
        <v-radio v-for="n in queneTypeItem" :key="n.value" :label="`${n.text}`" :value="n.value"></v-radio>
      </v-radio-group>
    </v-col>
    <!-- 内存过期时间 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2">内存过期时间</label>
      <v-slider
        v-model="formProvide.formObj['redisTimer']"
        :disabled="formProvide.formObj.canNotEdit"
        class="align-center ml-4 mb-4 mr-15"
        :max="30"
        :min="5"
        hide-details
        :thumb-size="20"
        thumb-label="always"
        ><template v-slot:append>
          <v-text-field
            v-model="formProvide.formObj['redisTimer']"
            class="mt-0 pt-0"
            hide-details
            dense
            disabled
            single-line
            style="width: 30px"
          ></v-text-field>
        </template>
      </v-slider>
    </v-col>
    <!-- 数据结构 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>数据结构</label>
      <v-textarea
        v-model="formProvide.formObj['dataStructSchema']"
        outlined
        auto-grow
        rows="3"
        :disabled="formProvide.formObj.canNotEdit"
        :rules="[...h_validator.noEmpty('数据结构'), ...h_validator.isJSON()]"
        class="ml-4 mr-15"
      ></v-textarea>
    </v-col>
    <!--  -->
    <v-col cols="12" class="d-flex mb-6">
      <label class="label mr-6">数据发送示例</label>
      <v-btn color="grey" outlined @click="showConstruction = true">查看</v-btn>
    </v-col>

    <v-dialog v-model="showConstruction" width="450">
      <v-card>
        <v-card-title style="font-size: 18px">数据发送示例</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-5">
          <p style="white-space: pre-wrap">
            {{ msgSendExample }}
          </p>
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
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'

@Component
@Validator(['noEmpty', 'isJSON', 'topicNameFormatter'])
export default class CreateJson extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private noRepeat: string[] = []
  private showConstruction = false
  private queneTypeItem = [
    { text: '数据量优先', value: 1 },
    { text: '顺序优先', value: 2 }
  ]

  private get msgSendExample() {
    let msg = ''
    msg = this.formProvide.formObj.dataStructSchema
    return JSON.stringify(
      {
        requestid: new Date().getTime(),
        data: [msg]
      },
      null,
      '\t'
    )
  }
}
</script>
