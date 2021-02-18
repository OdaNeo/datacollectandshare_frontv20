<template>
  <div id="OfflineLogData">
    <v-card-text>
      <v-container v-html="obj"></v-container>
    </v-card-text>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({})
export default class OfflineLogData extends Vue {
  @Prop() private rowJson!: string

  private get obj() {
    const _obj = JSON.parse(this.rowJson)
    let html = ''

    for (const p in _obj) {
      _obj[p] = _obj[p].replaceAll('\n', '<div />')
      html += `
      <div style="display:flex;font-size: 16px;line-height:28px;">
        <div style="min-width:150px;font-size: 16px;text-align: right;padding-right:10px">${p}:</div>
        <div>${_obj[p]}</div>
      </div>
      `
    }

    return html
  }
}
</script>
<style scoped>
.obj-title {
  font-size: 18px;
  text-align: right;
}
</style>
