<template>
  <div id="topicAncillaryInformationDialog">
    <h-table :headers="tableHeader" :desserts="rowObj"></h-table>
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
  @Prop() private rowObj!: any

  get tableHeader(): any {
    switch (this.rowObj.topicInterFaceType) {
      case 1:
        return [
          {
            text: '内存过期时间',
            align: 'center',
            value: 'redisTimer'
          }
        ]
      case 4:
        return [
          {
            text: '内存过期时间',
            align: 'center',
            value: 'redisTimer'
          },
          {
            text: '是否写入ES',
            align: 'center',
            value: 'writeElasticsearch',
            format: function (val: any) {
              switch (val) {
                case 1:
                  return '是'
                case 0:
                  return '否'
              }
            }
          }
        ]
      case 6:
        return [
          {
            text: '内存过期时间',
            align: 'center',
            value: 'redisTimer'
          }
        ]
      default:
        return []
    }
  }
}
</script>
