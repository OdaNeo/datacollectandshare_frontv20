<template>
  <div>
    <v-snackbar v-model="visible" top :timeout="timeout" :color="color">
      {{ text }}
    </v-snackbar>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { alertStoreModule } from '@/store/modules/alert'

@Component
export default class HDialog extends Vue {
  get color(): string {
    return alertStoreModule.AlertState.color
  }

  get visible(): boolean {
    return alertStoreModule.AlertState.visible
  }

  set visible(val: boolean) {
    alertStoreModule.AlertState.visible = val
  }

  get timeout(): number {
    return alertStoreModule.AlertState.timeout
  }

  get text(): string {
    return alertStoreModule.AlertState.text
  }

  set text(val: string) {
    alertStoreModule.AlertState.text = val
  }
}
</script>
