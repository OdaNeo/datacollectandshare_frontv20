<template>
  <!-- <v-row no-gutters>
    <v-col cols="11" class="d-flex">
      <v-select
        single-line
        outlined
        dense
        solo
        label="请选择配置类型"
        :items="types"
        class="dialogInput"
        v-model="formProvide.formObj.type"
        :rules="typeRules"
        @change="typeChange"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <p class="require-span">*</p>
            <label>配置类型：</label>
          </div>
        </template>
      </v-select>
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput ml-10"
        v-if="formProvide.formObj.type === '其他'"
        v-model="formProvide.formObj.typeInput"
        :rules="typeInputRules"
        required
      >
      </v-text-field>
    </v-col>
    <v-col cols="11" class="d-flex">
      <v-select
        single-line
        outlined
        dense
        solo
        label="请选择配置名称"
        :items="names"
        height="32"
        class="dialogInput"
        v-model="formProvide.formObj.name"
        :rules="nameRules"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <p class="require-span">*</p>
            <label>配置名称：</label>
          </div>
        </template>
      </v-select>
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput ml-10"
        v-if="formProvide.formObj.name === '其他'"
        v-model="formProvide.formObj.nameInput"
        :rules="nameInputRules"
        required
      >
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
        v-model="formProvide.formObj.value"
        :rules="valueRules"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <p class="require-span">*</p>
            <label>配置属性：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
  </v-row> -->
  <v-row no-gutters>
    <h-input v-for="item in formTypeObj" :key="item.id" :formTypeItem="item" />
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject, Watch } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import HInput from '@/components/h-input.vue'
import { InputType } from '@/type/dialog-form.type'
import Validator from '@/validator2/t-validator'

@Component({
  components: {
    HInput
  }
})
export default class CreateConfigureDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private types = [
    { text: 'network', value: 'network', disabled: false },
    { text: 'system', value: 'system', disabled: false },
    { text: '其他', value: '其他', disabled: false }
  ]

  private names = [
    { text: 'kafka', value: 'kafka', disabled: false },
    { text: 'redis', value: 'redis', disabled: false },
    { text: '其他', value: '其他', disabled: false }
  ]

  private formTypeObj: Array<InputType> = [
    {
      label: '配置类型',
      valueName: 'type',
      type: 'radioGroup',
      items: this.types,
      require: true
    },
    {
      label: '',
      valueName: 'typeInput',
      type: '',
      rules: Validator['system-validator'].typeInputRules,
      require: false
    },
    {
      label: '配置名称',
      valueName: 'name',
      type: 'radioGroup',
      items: this.names,
      require: true
    },
    {
      label: '',
      valueName: 'nameInput',
      type: '',
      rules: Validator['system-validator'].nameInputRules,
      require: false
    },
    {
      label: '配置属性',
      valueName: 'value',
      type: 'input',
      rules: Validator['system-validator'].valueRules,
      require: true
    }
  ]

  // 配置类型
  @Watch('formProvide.formObj.type')
  private getTypeInput(newVal: string) {
    if (newVal === 'network' || newVal === 'system') {
      this.names[0].disabled = true
      this.names[1].disabled = true
      this.names[2].disabled = false

      this.formProvide.formObj.name = '其他'
      this.formProvide.formObj.typeInput = undefined

      this.formTypeObj[1].type = ''
      this.formTypeObj[1].require = false
      this.formTypeObj[3].type = 'input'
      this.formTypeObj[3].require = true
    } else if (newVal === '其他') {
      this.names[0].disabled = false
      this.names[1].disabled = false
      this.names[2].disabled = true

      this.formProvide.formObj.name = 'kafka'
      this.formProvide.formObj.nameInput = undefined

      this.formTypeObj[1].type = 'input'
      this.formTypeObj[1].require = true
      this.formTypeObj[3].type = ''
      this.formTypeObj[3].require = false
    } else {
      // 恢复默认
      this.names[0].disabled = false
      this.names[1].disabled = false
      this.names[2].disabled = false
      this.formProvide.formObj = {}

      this.formTypeObj[1].type = ''
      this.formTypeObj[1].require = false
      this.formTypeObj[3].type = ''
      this.formTypeObj[3].require = false
    }
  }

  // 配置名称
  @Watch('formProvide.formObj.name')
  private getNameInput(newVal: string) {
    if (newVal === '其他') {
      this.formTypeObj[3].type = 'input'
      this.formTypeObj[3].require = true
    } else if (newVal !== '其他') {
      this.formTypeObj[3].type = ''
      this.formTypeObj[3].require = false
    }
  }
}
</script>
