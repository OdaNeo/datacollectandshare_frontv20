<template>
  <div id="JsonContentDetails">
    <v-container v-html="obj"></v-container>
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
        <div style="font-size: 16px;line-height: 24px;">
          <span>[</span>
          <div style="margin-left:24px">${this.arrayToHTML(item)}</div>
          <span>],</span>
        </div>
        `
      } else if (Object.prototype.toString.call(item) === '[object Object]') {
        // 对象
        html += `
        <div style="font-size: 16px;line-height: 24px;">
          <span>{</span>
          <div style="margin-left:24px">${this.objToHTML(item)}</div>
          <span>},</span>
        </div>
        `
      } else if (typeof item === 'string') {
        // string
        html += `
        <div style="font-size: 16px;line-height: 24px;">
          <span>"${item}"</span><span>,</span>
        </span>
        `
      } else {
        // 其他
        html += `
        <div style="font-size: 16px;line-height: 24px;">
          <span>${item}</span><span>,</span>
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
        // 数组
        html += `
        <div style="font-size: 16px;line-height: 24px;">
          <span style="font-size: 16px;over-flow: auto;">"${p}":</span>
          <span>[</span>
          <div style="margin-left:24px">${this.arrayToHTML(obj[p])}</div>
          <span>],</span>
        </div>
        `
      } else if (Object.prototype.toString.call(obj[p]) === '[object Object]') {
        // 对象
        html += `
        <div style="font-size: 16px;line-height: 24px;">
          <span style="font-size: 16px;over-flow: auto;">"${p}":</span>
          <span>{</span>
          <div style="margin-left:24px">${this.objToHTML(obj[p])}</div>
          <span>},</span>
        </div>
        `
      } else if (typeof obj[p] === 'string') {
        // string
        html += `
        <div style="font-size: 16px;line-height: 24px;">
          <span style="font-size: 16px;over-flow: auto;">"${p}":</span>
          <span>"${obj[p]}"</span><span>,</span>
        </div>
        `
      } else {
        // string
        html += `
        <div style="font-size: 16px;line-height: 24px;">
          <span style="font-size: 16px;over-flow: auto;">"${p}":</span>
          <span>${obj[p]}</span><span>,</span>
        </div>
        `
      }
    }
    return html
  }

  private get obj() {
    const _obj = JSON.parse(this.rowJson)
    return `<div style="font-size: 16px;">{</div>${this.objToHTML(_obj)}<div>}</div>`
  }
}
</script>
