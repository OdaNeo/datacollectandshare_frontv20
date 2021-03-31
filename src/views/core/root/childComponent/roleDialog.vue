<template>
  <v-row no-gutters>
    <!-- 用户名 -->
    <HSimpleInput
      v-model="formProvide.formObj['name']"
      :rules="[...h_validator.noEmpty('角色名称')]"
      :description="`角色名称`"
    />
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HSimpleInput from '@/components/h-simple-input.vue'
@Component({
  components: {
    HSimpleInput
  }
})
@Validator(['noEmpty'])
export default class RoleDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
}
</script>
