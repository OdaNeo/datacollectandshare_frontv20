<template>
  <div id="systemConfig">
    <v-row>
      <v-col cols="3">
        <v-text-field
          solo
          dense
          placeholder="请输入查找的配置名称"
          clearable
          append-icon="mdi-magnify"
          @click:append="searchSystem"
          v-model="querySystemName"
        >
        </v-text-field>
      </v-col>
      <v-col>
        <v-btn height="38" color="primary" dark @click.stop="addConfigure">添加配置</v-btn>
      </v-col>
    </v-row>
    <h-table
      :headers="headers"
      :desserts="desserts"
      :pageNum="pageNum"
      @PaginationsNow="PaginationsNow"
      :paginationLength="paginationLength"
    >
      <template v-slot:serial-number="{ index }">
        {{ index + 1 }}
      </template>
      <template v-slot:operation="{ item }">
        <v-btn
          small
          text
          color="primary"
          class="my-2"
          @click="
            HConfirmShow = true
            HConfirmItem = item
          "
          >删除配置</v-btn
        >
      </template>
    </h-table>
    <h-dialog v-if="dialogFlag" v-model="dialogFlag">
      <create-configure-dialog slot="dialog-content"></create-configure-dialog>
    </h-dialog>
    <h-confirm v-if="HConfirmShow" v-model="HConfirmShow" @hconfirm="deleteConfigure" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import { returnDataType } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import HDialog from '@/components/h-dialog.vue'
import CreateConfigureDialog from './childComponent/createConfigureDialog.vue'
import { SystemConfigFormObj } from '@/type/system-config.type'
import HConfirm from '@/components/h-confirm.vue'
import util from '@/decorator/utilsDecorator'

@Component({
  components: {
    HTable,
    HDialog,
    CreateConfigureDialog,
    HConfirm
  }
})
@http
@util
export default class SystemConfig extends Vue {
  @Provide('formProvide') private formObj = new Vue({
    data() {
      return {
        title: '',
        btnName: [] as string[],
        methodName: '',
        formObj: {
          type: '',
          typeInput: '',
          name: '',
          nameInput: '',
          value: ''
        }
      }
    }
  })
  private pageSize = 20
  private pageNum = 1
  private desserts: Array<unknown> = []
  private paginationLength = 0
  private querySystemName = ''
  private dialogFlag = false
  private headers = [
    {
      text: '序号',
      align: 'center',
      slot: 'serial-number'
    },
    {
      text: '配置名称',
      align: 'center',
      value: 'name'
    },
    {
      text: '配置属性',
      align: 'center',
      value: 'value'
    },
    {
      text: '配置类型',
      align: 'center',
      value: 'type'
    },
    {
      text: '操作',
      align: 'center',
      slot: 'operation'
    }
  ]
  private HConfirmShow = false
  private HConfirmItem = {
    id: ''
  }

  private searchSystem() {
    if (!this.querySystemName) {
      this.searchMethod(false, {
        pageSize: this.pageSize,
        pageNum: 1
      })
    } else {
      this.searchMethod(true, {
        name: this.querySystemName,
        pageSize: this.pageSize,
        pageNum: 1
      })
    }
    this.pageNum = 1
  }

  private addConfigure() {
    this.dialogFlag = true
    this.formObj.btnName = ['立即创建']
    this.formObj.title = '添加配置'
    this.formObj.methodName = 'addConfigureCallBack'
  }

  private async addConfigureCallBack(formObj: SystemConfigFormObj) {
    const { name, nameInput, type, typeInput, value } = formObj
    const { success } = await this.h_request['httpPOST']<SystemConfigFormObj>('POST_SYSTEM_ADDCONFIG', {
      name: nameInput || name,
      type: typeInput || type,
      value: value
    })
    if (success) {
      this.searchMethod(false, {
        pageSize: this.pageSize,
        pageNum: 1
      })
      this.pageNum = 1
      return Promise.resolve(success)
    }
  }

  private async deleteConfigure() {
    if (!this.HConfirmItem.id) {
      return
    }
    const { success } = await this.h_request['httpGET']('GET_SYSTEM_DELCONFIG', { id: this.HConfirmItem.id })
    if (success) {
      this.HConfirmShow = false
      this.h_utils.alertUtil.open('配置删除成功', true, 'success')
      this.searchMethod(false, {
        pageSize: this.pageSize,
        pageNum: 1
      })
      this.pageNum = 1
    }
  }

  async searchMethod(bool: boolean, params: object): Promise<void> {
    const { data }: returnDataType = bool
      ? await this.h_request['httpGET']<object>('GET_SYSTEM_GETINFOBYTYPENAME', params)
      : await this.h_request['httpGET']<object>('GET_SYSTEM_FINDALL', params)
    this.paginationLength = Math.ceil(data['total'] / this.pageSize) || 1
    this.desserts = data['list']
  }

  private PaginationsNow(page: number) {
    this.pageNum = page
    this.searchMethod(false, {
      pageSize: this.pageSize,
      pageNum: this.pageNum
    })
  }

  created(): void {
    this.searchMethod(false, {
      pageSize: this.pageSize,
      pageNum: 1
    })
    this.pageNum = 1
  }
}
</script>
