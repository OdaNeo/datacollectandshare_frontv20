<template>
  <div id="UserSubNameList">
    <h-table :headers="headers" :desserts="otherObj"></h-table>
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
export default class UserSubNameList extends Vue {
  @Prop() private otherObj!: any

  private headers = [
    {
      text: '订阅用户',
      align: 'center',
      value: 'userSubNameList',
      format: (userSubNameList: Array<string>) => {
        return userSubNameList?.toString()
      }
    }
  ]
}
</script>
