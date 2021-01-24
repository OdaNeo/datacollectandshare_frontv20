<template>
  <div id="resources">
    <v-row>
      <v-col cols="3">
        <v-text-field
          solo
          dense
          placeholder="请输入查找的权限名称"
          clearable
          append-icon="mdi-magnify"
          @click:append="searchResources"
          v-model.trim="queryResourcesName"
        >
        </v-text-field>
      </v-col>
      <v-col cols="9">
        <v-btn height="39" color="primary" dark @click.stop="addItem">添加权限</v-btn>
      </v-col>
    </v-row>
    <h-table :headers="headers" :desserts="desserts">
      <template v-slot:buttons="{ item }">
        <v-btn text color="primary" @click="editItem(item)">编辑</v-btn>
        <v-btn
          text
          color="primary"
          @click="
            HConfirmShow = true
            HConfirmItem = item
          "
          >删除</v-btn
        >
      </template>
    </h-table>
    <!-- <h-dialog v-if="dialogFlag" v-model="dialogFlag">
      <resources-dialog slot="dialog-content" :desserts="desserts"></resources-dialog>
    </h-dialog> -->
    <f-dialog v-if="dialogFlag" v-model="dialogFlag">
      <resources-dialog :desserts="desserts"></resources-dialog>
    </f-dialog>
    <h-confirm v-if="HConfirmShow" v-model="HConfirmShow" @hconfirm="deleteItem" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { returnDataType } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import HTable from '@/components/h-table.vue'
import FDialog from '@/components/f-dialog.vue'
import ResourcesDialog from './childComponent/resourcesDialog.vue'
import { ResourcesFormObj } from '@/type/resources.type'
import util from '@/decorator/utilsDecorator'
import HConfirm from '@/components/h-confirm.vue'
import { FormObj } from '@/type/dialog-form.type'

@Component({
  components: {
    HTable,
    FDialog,
    ResourcesDialog,
    HConfirm
  }
})
@http
@util
export default class Resources extends Vue {
  @Provide('formProvide') private formProvide: FormObj = {
    title: '' as string,
    btnName: [] as Array<string>,
    methodName: '' as string,
    formObj: {}
  }

  private queryResourcesName = ''
  private desserts: Array<unknown> = []
  private dialogFlag = false

  private headers = [
    {
      text: '权限名称',
      align: 'left',
      value: 'name',
      expand: true
    },
    {
      text: '权限地址',
      align: 'center',
      value: 'url'
    },
    {
      text: '创建时间',
      align: 'center',
      value: 'gmtCreated',
      format: (time: number) => {
        return this.h_utils.timeutil.stamptoTime(time, '-')
      }
    },
    {
      text: '更新时间',
      align: 'center',
      value: 'gmtUpdated',
      format: (time: number) => {
        return this.h_utils.timeutil.stamptoTime(time, '-')
      }
    },
    {
      text: '操作',
      align: 'center',
      slot: 'buttons'
    }
  ]
  private HConfirmShow = false
  private HConfirmItem = { id: '' }

  private async searchMethod(bool: boolean, params?: object) {
    const { data }: returnDataType = bool
      ? await this.h_request['httpGET']<object>('GET_PERMISSION_FIND_ALL_PERMISSION_BY_PARAM', params as object)
      : await this.h_request['httpGET']('GET_PERMISSION_FIND_ALL_PERMISSION', {})
    this.desserts = data
  }

  private searchResources() {
    if (!this.queryResourcesName) {
      this.searchMethod(false)
    } else {
      this.searchMethod(true, { name: this.queryResourcesName })
    }
  }

  private addItem() {
    this.dialogFlag = true
    this.formProvide.title = '添加权限'
    this.formProvide.btnName = ['立即创建', '取消']
    this.formProvide.methodName = 'addResources'
    this.formProvide.formObj = {}
  }

  private editItem(item: { name: string; url: string; type: string; id: string; parentid: number | null }) {
    this.dialogFlag = true
    this.formProvide.title = '权限修改'
    this.formProvide.btnName = ['立即修改', '取消']
    this.formProvide.methodName = 'updataResources'
    this.formProvide.formObj = {
      name: item.name,
      url: item.url,
      parentid: item.parentid,
      type: item.type,
      id: item.id
    }
  }

  private async deleteItem() {
    const { success } = await this.h_request['httpGET']('GET_PERMISSION_DELETE', {}, this.HConfirmItem.id)
    if (success) {
      this.HConfirmShow = false
      this.h_utils.alertUtil.open('删除成功', true, 'success')
      this.searchMethod(false)
    }
  }

  private async addResources(formObj: ResourcesFormObj) {
    const { name, url, parentid, type } = formObj
    const { success } = await this.h_request['httpPOST']<ResourcesFormObj>('POST_PERMISSION_ADD_PERMISSION', {
      name,
      url,
      parentid,
      type
    })
    if (success) {
      this.searchMethod(false)
      return Promise.resolve(success)
    }
  }

  private async updataResources(formObj: ResourcesFormObj) {
    const { name, url, parentid, type, id } = formObj
    const { success } = await this.h_request['httpPUT']<ResourcesFormObj>('PUT_PERMISSION_UPDATE_PERMISSION', {
      name,
      url,
      parentid,
      type,
      id
    })
    if (success) {
      this.searchMethod(false)
      return Promise.resolve(success)
    }
  }

  created(): void {
    this.searchMethod(false)
  }
}
</script>
