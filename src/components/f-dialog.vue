<template>
  <v-dialog class="dialog" v-model="dialog" :width="width" persistent>
    <!-- 遮罩层 禁止交互 -->
    <v-card>
      <v-card-title>
        <span style="font-size: 18px">{{ formProvide.title }}</span>
        <v-btn class="close-btn" icon @click="closeMethod">
          <v-icon size="20">{{ mdiClose }}</v-icon>
        </v-btn>
      </v-card-title>
      <!-- 分割线 -->
      <v-divider style="padding-bottom: 1px" v-if="!loading"></v-divider>
      <!-- 进度条 -->
      <v-progress-linear
        v-else
        color="primary"
        :value="value"
        :indeterminate="indeterminate"
        height="2"
      ></v-progress-linear>
      <!-- 主题 -->
      <v-card-text class="pb-0 pt-4 overflow">
        <v-container class="pb-0 pt-5">
          <v-form ref="userDialogForm" id="userDialogForm" :disabled="loading" v-model="userDialogValid">
            <slot />
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions class="pt-0 pb-4 pr-8" v-if="formProvide.btnName && formProvide.btnName.length > 0">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          :disabled="!userDialogValid || loading"
          v-if="formProvide.btnName[0]"
          @click.stop="validate"
          >{{ formProvide.btnName[0] }}</v-btn
        >
        <v-btn color="primary" text v-if="formProvide.btnName[1]" :disabled="loading" @click.stop="closeMethod">
          {{ formProvide.btnName[1] }}</v-btn
        >
        <v-btn color="primary" text v-else :disabled="loading" @click.stop="reset">重置</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Model, Inject, Ref, Prop } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import { mdiClose } from '@mdi/js'
import util from '@/decorator/utilsDecorator'

@Component
@util
export default class FDialog extends Vue {
  @Ref('userDialogForm') readonly udf!: HTMLFormElement
  @Inject() private readonly formProvide!: H_Vue
  @Model('closedialog') private checked!: boolean
  @Prop({ default: 700 }) private width!: number
  @Prop({ default: true }) indeterminate!: boolean
  @Prop({ default: 0 }) value!: number

  private loading = false
  private defaultFormObj: any = {}
  private dialog = true
  private mdiClose = mdiClose

  private userDialogValid = true
  private closeMethod(): void {
    this.dialog = false
    setTimeout(() => {
      this.$emit('closedialog')
    }, 290)
  }

  private async validate() {
    this.loading = true
    const topicName = this.formProvide.formObj.topicName

    // 如果包含topicName，且不为修改 主题 (undefined) ， 就要发送验重请求
    if (topicName && !this.formProvide.formObj.canNotEdit) {
      const text = await this.h_utils['noRepeat'].topicName(topicName)

      if (text === undefined) {
        // 网络错误
        this.loading = false
        return
      } else if (text) {
        // 如果重复，阻止提交
        this.h_utils.alertUtil.open(text, true, 'error')
        this.loading = false
        return
      }
    }

    if (this.udf.validate() && this.formProvide.methodName) {
      const parent = this.$parent as any
      const bool = await parent[this.formProvide.methodName](this.formProvide.formObj)
      if (bool) {
        this.closeMethod()
      }
      this.loading = false
    } else {
      this.loading = false
      throw new Error('请指定发起请求的methodName')
    }

    this.loading = false
  }

  private reset() {
    this.udf.resetValidation()
    for (let p in this.formProvide.formObj) {
      if (Array.isArray(this.defaultFormObj[p])) {
        this.formProvide.formObj[p] = this.defaultFormObj[p].map((item: string | {}, index: number) => {
          if (typeof item === 'string') {
            return item
          } else {
            // immutable
            let _obj: any = {}
            for (let _p in this.defaultFormObj[p][index]) {
              _obj[_p] = this.defaultFormObj[p][index][_p]
            }
            return _obj
          }
        })
      } else {
        this.formProvide.formObj[p] = this.defaultFormObj[p]
      }
    }
  }

  mounted(): void {
    // deep-copy default value
    // for (let p in this.formProvide.formObj) {
    //     this.defaultFormObj[p] = this.formProvide.formObj[p]
    // }
    this.defaultFormObj = JSON.parse(JSON.stringify(this.formProvide.formObj))
  }
}
</script>

<style scoped>
.close-btn {
  position: absolute;
  right: 14px;
  top: 14px;
}
.overflow {
  max-height: 70vh;
  overflow-x: hidden;
  overflow-y: scroll;
}
.dialog {
  position: relative;
}
.loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
.loading-text {
  color: #1976d2;
  margin-top: 100px;
}
</style>
