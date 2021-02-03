<template>
  <!-- <v-row no-gutters>
    <v-col cols="11">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput"
        v-model="formProvide.formObj.name"
        :rules="nameRules"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <p class="require-span">*</p>
            <label>权限名称：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="11">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput"
        v-model="formProvide.formObj.url"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label>权限地址：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="11">
      <v-radio-group
        v-model="formProvide.formObj.type"
        single-line
        outlined
        dense
        class="dialogInput"
        solo
        row
        :rules="typeRules"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <p class="require-span">*</p>
            <label>权限类型：</label>
          </div>
        </template>
        <v-radio v-for="n in types" :key="n.value" :label="`${n.text}`" :value="n.value"></v-radio>
      </v-radio-group>
    </v-col>
    <v-col cols="6" style="position: relative" v-show="formProvide.formObj.type">
      <v-text-field
        single-line
        outlined
        :clearable="selectModel ? true : false"
        dense
        solo
        class="dialogInput selectInput"
        required
        placeholder="请选择父节点"
        readonly
        v-model="selectModel"
        :rules="formProvide.formObj.type === 'button' ? parentRules : []"
        @click.stop="selectShow = !selectShow"
      >
        <template v-slot:append>
          <v-icon @click.stop="selectShow = !selectShow" :style="selectShow ? 'transform:rotate(180deg)' : ''"
            >mdi-chevron-down</v-icon
          >
        </template>
        <template v-slot:prepend>
          <div class="text-label">
            <p class="require-span" v-show="formProvide.formObj.type === 'button'">*</p>
            <label>父节点名称：</label>
          </div>
        </template>
      </v-text-field>
      <div v-show="selectShow" class="selectCon">
        <ul>
          <li
            v-for="(item, index) in desserts"
            :key="index"
            @click.stop="formProvide.formObj.type === 'menu' ? choiceLi(item) : ''"
            @mouseenter="formProvide.formObj.type === 'button' ? selectEnter(item, index) : ''"
            :class="actionSelect == index ? 'actionSelect' : ''"
          >
            {{ item.name }}
            <v-icon class="selectConIcon" v-show="formProvide.formObj.type == 'button'">mdi-chevron-right</v-icon>
          </li>
        </ul>
        <ul class="selectChildCon" v-show="selectChildShow">
          <li v-for="(child, index) in selectChild.childrenList" :key="index" @click="choiceLi(child, selectChild)">
            {{ child.name }}
          </li>
        </ul>
      </div>
    </v-col>
  </v-row> -->
  <v-row no-gutters>
    <!-- <h-input v-for="item in formTypeObj" :key="item.id" :formTypeItem="item" /> -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>权限名称</label>
      <v-text-field
        v-model="formProvide.formObj['name']"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('权限名称')]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>
    <v-col cols="12" class="d-flex">
      <label class="label mr-2">权限地址</label>
      <v-text-field
        v-model="formProvide.formObj['url']"
        outlined
        dense
        clearable
        height="34"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>
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
import HInput from '@/components/h-input.vue'
// import { InputType } from '@/type/dialog-form.type'
import { userFormVar, userFormVarDo } from '@/type/user.type'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'

@Component({
  components: {
    HInput
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

  // private formTypeObj: Array<InputType> = [
  //   {
  //     label: '权限名称',
  //     valueName: 'name',
  //     type: 'input',
  //     require: true
  //   },
  //   {
  //     label: '权限地址',
  //     valueName: 'url',
  //     type: 'input',
  //     require: false
  //   },
  //   {
  //     label: '权限类型',
  //     valueName: 'type',
  //     type: 'radioGroup',
  //     items: this.types,
  //     require: true
  //   },
  //   {
  //     label: '父节点名称',
  //     valueName: '',
  //     type: '',
  //     items: this.dessertsList,
  //     require: false
  //   },
  //   {
  //     valueName: '',
  //     type: '',
  //     items: [],
  //     require: false
  //   }
  // ]

  // @Watch('formProvide.formObj.type')
  // private typesChange(val: string, oldVal: string) {
  //   // if (val === 'menu') {
  //   //   //   //   this.formTypeObj[3].valueName = 'parentid'
  //   //   //   //   this.formTypeObj[3].type = 'select'
  //   //   //   //   this.formTypeObj[3].items = this.dessertsList
  //   //   //   //   this.formTypeObj[3].require = false
  //   //   //   //   this.formTypeObj[4].valueName = ''
  //   //   //   //   this.formTypeObj[4].type = ''
  //   //   //   //   this.formTypeObj[4].items = []
  //   //   //   //   this.formTypeObj[4].require = false
  //   //   //   // 解决 formProvide.formObj.type 切换的时候 parentid不渲染的问题
  //   //   oldVal && (this.formProvide.formObj.parentid = this.formProvide.formObj.grandparentid)
  //   // } else if (val === 'button') {
  //   //   //   // this.formTypeObj[3].valueName = 'grandparentid'
  //   //   //   // this.formTypeObj[3].type = 'select'
  //   //   //   // this.formTypeObj[3].items = this.dessertsList
  //   //   //   // this.formTypeObj[3].require = true
  //   //   //   // this.formTypeObj[4].valueName = 'parentid'
  //   //   //   // this.formTypeObj[4].type = 'select'
  //   //   //   // this.formTypeObj[4].items = []
  //   //   //   // this.formTypeObj[4].require = true
  //   //   //   // 解决切换type后 this.formTypeObj[4].items为空的bug
  //   //   this.selectChange(this.formProvide.formObj.grandparentid)
  //   // }
  //   console.log(this.formProvide.formObj)
  // }

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
