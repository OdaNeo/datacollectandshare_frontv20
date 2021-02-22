<template>
  <v-row no-gutters>
    <!-- 主题名称 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>主题名称</label>
      <v-text-field
        v-model="formProvide.formObj['topicName']"
        :disabled="formProvide.formObj.canNotEdit"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('主题名称'), ...noRepeat]"
        class="ml-4 mr-15"
        v-topicNameNoRepeat="{
          set: n => {
            noRepeat = [...n]
          }
        }"
      ></v-text-field>
    </v-col>
    <!-- cron -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>运行周期</label>
      <v-text-field
        v-model="formProvide.formObj['cron']"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('运行周期')]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>
    <!-- 运行周期 示例 -->
    <v-col cols="12" class="d-flex mb-6">
      <label class="label mr-2">运行周期示例</label>
      <v-btn color="grey" class="ml-4" outlined @click="showCron = true">查看</v-btn>
    </v-col>
    <!-- 运行周期 弹框 -->
    <v-dialog v-model="showCron" width="450">
      <v-card>
        <v-card-title style="font-size: 18px">运行周期示例</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-5">
          <p style="white-space: pre-wrap">{{ cronDemo }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showCron = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 自增属性查询脚本 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2">自增属性查询<br />脚本</label>
      <v-textarea height="80" v-model="formProvide.formObj['sqlMaxContent']" outlined class="ml-4 mr-15"></v-textarea>
    </v-col>

    <!-- 自增属性查询 示例 -->
    <v-col cols="12" class="d-flex mb-6">
      <label class="label mr-2">查询脚本示例</label>
      <v-btn color="grey" class="ml-4" outlined @click="showSql = true">查看</v-btn>
    </v-col>
    <!-- 自增属性查询 弹框 -->
    <v-dialog v-model="showSql" width="450">
      <v-card>
        <v-card-title style="font-size: 18px">查询脚本示例</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-5">
          <p style="white-space: pre-wrap">{{ sqlDemo }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showSql = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 自增属性最大值 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2">自增属性最大值</label>
      <v-text-field
        v-model="formProvide.formObj['maxValue']"
        outlined
        dense
        clearable
        height="34"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>
    <!-- DataX脚本 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>DataX脚本</label>
      <v-textarea
        v-model="formProvide.formObj['jsonContent']"
        height="80"
        outlined
        :rules="[...h_validator.noEmpty('DataX脚本'), ...h_validator.isJSON()]"
        class="ml-4 mr-15"
      ></v-textarea>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'

@http
@Component({})
@Validator(['noEmpty', 'isJSON'])
export default class CreateTransactionalData extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private noRepeat: Array<string> = []
  private showCron = false
  private showSql = false
  private cronDemo = '1 * * * * * ?'
  private sqlDemo = `{
    "type":"mysql",
    "column":"id",
    "sql":"select max(id) as id from video_stream_info"
}`
}
</script>
