<template>
  <div id="cmdAncilaryInformationDialog">
    <h-table :headers="tableHeader" :desserts="otherObj" :height="400" style="margin-bottom: 10px"></h-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator'
import HTable from '../../../../components/h-table.vue'

@Component({
  components: {
    HTable
  }
})
export default class TopicAncilaryInformationDialog extends Vue {
  @Prop() private otherObj!: any

  get tableHeader() {
    return [
      {
        text: '描述',
        align: 'center',
        value: 'description'
      }
    ]
  }
}
</script>
