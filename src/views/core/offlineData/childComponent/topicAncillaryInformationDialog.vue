<template>
  <div id="topicAncillaryInformationDialog">
    <h-table :headers="tableHeader" :desserts="otherObj"></h-table>
    <h-table v-if="otherObj.taskType === 3" :headers="headers" :desserts="headerValue"></h-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import { tableHeaderType } from '@/type/table.type'

@Component({
  components: {
    HTable
  }
})
export default class TopicAncillaryInformationDialog extends Vue {
  @Prop() private otherObj!: any

  get tableHeader(): Array<tableHeaderType> {
    switch (this.otherObj.taskType) {
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
          },
          {
            text: '是否写入ES',
            align: 'center',
            value: 'saveEs',
            format: saveEs => {
              return saveEs === 1 ? '是' : '否'
            }
          },
          {
            text: '是否写入HBase',
            align: 'center',
            value: 'saveHbase',
            format: saveHbase => {
              return saveHbase === 1 ? '是' : '否'
            }
          }
        ]
      case 5:
        return [
          {
            text: '基础路径',
            align: 'center',
            value: 'basePath'
          },
          {
            text: '文件前缀',
            align: 'center',
            value: 'filePrefix'
          },
          {
            text: '表名',
            align: 'center',
            value: 'tableName'
          },
          {
            text: 'host',
            align: 'center',
            value: 'host'
          },
          {
            text: 'port',
            align: 'center',
            value: 'port'
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
