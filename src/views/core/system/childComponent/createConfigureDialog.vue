<template>
  <v-row no-gutters>
    <!-- 配置类型 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>配置类型</label>
      <v-radio-group
        v-model="formProvide.formObj['type']"
        row
        dense
        height="34"
        :rules="[...h_validator.noEmpty('配置类型')]"
        class="ml-4 my-0 pt-0 flex-grow-1"
      >
        <v-radio
          v-for="n in types"
          :key="n.value"
          :label="`${n.text}`"
          :value="n.value"
          :disabled="n.disabled"
        ></v-radio>
      </v-radio-group>
    </v-col>
    <!-- typeInput -->
    <HSimpleInput
      v-if="formProvide.formObj['type'] === '其他'"
      :required="false"
      v-model="formProvide.formObj['typeInput']"
      :rules="[...h_validator.noEmpty(), ...h_validator.typeInputRules()]"
    />

    <!-- 配置名称 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>配置名称</label>
      <v-radio-group
        v-model="formProvide.formObj['name']"
        row
        dense
        height="34"
        :rules="[...h_validator.noEmpty('配置名称')]"
        class="ml-4 my-0 pt-0 flex-grow-1"
      >
        <v-radio
          v-for="n in names"
          :key="n.value"
          :label="`${n.text}`"
          :value="n.value"
          :disabled="n.disabled"
        ></v-radio>
      </v-radio-group>
    </v-col>
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
@Component({
  components: {
    HSimpleInput
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
