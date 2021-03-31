<template>
  <v-dialog class="dialog" v-model="dialog" :width="width" persistent>
    <!-- 遮罩层 禁止交互 -->
    <!-- <v-overlay :opacity="0.2" :value="loading">
      <v-progress-circular class="loading" indeterminate color="primary"></v-progress-circular>
      <div class="loading-text">请稍候……</div>
    </v-overlay> -->
    <!-- tittle form btn -->
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
      <v-progress-linear v-else color="primary" indeterminate height="2"></v-progress-linear>
      <!-- 主题 -->
      <v-card-text class="pb-0 mt-4">
        <v-container class="pb-0 pt-5">
          <v-form ref="userDialogForm" :disabled="loading" v-model="userDialogValid">
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

@Component
export default class FDialog extends Vue {
  @Ref('userDialogForm') readonly udf!: HTMLFormElement
  @Inject() private readonly formProvide!: H_Vue
  @Model('closedialog') private checked!: boolean
  @Prop({ default: false }) private loading!: boolean
  @Prop({ default: 700 }) private width!: number

  private defaultFormObj: any = {}
  private dialog = true
  private mdiClose = mdiClose

  private userDialogValid = true
  private closeMethod(): void {
    this.dialog = false
    this.$emit('closedialog')
  }

  private async validate() {
    if (this.udf.validate() && this.formProvide.methodName) {
      const parent = this.$parent as any
      const bool = await parent[this.formProvide.methodName](this.formProvide.formObj)
      if (bool) {
        this.closeMethod()
      }
    }
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
