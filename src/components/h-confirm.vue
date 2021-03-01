<template>
  <v-dialog v-model="closeDialog" max-width="285" persistent>
    <v-card>
      <v-card-title style="font-size: 18px">确定删除么？</v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text @click.stop="closeMethod">取消</v-btn>
        <v-btn color="primary" text @click.stop="$emit('hconfirm')">确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'
@Component
export default class HConfirm extends Vue {
  @Model('closeConfirm', { type: Boolean }) private checked!: boolean

  set closeDialog(val: boolean) {
    val
  }

  get closeDialog(): boolean {
    return this.checked
  }
  public closeMethod(): void {
    this.$emit('closeConfirm')
  }
}
</script>
