<template>
  <div id="UserSubNameList">
    <h-table :headers="headers" :desserts="desserts"></h-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import { topicTable } from '@/type/topic.type'

@Component({
  components: {
    HTable
  }
})
export default class UserSubNameList extends Vue {
  @Prop() private rowObj!: Partial<topicTable>

  private get desserts() {
    return this.rowObj.userSubNameList
  }

  private headers = [
    {
      text: '订阅用户ID',
      align: 'center',
      value: 'subUserID'
    },
    {
      text: '订阅用户名称',
      align: 'center',
      value: 'login_name'
    },
    {
      text: '订阅用户所属系统名称',
      align: 'center',
      value: 'Name'
    }
  ]
}
</script>
