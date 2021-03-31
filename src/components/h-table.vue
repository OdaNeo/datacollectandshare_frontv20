<template>
  <div id="h-table">
    <div class="simple-table">
      <!-- 正在查询 -->
      <div v-if="loading" class="text-center mt-15" style="min-height: 100px">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <!-- 无数据 -->
      <div
        id="h-table-no-data"
        v-else-if="!desserts || desserts.length === 0"
        class="text-center mt-15"
        style="min-height: 150px"
      >
        <v-icon color="primary lighten-3">{{ mdiToyBrickRemoveOutline }}</v-icon>
        <div style="font-size: 14px; margin-top: 5px">查无数据</div>
      </div>
      <!-- 有数据 -->
      <v-simple-table v-else fixed-header>
        <template v-slot:default>
          <thead>
            <tr>
              <th v-for="(header, index) in realHeaders" :key="index" :class="'text-' + header.align">
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in desserts2" :key="key" v-show="showFun(item.parentid)">
              <td
                v-for="(header, index) in realHeaders"
                :key="index"
                :class="'text-' + header.align"
                :style="{
                  minWidth: '90px',
                  wordWrap: 'break-word',
                  maxWidth: header.width ? header.width + 'px' : undefined,
                  color: header.color ? header.color : undefined
                }"
              >
                <div
                  :style="
                    'margin-left:' +
                    (header.expand ? (item.icon ? (item.level - 1) * 10 : (item.level - 1) * 20) : 0) +
                    'px'
                  "
                >
                  <v-icon v-if="header.expand && item.icon" @click="expandMethod(item)" :style="expandStyle(item)">
                    {{ mdiChevronRight }}
                  </v-icon>
                  {{ header.format ? header.format(item[header.value]) : item[header.value] }}
                  <slot :name="header.slot" v-if="header.slot" :item="item" :index="key"></slot>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
    <v-pagination
      class="pt-6 pb-3"
      :length="paginationLength"
      :total-visible="10"
      @input="handleCurrentChange"
      :value="pageNum"
      v-if="paginationLength && pageNum && !loading && desserts.length !== 0"
    ></v-pagination>
  </div>
</template>
<script lang="ts">
import { tableHeaderType } from '@/type/table.type'
import { Component, Vue, Watch, Prop, Emit } from 'vue-property-decorator'
import { mdiToyBrickRemoveOutline, mdiChevronRight } from '@mdi/js'

@Component
export default class HTable extends Vue {
  @Prop() private paginationLength!: number
  @Prop() private pageNum!: number
  @Prop() private headers!: tableHeaderType[]
  @Prop() private desserts!: any
  @Prop() private title!: string
  @Prop({ default: false }) private loading!: boolean

  private desserts2: Array<unknown> = []
  private expanded: Array<any> = []
  private mdiToyBrickRemoveOutline = mdiToyBrickRemoveOutline
  private mdiChevronRight = mdiChevronRight

  @Watch('desserts')
  private dessertsChanged(val: any): void {
    this.desserts2 = []
    this.dessertsRecursion(val, 1)
  }

  private dessertsRecursion(val: any, level: number) {
    const nowVal = Object.prototype.toString.call(val) === '[object Array]' ? val : [val]

    nowVal.forEach((dessert: any) => {
      if (dessert && dessert.childrenList && dessert.childrenList.length > 0) {
        this.desserts2.push({ ...dessert, level, icon: true })
        this.dessertsRecursion(dessert.childrenList, level + 1)
      } else {
        this.desserts2.push({ ...dessert, level, icon: false })
      }
    })
  }

  private get realHeaders(): Array<tableHeaderType> {
    return this.headers.filter((item: tableHeaderType) => {
      return !item.isHide
    })
  }

  private showFun(parentid: number) {
    if (parentid == null) {
      return true
    } else {
      return this.expanded.some((val: number) => {
        return val === parentid
      })
    }
  }

  private expandMethod(expand: any) {
    const flag = this.expanded.some((num: number) => {
      return num === expand.id
    })
    if (flag) {
      if (expand.parentid == null) {
        this.expanded = []
      } else {
        this.expanded.forEach((num, index) => {
          if (num === expand.id) {
            this.expanded.splice(index, 1)
          }
        })
      }
    } else {
      this.expanded = []
      if (expand.parentid == null) {
        this.expanded.push(expand.id)
      } else {
        this.expanded.push(expand.parentid)
        this.expanded.push(expand.id)
      }
    }
  }

  private expandStyle(expand: any) {
    const flag = this.expanded.some((num: number) => {
      return num === expand.id
    })
    if (flag) {
      return 'transform:rotate(90deg)'
    } else {
      return 'transform:rotate(0deg)'
    }
  }

  @Emit('PaginationNow') private handleCurrentChange(value: number): number {
    return value
  }

  created(): void {
    this.dessertsRecursion(this.desserts, 1)
  }
}
</script>

<style scoped>
#h-table {
  background: rgb(246, 248, 251) !important;
}
.v-pagination {
  background: transparent !important;
}
#h-table-no-data >>> .v-icon__svg {
  height: 50px !important;
  width: 50px !important;
}

.simple-table {
  border-radius: 2px;
  background-color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
