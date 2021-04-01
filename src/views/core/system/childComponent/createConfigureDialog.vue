<template>
  <v-row no-gutters>
    <!-- 配置类型 -->
    <HRadioGroup
      :description="`配置类型`"
      v-model="formProvide.formObj['type']"
      :rules="[...h_validator.noEmpty('配置类型')]"
      :items="types"
    />

    <!-- typeInput -->
    <HSimpleInput
      v-if="formProvide.formObj['type'] === '其他'"
      :required="false"
      v-model="formProvide.formObj['typeInput']"
      :rules="[...h_validator.noEmpty(), ...h_validator.typeInputRules()]"
    />

    <!-- 配置名称 -->
    <HRadioGroup
      :description="`配置名称`"
      v-model="formProvide.formObj['name']"
      :rules="[...h_validator.noEmpty('配置名称')]"
      :items="names"
    />

    <!-- nameInput -->
    <HSimpleInput
      v-if="formProvide.formObj['name'] === '其他'"
      :required="false"
      v-model="formProvide.formObj['nameInput']"
      :rules="[...h_validator.noEmpty(), ...h_validator.nameInputRules()]"
    />

    <!-- 配置属性 -->
    <HSimpleInput
      v-model="formProvide.formObj['value']"
      :description="`配置属性`"
      :rules="[...h_validator.noEmpty('配置属性'), ...h_validator.valueRules()]"
    />
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject, Watch } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HSimpleInput from '@/components/h-simple-input.vue'
import HRadioGroup from '@/components/h-radio-group.vue'

@Component({
  components: {
    HSimpleInput,
    HRadioGroup
  }
})
@Validator(['typeInputRules', 'nameInputRules', 'valueRules', 'noEmpty'])
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

  // 配置类型
  @Watch('formProvide.formObj.type')
  private getTypeInput(newVal: string) {
    if (newVal === 'network' || newVal === 'system') {
      this.names[0].disabled = true
      this.names[1].disabled = true
      this.names[2].disabled = false

      this.formProvide.formObj.name = '其他'
      this.formProvide.formObj.typeInput = undefined
    } else if (newVal === '其他') {
      this.names[0].disabled = false
      this.names[1].disabled = false
      this.names[2].disabled = true

      this.formProvide.formObj.name = 'kafka'
      this.formProvide.formObj.nameInput = undefined
    } else {
      // 恢复默认
      this.names[0].disabled = false
      this.names[1].disabled = false
      this.names[2].disabled = false
      this.formProvide.formObj = {}
    }
  }
}
</script>
