<template>
  <v-dialog v-model="closeDialog" width="700" @click:outside="closeMethod">
    <v-card>
      <slot />
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'

@Component
export default class FDialog extends Vue {
  @Model('tdialog', { type: Boolean }) private checked!: boolean

  get closeDialog(): boolean {
    return this.checked
  }

  public closeMethod(): void {
    this.$emit('tdialog')
  }
}
</script>
