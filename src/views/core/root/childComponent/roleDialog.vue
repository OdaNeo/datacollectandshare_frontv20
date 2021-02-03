<template>
  <v-row no-gutters>
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>角色名称</label>
      <v-text-field
        v-model="formProvide.formObj['name']"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('角色名称')]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import HInput from '@/components/h-input.vue'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'

@Component({
  components: {
    HInput
  }
})
@Validator(['noEmpty'])
export default class RoleDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
}
</script>
