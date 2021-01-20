<template>
  <v-dialog v-model="dialog" width="800" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">{{ formProvide.title }}</span>
        <v-btn style="position: absolute; right: 14px; top: 14px" icon @click="closeMethod">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pb-0 mt-6">
        <v-container>
          <v-form ref="userDialogForm" v-model="userDialogValid">
            <slot />
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions class="pt-0" v-if="formProvide.btnName && formProvide.btnName.length > 0">
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          :disabled="!userDialogValid"
          v-if="formProvide.btnName[0]"
          @click.stop="validate"
          >{{ formProvide.btnName[0] }}</v-btn
        >
        <v-btn color="blue darken-1" text v-if="formProvide.btnName[1]" @click.stop="closeMethod">
          {{ formProvide.btnName[1] }}</v-btn
        >
        <v-btn color="blue darken-1" text v-else @click.stop="reset">重置</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Model, Inject, Ref } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
@Component
export default class TDialog extends Vue {
  @Ref('userDialogForm') readonly udf!: HTMLFormElement
  @Inject() private readonly formProvide!: H_Vue
  @Model('closedialog', { type: Boolean }) private checked!: boolean

  private defaultFormObj: any = {}

  get dialog(): boolean {
    return this.checked
  }
  private userDialogValid = true
  private closeMethod(): void {
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
      this.formProvide.formObj[p] = this.defaultFormObj[p]
    }
  }

  created(): void {
    // 记录默认值
    for (let p in this.formProvide.formObj) {
      this.defaultFormObj[p] = this.formProvide.formObj[p]
    }
  }
}
</script>
