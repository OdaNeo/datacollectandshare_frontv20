<template>
  <div id="OfflineLogData">
    <v-container style="max-height: 400px; overflow: auto" v-html="obj"></v-container>
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
      _obj[p] = _obj[p].replaceAll('\n', '<br />')
      html += `
      <div style="display:flex;font-size: 16px;line-height:28px;">
        <div style="width:100px;font-size: 16px;text-align: center;padding-right:10px;overflow: auto">${p}:</div>
        <div style="overflow: auto;width: 500px;">${_obj[p]}</div>
      </div>
      `
    }

    return html
  }
}
</script>
