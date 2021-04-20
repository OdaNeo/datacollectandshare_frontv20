<template>
  <div id="resources">
    <v-row>
      <HSearch
        v-model="queryResourcesName"
        label="请输入查找的权限名称"
        @append="searchResources"
        @enter="searchResources"
        @clear="searchMethod(false)"
      />
      <v-col>
        <v-btn color="primary" depressed small dark @click.stop="addItem">添加权限</v-btn>
      </v-col>
    </v-row>
    <h-table :headers="headers" :desserts="desserts" :loading="loading">
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
    <f-dialog v-if="dialogFlag" v-model="dialogFlag">
      <resources-dialog :desserts="desserts"></resources-dialog>
    </f-dialog>
    <h-confirm v-model="HConfirmShow" @hconfirm="deleteItem" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { returnType } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import HTable from '@/components/h-table.vue'
import FDialog from '@/components/h-dialog.vue'
import ResourcesDialog from './childComponent/resourcesDialog.vue'
import { ResourcesFormObj } from '@/type/resources.type'
import util from '@/decorator/utilsDecorator'
import HConfirm from '@/components/h-confirm.vue'
import { FormObj } from '@/type/dialog-form.type'
import { topicTable } from '@/type/topic.type'
import { mdiMagnify } from '@mdi/js'
import HSearch from '@/components/h-search.vue'

@Component({
  components: {
    HTable,
    FDialog,
    ResourcesDialog,
    HConfirm,
    HSearch
  }
})
@http
@util
export default class Resources extends Vue {
  @Provide('formProvide') private formProvide: FormObj = new Vue({
    data() {
      return {
        title: '',
        btnName: [] as string[],
        methodName: '',
        formObj: {}
      }
    }
  })
  mdiMagnify = mdiMagnify
  private queryResourcesName = ''
  private desserts: Array<topicTable> = []
  private dialogFlag = false
  private loading = true
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
      format: (time: string) => {
        return this.h_utils.timeUtil.stamptoTime(time, '-')
      }
    },
    {
      text: '更新时间',
      align: 'center',
      value: 'gmtUpdated',
      format: (time: string) => {
        return this.h_utils.timeUtil.stamptoTime(time, '-')
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
    this.loading = true
    const { data }: returnType = bool
      ? await this.h_request['httpGET']<object>('GET_PERMISSION_FIND_ALL_PERMISSION_BY_PARAM', params as object)
      : await this.h_request['httpGET']('GET_PERMISSION_FIND_ALL_PERMISSION', {})

    this.desserts = data ? [...data] : []
    this.loading = false
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
    this.formProvide.title = '修改权限'
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
