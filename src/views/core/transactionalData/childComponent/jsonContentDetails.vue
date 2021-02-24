<template>
  <div id="JsonContentDetails">
    <v-container style="max-height: 400px; overflow: auto" v-html="obj"></v-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({})
export default class JsonContentDetails extends Vue {
  @Prop() private rowJson!: string

  private arrayToHTML(arr: Array<unknown>) {
    let html = ''
    arr.forEach((item: unknown) => {
      if (Array.isArray(item)) {
        // 数组
        html += `
        <div style="margin-left:24px;">
          <div>[</div>
          <div>${this.arrayToHTML(item)}</div>
          <div>],</div>
        </div>
        `
      } else if (Object.prototype.toString.call(item) === '[object Object]') {
        // 对象
        html += `
        <div style="margin-left:24px;">
          <span>{</span>
          <div>${this.objToHTML(item)}</div>
          <span>},</span>
        </div>
        `
      } else if (typeof item === 'string') {
        // string
        html += `
        <span style="margin-left:24px;">
          <span>"${item}",</span>
        </span>
        `
      } else {
        // number or other
        html += `
        <span style="margin-left:24px;">
          <span>${item},</span>
        </span>
        `
      }
    })
    return html
  }

  private objToHTML(obj: any) {
    let html = ''
    for (const p in obj) {
      if (Array.isArray(obj[p])) {
        // array
        html += `
        <div style="margin-left:24px;">
          <span>"${p}":</span>
          <span>[</span>
          <div>${this.arrayToHTML(obj[p])}</div>
          <span>],</span>
        </div>
        `
      } else if (Object.prototype.toString.call(obj[p]) === '[object Object]') {
        // object
        html += `
        <div style="margin-left:24px;">
          <span>"${p}":</span>
          <span>{</span>
          <div>${this.objToHTML(obj[p])}</div>
          <span>},</span>
        </div>
        `
      } else if (typeof obj[p] === 'string') {
        // string
        html += `
        <div style="margin-left:24px;">
          <span>"${p}":</span>
          <span>"${obj[p]}",</span>
        </div>
        `
      } else {
        // number or other
        html += `
        <div style="margin-left:24px;">
          <span>"${p}":</span>
          <span>${obj[p]},</span>
        </div>
        `
      }
    }
    return html
  }

  private get obj() {
    if (this.rowJson !== '') {
      const _obj = JSON.parse(this.rowJson)
      return `<div style="font-size: 16px;line-height: 24px;">
                {${this.objToHTML(_obj)}}
              </div>`
    } else {
      return ``
    }
  }
}
</script>
