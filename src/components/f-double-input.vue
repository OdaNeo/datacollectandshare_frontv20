<template>
  <v-col cols="12" class="HDoubleInput d-flex">
    <label class="label mr-2"><span v-if="required" class="require-span">*</span>{{ description }}</label>
    <div class="ml-4 flex-grow-1">
      <v-row
        v-for="(item, index) in formProvide.formObj[formObj]"
        :key="item.id"
        class="d-flex justify-space-between"
        no-gutters
      >
        <v-col class="mr-2">
          <v-text-field
            v-model="item[object[0].value]"
            dense
            outlined
            clearable
            :disabled="formProvide.formObj.canNotEdit"
            :clear-icon="mdiCloseCircleOutline"
            :placeholder="object[0].text"
            height="35"
            :rules="rules1 ? [...rules1] : undefined"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="item[object[1].value]"
            dense
            :disabled="formProvide.formObj.canNotEdit"
            outlined
            :placeholder="object[1].text"
            clearable
            :clear-icon="mdiCloseCircleOutline"
            :rules="rules2 ? [...rules2] : undefined"
            height="35"
          ></v-text-field>
        </v-col>
        <!-- 累加按钮 -->
        <v-col v-if="accumulation" class="d-flex justify-space-around flex-grow-0" style="min-width: 60px">
          <v-btn
            v-if="formProvide.formObj.header.length === index + 1"
            :disabled="formProvide.formObj.canNotEdit"
            fab
            dark
            depressed
            max-width="22"
            max-height="22"
            color="primary"
            style="margin-top: 7px"
            @click.stop="add"
          >
            <v-icon dark>{{ mdiPlus }}</v-icon>
          </v-btn>
          <v-btn
            v-if="formProvide.formObj.header.length > 1"
            :disabled="formProvide.formObj.canNotEdit"
            fab
            dark
            depressed
            max-width="22"
            max-height="22"
            color="primary"
            style="margin-top: 7px"
            @click.stop="minus(index)"
          >
            <v-icon dark>{{ mdiMinus }}</v-icon>
          </v-btn>
        </v-col>
        <div v-else class="mr-15"></div>
      </v-row>
    </div>
  </v-col>
</template>
<script lang="ts">
import { Component, Vue, Inject, Prop } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import { mdiPlus, mdiMinus, mdiCloseCircleOutline } from '@mdi/js'
// required 会在 description 前添加 * 标识
// 触发change事件传递 File，父组件可使用change 或者 v-model语法糖接收
@Component({})
export default class HDoubleInput extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  @Prop({ default: true }) private required!: boolean
  @Prop() private description!: string
  // 填充项目
  @Prop() private object!: Array<{ text: string; value: string | number | any }>
  // formObj 观测项
  @Prop() private formObj!: string
  // 是否显示右边累加按钮
  @Prop({ default: false }) private accumulation!: boolean
  // 校验规则
  @Prop({ default: undefined }) private rules1!: any | undefined
  @Prop({ default: undefined }) private rules2!: any | undefined
  private mdiPlus = mdiPlus
  private mdiMinus = mdiMinus
  private mdiCloseCircleOutline = mdiCloseCircleOutline

  // 头信息
  private add() {
    this.formProvide.formObj[this.formObj].push({
      [this.object[0].value]: '',
      [this.object[1].value]: ''
    })
  }

  // 头信息
  private minus(index: number) {
    this.formProvide.formObj[this.formObj].splice(index, 1)
  }
}
</script>
