<template>
  <v-row no-gutters>
    <!-- 系统名称 -->
    <HSelect
      :description="`系统名称`"
      label="请选择系统名称"
      v-model="formProvide.formObj['systemId']"
      :rules="[...h_validator.noEmpty('系统名称')]"
      :disabled="formProvide.formObj.canNotEdit"
      :items="systems"
    />

    <!-- 网络名称 -->
    <HSelect
      :description="`网络名称`"
      label="请选择网络名称"
      v-model="formProvide.formObj['networkId']"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('网络名称')]"
      :items="networks"
    />
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject, Prop } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HSelect from '@/components/h-select.vue'
@Component({
  components: {
    HSelect
  }
})
@Validator(['noEmpty'])
export default class BindNetDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  @Prop() private networks!: any
  @Prop() private systems!: any
}
</script>
