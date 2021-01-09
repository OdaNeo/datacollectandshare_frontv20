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
            <label>角色名称：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'

@Component
export default class RoleDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private nameRules: Array<Function> = [(v: string) => !!v || '请设置角色名称']
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
</style>
