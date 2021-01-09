<template>
  <v-row>
    <v-col cols="9" offset="1" style="padding: 0">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        height="32"
        class="dialogInput"
        v-model="formProvide.formObj.name"
        :rules="nameRules"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <p>*</p>
            <label>权限名称：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="9" offset="1" style="padding: 0">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        height="32"
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
    <v-col cols="9" offset="1" style="padding: 0">
      <v-radio-group
        v-model="formProvide.formObj.type"
        single-line
        outlined
        dense
        class="dialogInput"
        height="32"
        solo
        row
        :rules="typeRules"
        required
      >
        <template v-slot:prepend>
          <div class="text-label" style="margin-top: 7px">
            <p>*</p>
            <label>权限类型：</label>
          </div>
        </template>
        <v-radio v-for="n in types" :key="n.value" :label="`${n.text}`" :value="n.value"></v-radio>
      </v-radio-group>
    </v-col>
    <v-col cols="8" offset="1" style="padding: 0; position: relative" v-show="formProvide.formObj.type">
      <v-text-field
        single-line
        outlined
        :clearable="selectModel ? true : false"
        dense
        solo
        height="32"
        class="dialogInput selectInput"
        required
        placeholder="请选择父节点"
        readonly
        v-model="selectModel"
        :rules="formProvide.formObj.type == 'button' ? parentRules : []"
        @click.stop="selectShow = !selectShow"
      >
        <template v-slot:append>
          <v-icon @click.stop="selectShow = !selectShow" :style="selectShow ? 'transform:rotate(180deg)' : ''"
            >mdi-chevron-down</v-icon
          >
        </template>
        <template v-slot:prepend>
          <div class="text-label">
            <p v-show="formProvide.formObj.type == 'button'">*</p>
            <label>父节点名称：</label>
          </div>
        </template>
      </v-text-field>
      <div v-show="selectShow" class="selectCon">
        <ul>
          <li
            v-for="(item, index) in desserts"
            :key="index"
            @click.stop="formProvide.formObj.type == 'menu' ? choiceLi(item) : ''"
            @mouseenter="formProvide.formObj.type == 'button' ? selectEnter(item, index) : ''"
            :class="actionSelect == index ? 'actionSelect' : ''"
          >
            {{ item.name }}
            <v-icon class="selectConIcon" v-show="formProvide.formObj.type == 'button'">mdi-chevron-right</v-icon>
          </li>
        </ul>
        <ul class="selectChildCon" v-show="selectChildShow">
          <li v-for="(child, index) in selectChild.childrenList" :key="index" @click="choiceLi(child, selectChild)">{{
            child.name
          }}</li>
        </ul>
      </div>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject, Prop } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'

@Component
export default class ResourcesDialog extends Vue {
  @Prop() private desserts!: any
  @Inject() private readonly formProvide!: H_Vue

  private actionSelect = -1
  private selectChild: Array<any> = []
  private selectShow = false
  private selectChildShow = false
  private selectModel = null

  private types: Array<any> = [
    { text: '菜单', value: 'menu' },
    { text: '按钮', value: 'button' }
  ]

  private nameRules: Array<Function> = [(v: string) => !!v || '请设置权限名称']

  private typeRules: Array<Function> = [(v: string) => !!v || '请选择权限类型']

  private parentRules: Array<Function> = [(v: string) => !!v || '请选择父节点']

  private choiceLi(item: any, parent?: any) {
    this.selectModel = parent ? parent.name + '/' + item.name : item.name
    this.formProvide.formObj.parentid = item.id
    this.selectShow = false
  }

  private selectEnter(item: any, index: number) {
    this.actionSelect = index
    this.selectChild = item
    this.selectChildShow = true
  }

  private clearMethod() {
    this.selectModel = null
    this.actionSelect = -1
    this.selectShow = false
    this.selectChildShow = false
  }

  created(): void {
    document.addEventListener('click', () => {
      if (this.selectShow) {
        this.selectShow = false
        this.selectChildShow = false
      }
    })
  }
}
</script>

<style scoped>
.text-label {
  width: 120px;
  display: flex;
  justify-content: flex-end;
}
.text-label p {
  color: red;
}
.selectInput {
  width: 330px;
  font-size: 14px;
}
.selectCon {
  width: 193px;
  background: #fff;
  position: absolute;
  left: 128px;
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
  left: 193px;
  top: 0;
  z-index: 99;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
.selectChildCon li:hover {
  color: #409eff;
}
</style>
