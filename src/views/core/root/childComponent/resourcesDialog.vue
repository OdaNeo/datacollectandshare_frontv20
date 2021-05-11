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

    <!-- 权限类型 -->
    <HRadioGroup
      :description="`权限类型`"
      v-model="formProvide.formObj['type']"
      :rules="[...h_validator.noEmpty('权限类型')]"
      :items="types"
      @input="handleTypeChange"
    />

    <!-- menu -->
    <HSelect
      v-if="formProvide.formObj['type'] === 'menu'"
      :required="false"
      :description="`父节点名称`"
      label="请选择父节点名称"
      v-model="formProvide.formObj['parentid']"
      :items="dessertsList"
    />

    <!-- button -->
    <HSelect
      v-if="formProvide.formObj['type'] === 'button'"
      :description="`父节点名称`"
      label="请选择父节点名称"
      v-model="formProvide.formObj['grandparentid']"
      :rules="[...h_validator.noEmpty('父节点名称')]"
      :items="dessertsList"
      @input="selectChange"
    />

    <!-- button -->
    <HSelect
      v-if="formProvide.formObj['type'] === 'button'"
      label="请选择"
      :required="false"
      v-model="formProvide.formObj['parentid']"
      :rules="[...h_validator.noEmpty()]"
      :items="dessertsListChild"
    />
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator'
import { userFormVar, userFormVarDo } from '@/type/user.type'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HSimpleInput from '@/components/h-simple-input.vue'
import HRadioGroup from '@/components/h-radio-group.vue'
import HSelect from '@/components/h-select.vue'

@Component({
  components: {
    HSimpleInput,
    HRadioGroup,
    HSelect
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
  private selectChange(val: number) {
    this.dessertsList.forEach(item => {
      if (val === item.value) {
        item.childrenList && (this.dessertsListChild = item.childrenList)
      }
    })
  }

  // 获得嵌套列表
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

  // type 切换
  private handleTypeChange() {
    this.formProvide.formObj.parentid = null
    this.formProvide.formObj.grandparentid = null
  }

  created(): void {
    // 获得嵌套列表
    this.dessertsList = this.getDessertsList(this.desserts)

    // 显示 grandparentid
    const grandparentid = this.formProvide.formObj.grandparentid
    if (grandparentid) {
      this.selectChange(grandparentid)
    }

    console.log(`parentid: ` + this.formProvide.formObj.parentid)
    console.log(`grandparentid: ` + this.formProvide.formObj.grandparentid)
  }
}
</script>
