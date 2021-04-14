<template>
  <div id="VideoDetail">
    <h-table :headers="headers" :desserts="dessertsObj"></h-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import { tableHeaderType } from '@/type/table.type'
import { topicTable } from '@/type/topic.type'

@Component({
  components: {
    HTable
  }
})
export default class VideoDetail extends Vue {
  @Prop() private dessertsObj!: Partial<topicTable>[]

  private headers: tableHeaderType[] = [
    {
      text: '本系统rtmp地址',
      align: 'center',
      width: 200,
      value: 'serverUrl'
    },
    {
      text: '摄像头物理地址',
      align: 'center',
      width: 200,
      value: 'address'
    },
    {
      text: '摄像头rtsp/rtmp地址',
      align: 'center',
      width: 200,
      value: 'sourceUrl'
    }
  ]
}
</script>
