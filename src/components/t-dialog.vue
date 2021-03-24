<template>
  <!-- retain-focus=false  https://vuetifyjs.com/zh-Hans/api/v-dialog/#section-5c5e6027 -->
  <v-dialog v-model="closeDialog" width="700" persistent :retain-focus="false">
    <v-card>
      <v-card-title>
        <span style="font-size: 18px">{{ formProvide.title }}</span>
        <v-btn class="close-btn" icon @click="closeMethod">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pb-0 mt-4 pb-6">
        <v-container class="pb-1">
          <slot />
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Model, Inject } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'

@Component
export default class TDialog extends Vue {
  @Model('tdialog') private checked!: boolean
  @Inject() private readonly formProvide!: H_Vue

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
</style>
