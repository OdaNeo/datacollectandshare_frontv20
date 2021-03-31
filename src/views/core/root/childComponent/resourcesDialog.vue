<template>
  <v-row no-gutters>
    <!-- 权限名称 -->
    <HSimpleInput
      v-model="formProvide.formObj['name']"
      :rules="[...h_validator.noEmpty('权限名称')]"
      :description="`权限名称`"
    />
    <!-- 权限名称 -->
    <HSimpleInput v-model="formProvide.formObj['url']" :required="false" :description="`权限地址`" />

    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>权限类型</label>
      <v-radio-group
        v-model="formProvide.formObj['type']"
        row
        dense
        height="34"
        :rules="[...h_validator.noEmpty('权限类型')]"
        class="ml-4 my-0 pt-0 flex-grow-1 mr-15"
      >
        <v-radio v-for="n in types" :key="n.value" :label="`${n.text}`" :value="n.value"></v-radio>
      </v-radio-group>
    </v-col>
    <!-- menu -->
    <v-col v-if="formProvide.formObj['type'] === 'menu'" cols="12" class="d-flex">
      <label class="label mr-2">父节点名称</label>
      <v-select
        v-model="formProvide.formObj['parentid']"
        outlined
        dense
        clearable
        height="34"
        label="请选择父节点名称"
        :items="dessertsList"
        class="ml-4 my-0 mr-15"
      ></v-select>
    </v-col>
    <!-- button -->
    <v-col v-if="formProvide.formObj['type'] === 'button'" cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>父节点名称</label>
      <v-select
        v-model="formProvide.formObj['grandparentid']"
        outlined
        dense
        clearable
        height="34"
        label="请选择父节点名称"
        :rules="[...h_validator.noEmpty('父节点名称')]"
        :items="dessertsList"
        class="ml-4 my-0 mr-15"
      ></v-select>
    </v-col>
    <!-- button -->
    <v-col v-if="formProvide.formObj['type'] === 'button'" cols="12" class="d-flex">
      <label class="label mr-2"></label>
      <v-select
        v-model="formProvide.formObj['parentid']"
        outlined
        dense
        clearable
        height="34"
        label="请选择"
        :rules="[...h_validator.noEmpty()]"
        :items="dessertsListChild"
        class="ml-4 my-0 mr-15"
      ></v-select>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject, Watch } from 'vue-property-decorator'
import { userFormVar, userFormVarDo } from '@/type/user.type'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HSimpleInput from '@/components/h-simple-input.vue'
@Component({
  components: {
    HSimpleInput
  }
})
@Validator(['noEmpty'])
export default class ResourcesDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  @Prop() private desserts!: any

  private dessertsList: Array<userFormVarDo> = []
  private dessertsListChild: Array<userFormVarDo> = []

  private types: Array<userFormVar> = [
    { text: '菜单', value: 'menu' },
    { text: '按钮', value: 'button' }
  ]

  // toggle 下拉框
  @Watch('formProvide.formObj.grandparentid', { immediate: true })
  private selectChange(val: string) {
    this.dessertsList.forEach(item => {
      if (val === item.value) {
        item.childrenList && (this.dessertsListChild = item.childrenList)
      }
    })
  }

  private getDessertsList(items: Array<any>): Array<any> {
    return items.map((item: { name: string; id: number; childrenList?: Array<{ name: string; id: number }> }) => {
      if (!item.childrenList) {
        return {
          text: item.name,
          value: item.id
        }
      } else {
        return {
          text: item.name,
          value: item.id,
          childrenList: this.getDessertsList(item.childrenList)
        }
      }
    })
  }

  created(): void {
    // 获得嵌套列表
    this.dessertsList = this.getDessertsList(this.desserts)
    // 编辑页面填充
    // if (this.formProvide.formObj.type) {
    //   this.typesChange(this.formProvide.formObj.type, '')
    // }
    // if (this.formProvide.formObj.type === 'button') {
    //   // this.getParentId(this.formProvide.formObj.parentid, this.dessertsList)
    //   this.formProvide.formObj.grandparentid = this.parentItem.text
    // }
    // this.getParentId(54, this.dessertsList)
    // console.log(this.dessertsList)
    // console.log(this.parentItem)
  }
}
</script>

<style scoped>
/* .selectInput {
  width: 330px;
  font-size: 14px;
} */
/* .selectCon {
  width: 198px;
  background: #fff;
  position: absolute;
  left: 140px;
  top: 40px;
  z-index: 99;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
.selectCon li {
  width: 100%;
  height: 32px;
  font-size: 16px;
  color: #000;
  line-height: 32px;
  padding-left: 10px;
  cursor: pointer;
  position: relative;
}
.selectConIcon {
  float: right;
  margin-right: 10px;
  margin-top: 5px;
}
.selectCon .actionSelect {
  color: #409eff;
}
.selectCon li:hover {
  background: #f5f7fa;
}
.selectChildCon {
  width: 100%;
  height: 100%;
  background: #fff;
  position: absolute;
  left: 198px;
  top: 0;
  z-index: 99;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
.selectChildCon li:hover {
  color: #409eff;
} */
</style>
