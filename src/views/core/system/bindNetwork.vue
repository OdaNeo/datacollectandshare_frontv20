// TODO :更新bind-net-dialog子组件
<template>
  <div id="bindNetwork">
    <v-row>
      <v-col cols="3">
        <v-text-field
          solo
          dense
          placeholder="请输入查找的系统名称"
          clearable
          append-icon="mdi-magnify"
          @click:append="searchSystemName"
          v-model="querySystemName"
        >
        </v-text-field>
      </v-col>
      <v-col cols="9">
        <v-btn height="39" color="primary" dark @click.stop="bindNet">绑定网络</v-btn>
      </v-col>
    </v-row>
    <h-table
      :headers="headers"
      :desserts="desserts"
      :pageNum="pageNum"
      @PaginationNow="PaginationNow"
      :paginationLength="paginationLength"
    >
      <template v-slot:operation="{ item }">
        <v-btn
          text
          color="primary"
          @click="
            HConfirmShow = true
            HConfirmItem = item
          "
          >解绑网络</v-btn
        >
      </template>
    </h-table>
    <t-dialog v-if="dialogFlag" v-model="dialogFlag">
      <bind-net-dialog :networks="networks" :systems="systems" />
    </t-dialog>
    <h-confirm v-if="HConfirmShow" v-model="HConfirmShow" @hconfirm="relieveNetWork" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import { returnDataType } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import TDialog from '@/components/t-dialog.vue'
import BindNetDialog from './childComponent/bindNetDialog.vue'
import { BindNetworkObj } from '@/type/bindNetwork'
import HConfirm from '@/components/h-confirm.vue'
import util from '@/decorator/utilsDecorator'
import { FormObj } from '@/type/dialog-form.type'

@Component({
  components: {
    HTable,
    TDialog,
    BindNetDialog,
    HConfirm
  }
})
@http
@util
export default class BindNetwork extends Vue {
  @Provide('formProvide') private formProvide: FormObj = {
    title: '' as string,
    btnName: [] as Array<string>,
    methodName: '' as string,
    formObj: {}
  }
  private networks: Array<{ value: string; text: string }> = []
  private systems: Array<{ value: string; text: string }> = []

  private pageSize = 20
  private pageNum = 1
  private desserts: Array<unknown> = []
  private paginationLength = 0
  private dialogFlag = false
  private querySystemName = null
  private headers = [
    {
      text: '系统ID',
      align: 'center',
      value: 'systemId'
    },
    {
      text: '系统名称',
      align: 'center',
      value: 'systemName'
    },
    {
      text: '网络Id',
      align: 'center',
      value: 'networkId'
    },
    {
      text: '网络名称',
      align: 'center',
      value: 'networkName'
    },
    {
      text: '操作',
      align: 'center',
      slot: 'operation'
    }
  ]
  // confirm popup
  private HConfirmShow = false
  private HConfirmItem: BindNetworkObj = { systemId: '', systemName: '', networkId: '', networkName: '' }

  async searchMethod(bool: boolean, params: object): Promise<void> {
    const { data }: returnDataType = bool
      ? await this.h_request['httpGET']<object>('GET_SYSNET_GETBINDBYNAME', params)
      : await this.h_request['httpGET']<object>('GET_SYSNET_GETBINDLIST', params)
    this.paginationLength = Math.ceil(data['total'] / this.pageSize) || 1
    this.desserts = data['list']
  }

  private searchSystemName() {
    if (!this.querySystemName) {
      this.searchMethod(false, {
        pageSize: this.pageSize,
        pageNum: 1
      })
    } else {
      this.searchMethod(true, {
        type: 'system',
        name: this.querySystemName,
        pageSize: this.pageSize,
        pageNum: 1
      })
    }
    this.pageNum = 1
  }

  private bindNet() {
    this.dialogFlag = true
    this.formProvide.btnName = ['立即绑定']
    this.formProvide.title = '绑定网络'
    this.formProvide.methodName = 'bindNetCallBack'
    this.formProvide.formObj = {}
  }
  // 绑定网络
  private async bindNetCallBack(formObj: BindNetworkObj) {
    this.networks.forEach((item: { value: string; text: string }) => {
      if (formObj.networkId && item.value === formObj.networkId) {
        formObj.networkName = item.text
      }
    })
    this.systems.forEach((item: { value: string; text: string }) => {
      if (formObj.systemId && item.value === formObj.systemId) {
        formObj.systemName = item.text
      }
    })
    const { success } = await this.h_request['httpPOST']('GET_SYSNET_ADDBINDINFO', {
      systemId: formObj.systemId,
      systemName: formObj.systemName,
      networkId: formObj.networkId,
      networkName: formObj.networkName
    })
    if (success) {
      this.searchMethod(false, {
        pageSize: this.pageSize,
        pageNum: 1
      })
      this.pageNum = 1
      return Promise.resolve(success)
    }

    // 重置networks systems
    this.getNetworksAndSystems()
  }

  // 解绑网络
  private async relieveNetWork() {
    if (!this.HConfirmItem.systemId) {
      return
    }
    const { success } = await this.h_request['httpPOST']('POST_SYSNET_DELETEBINDINFO', {
      systemId: this.HConfirmItem.systemId,
      systemName: this.HConfirmItem.systemName,
      networkId: this.HConfirmItem.networkId,
      networkName: this.HConfirmItem.networkName
    })
    if (success) {
      this.HConfirmShow = false
      this.h_utils.alertUtil.open('解绑成功', true, 'success')
      this.searchMethod(false, {
        pageSize: this.pageSize,
        pageNum: 1
      })
      this.pageNum = 1
    }
    // 重置networks systems
    this.getNetworksAndSystems()
  }

  private PaginationNow(page: number) {
    this.pageNum = page
    this.searchMethod(false, {
      pageSize: this.pageSize,
      pageNum: this.pageNum
    })
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

  created(): void {
    this.searchMethod(false, {
      pageSize: this.pageSize,
      pageNum: 1
    })
    this.pageNum = 1
    this.getNetworksAndSystems()
  }
}
</script>
