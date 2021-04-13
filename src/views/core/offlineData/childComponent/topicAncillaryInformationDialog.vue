<template>
  <div id="topicAncillaryInformationDialog">
    <h-table :headers="tableHeader" :desserts="otherObj"></h-table>
    <h-table v-if="otherObj.topicInterFaceType === 3" :headers="headers" :desserts="headerValue"></h-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'

@Component({
  components: {
    HTable
  }
})
export default class TopicAncillaryInformationDialog extends Vue {
  @Prop() private otherObj!: any

  get tableHeader(): Array<{}> {
    switch (this.otherObj.topicInterFaceType) {
      case 2:
        return [
          {
            text: '数据库类型',
            align: 'center',
            value: 'dataBaseType'
          },
          {
            text: '数据库IP',
            align: 'center',
            value: 'dataBaseIp'
          }
        ]
      case 3:
        return [
          {
            text: 'url',
            align: 'center',
            value: 'url'
          }
        ]
      default:
        return []
    }
  }

  get headers(): any {
    return [
      {
        text: 'key',
        align: 'center',
        value: 'key'
      },
      {
        text: 'value',
        align: 'center',
        value: 'value'
      }
    ]
  }

  get headerValue(): any {
    return JSON.parse(this.otherObj.header)
  }
}
</script>
