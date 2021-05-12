<template>
  <v-col cols="12" class="HExample d-flex mb-5">
    <label class="label mr-2"><span v-if="required" class="require-span">*</span>{{ description }}</label>
    <v-btn color="grey" class="ml-4" outlined @click="showConstruction = true">查看</v-btn>
    <v-dialog v-model="showConstruction" width="550">
      <v-card>
        <v-card-title style="font-size: 18px">{{ description }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-5 pb-0">
          <p v-if="message" style="white-space: pre-wrap">
            {{ message }}
          </p>
          <p v-if="headers">
            <HTable :headers="headers" :desserts="desserts" />
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showConstruction = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>
<script lang="ts">
import HTable from '@/components/h-table.vue'
import { Component, Vue, Prop } from 'vue-property-decorator'
// required 会在 description 前添加 * 标识
// 非props attr 会透传给 v-file-input 组件（根组件不继承）
// 触发change事件传递 File，父组件可使用change 或者 v-model语法糖接收
@Component({
  components: {
    HTable
  }
})
export default class HExample extends Vue {
  @Prop({ default: false }) private required!: boolean
  @Prop({ default: '示例' }) private description!: string
  @Prop() private headers!: unknown
  @Prop() private desserts!: unknown
  @Prop() private message!: string
  private showConstruction = false
}
</script>
