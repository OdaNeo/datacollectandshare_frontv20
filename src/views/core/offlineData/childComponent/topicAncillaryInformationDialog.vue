<template>
  <div id="topicAncillaryInformationDialog">
    <h-table :headers="tableHeader" :desserts="otherObj"></h-table>
    <!-- <h-table v-if="otherObj.topicInterFaceType === 3" :headers="headers" :desserts="headerValue"></h-table> -->
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
      case 1:
        return [
          {
            text: '内存过期时间',
            align: 'center',
            value: 'redisTimer'
          }
        ]
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
        value: 'value',
        formater: () => {
          return '222'
        }
      }
    ]
  }

  // get headerValue(): any {
  //   return JSON.parse(this.otherObj.header)
  // }
}
</script>
