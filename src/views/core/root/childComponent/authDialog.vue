<template>
  <v-treeview
    class="authDialog ml-12"
    selectable
    :items="roles"
    :transition="true"
    item-key="id"
    v-model="formProvide.formObj.roles"
    activatable
    selection-type="independent"
  ></v-treeview>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'

@Component
export default class AuthDialog extends Vue {
  @Prop() private roles!: Array<any>
  @Inject() private readonly formProvide!: H_Vue
}
</script>

<style scoped>
.authDialog {
  max-height: 600px;
  overflow-y: auto;
}
</style>
