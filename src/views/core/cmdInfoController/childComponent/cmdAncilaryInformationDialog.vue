<template>
  <div id="cmdAncilaryInformationDialog">
    <h-table :headers="tableHeader" :desserts="otherObj" :height="400" class="mb-10"></h-table>
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
export default class CmdAncilaryInformationDialog extends Vue {
  @Prop() private otherObj!: any

  get tableHeader(): Array<{}> {
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
