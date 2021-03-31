<template>
  <v-row no-gutters>
    <!-- 主题名称 -->
    <HSimpleInput
      v-model="formProvide.formObj['topicName']"
      :description="`主题名称`"
      :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter(), ...noRepeat]"
      v-topicNameNoRepeat="{
        set: n => {
          noRepeat = [...n]
        }
      }"
    />
    <!-- baseUrl  -->
    <HSimpleInput
      v-model="formProvide.formObj['baseUrl']"
      :description="`baseUrl`"
      :rules="[...h_validator.noEmpty('baseUrl')]"
    />
    <!-- FTP地址 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>FTP地址</label>
      <div class="ml-4 flex-grow-1">
        <v-row
          v-for="item in formProvide.formObj.ftp"
          :key="item.id"
          class="d-flex justify-space-between mr-15"
          no-gutters
        >
          <v-col class="mr-2">
            <v-text-field
              v-model="item[ftpItem[0].value]"
              dense
              outlined
              :label="ftpItem[0].text"
              height="34"
              :rules="[...h_validator.noEmpty('host')]"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="item[ftpItem[1].value]"
              dense
              outlined
              :label="ftpItem[1].text"
              :rules="[...h_validator.noEmpty('post'), ...h_validator.isNumber()]"
              height="34"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <!-- FTP账号  -->
    <HSimpleInput
      v-model="formProvide.formObj['userName']"
      :description="`FTP账号`"
      :rules="[...h_validator.noEmpty('FTP账号')]"
    />
    <!-- FTP密码  -->
    <HSimpleInput
      v-model="formProvide.formObj['password']"
      :description="`FTP密码`"
      :rules="[...h_validator.noEmpty('FTP密码')]"
    />
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HSimpleInput from '@/components/h-simple-input.vue'
@Component({
  components: {
    HSimpleInput
  }
})
@Validator(['noEmpty', 'topicNameFormatter', 'isNumber'])
export default class PullFTP extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private noRepeat: string[] = []
  private ftpItem = [
    { text: 'host', value: 'host' },
    { text: 'port', value: 'port' }
  ]
}
</script>
