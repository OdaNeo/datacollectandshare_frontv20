<template>
  <!-- retain-focus=false  https://vuetifyjs.com/zh-Hans/api/v-dialog/#section-5c5e6027 -->
  <v-dialog v-model="closeDialog" :width="width" persistent :retain-focus="false">
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
      <v-card-text class="pb-4 pt-4 overflow">
        <v-container class="pb-0">
          <slot />
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Model, Inject, Prop } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import { mdiClose } from '@mdi/js'

@Component
export default class TDialog extends Vue {
  @Prop({ default: false }) private loading!: boolean
  @Model('tdialog') private checked!: boolean
  @Inject() private readonly formProvide!: H_Vue
  @Prop({ default: 700 }) private width!: number
  private mdiClose = mdiClose

  set closeDialog(val: boolean) {
    val
  }

  get closeDialog(): boolean {
    return this.checked
  }

  public closeMethod(): void {
    this.$emit('tdialog')
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
</style>
