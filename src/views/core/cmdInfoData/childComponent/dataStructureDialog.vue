<template>
  <div id="dataStructureDialog">
    <h-table :headers="headersObj" :desserts="dessertsObj"></h-table>
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
export default class DataStructureDialog extends Vue {
  @Prop() private headersObj!: unknown
  @Prop() private dessertsObj!: unknown
}
</script>
