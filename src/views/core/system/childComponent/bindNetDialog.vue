<template>
  <!-- <v-row no-gutters>
    <v-col cols="11">
      <v-select
        single-line
        outlined
        dense
        solo
        label="请选择系统名称"
        :items="systems"
        class="dialogInput"
        :rules="systemRules"
        v-model="formProvide.formObj.systemId"
        @change="systemChange"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <p class="require-span">*</p>
            <label>系统名称：</label>
          </div>
        </template>
      </v-select>
    </v-col>
    <v-col cols="11">
      <v-select
        single-line
        outlined
        dense
        solo
        label="请选择网络名称"
        :items="networks"
        class="dialogInput"
        v-model="formProvide.formObj.networkId"
        :rules="netWorkRules"
        @change="netWorkChange"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <p class="require-span">*</p>
            <label>网络名称：</label>
          </div>
        </template>
      </v-select>
    </v-col>
  </v-row> -->
  <v-row no-gutters>
    <h-input v-for="item in formTypeObj" :key="item.id" :formTypeItem="item" />
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject, Prop } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import HInput from '@/components/h-input.vue'
import { InputType } from '@/type/dialog-form.type'
import { H_Vue } from '@/declaration/vue-prototype'

@Component({
  components: {
    HInput
  }
})
@http
export default class BindNetDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  @Prop() private networks!: any
  @Prop() private systems!: any

  private formTypeObj: Array<InputType> = [
    {
      label: '系统名称',
      valueName: 'systemId',
      type: 'select',
      items: this.systems,
      require: true
    },
    {
      label: '网络名称',
      valueName: 'networkId',
      type: 'select',
      items: this.networks,
      require: true
    }
  ]
}
</script>
