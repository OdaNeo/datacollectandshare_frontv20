<template>
  <div id="dataStructureDialog">
    <h-table v-if="rowObj.topicInterFaceType !== 4" :headers="headers" :desserts="desserts"></h-table>
    <!--如果接口类型是4 就展示一个json数据-->
    <v-card-text v-else>
      <v-container>
        {{ rowObj.dataStructSchema }}
      </v-container>
    </v-card-text>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import util from '@/decorator/utilsDecorator'
@Component({
  components: {
    HTable
  }
})
@util
export default class DataStructureDialog extends Vue {
  @Prop() private rowObj!: any
  get desserts(): Array<{}> {
    return this.h_utils.topicListUtil.transJsonToTopicList(this.rowObj.dataStruct, this.rowObj.dsAnnotation)
  }
  private headers = [
    {
      text: '数据key',
      align: 'center',
      value: 'key'
    },
    {
      text: '数据value',
      align: 'center',
      value: 'type'
    },
    {
      text: '描述',
      align: 'center',
      value: 'description'
    }
  ]
}
</script>
