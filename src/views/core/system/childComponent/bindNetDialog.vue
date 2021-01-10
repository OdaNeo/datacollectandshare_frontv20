<template>
  <v-row no-gutters>
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
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { H_Vue } from '@/declaration/vue-prototype'

@Component
@http
export default class BindNetDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private networks: Array<{ value: string; text: string }> = []
  private systems: Array<{ value: string; text: string }> = []

  private systemRules = [(v: string) => !!v || '请选择系统名称']
  private netWorkRules = [(v: string) => !!v || '请选择网络名称']

  private netWorkChange(value: string) {
    this.networks.forEach((item: { value: string; text: string }) => {
      if (item.value === value) {
        this.formProvide.formObj.networkName = item.text
      }
    })
  }

  private systemChange(value: string) {
    this.systems.forEach((item: { value: string; text: string }) => {
      if (item.value === value) {
        this.formProvide.formObj.systemName = item.text
      }
    })
  }

  private clearMethod() {
    this.formProvide.formObj.networkName = ''
    this.formProvide.formObj.systemName = ''
  }

  public async getNetworksAndSystems(): Promise<void> {
    const { data } = await this.h_request['httpGET']('GET_SYSNET_GETSYSNETLIST', {})
    this.networks = data.network.map((n: { name: string; id: string }) => {
      return {
        text: n.name,
        value: n.id
      }
    })
    this.systems = data.system.map((n: { name: string; id: string }) => {
      return {
        text: n.name,
        value: n.id
      }
    })
  }

  async created(): Promise<void> {
    this.getNetworksAndSystems()
  }
}
</script>
