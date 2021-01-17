<template>
  <v-row no-gutters>
    <h-input v-for="item in formTypeObj" :key="item.id" :formTypeItem="item" />
  </v-row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HInput from '@/components/h-input.vue'
import { InputType } from '@/type/dialog-form.type'

@Component({
  components: {
    HInput
  }
})
export default class RoleDialog extends Vue {
  private formTypeObj: Array<InputType> = [
    {
      label: '角色名称',
      valueName: 'name',
      type: 'input',
      require: true
    }
  ]
}
</script>
