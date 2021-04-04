<template>
  <div id="role">
    <v-row>
      <HSearch
        v-model="queryRolesName"
        placeholder="请输入查找的角色名称"
        @append="searchRoles"
        @enter="searchRoles"
        @clear="
          searchMethod(false, {
            pageNum: pageNum,
            pageSize: pageSize
          })
        "
      />
      <v-col>
        <v-btn color="primary" small depressed dark @click.stop="addItem">添加角色</v-btn>
      </v-col>
    </v-row>
    <h-table
      :headers="headers"
      :desserts="desserts"
      :loading="loading"
      :pageNum="pageNum"
      :paginationLength="paginationLength"
    >
      <template v-slot:buttons="{ item }">
        <v-btn text color="primary" :loading="!!item.loading" @click="authItem(item)">授权</v-btn>
        <v-btn text color="primary" @click="editItem(item)">编辑</v-btn>
        <v-btn
          text
          color="primary"
          @click="
            HConfirmShow = true
            HConfirmItem = item
          "
          >删除
        </v-btn>
      </template>
    </h-table>
    <f-dialog v-if="dialogFlag" v-model="dialogFlag">
      <role-dialog v-if="dialogShow"></role-dialog>
      <auth-dialog v-else :roles="roles"></auth-dialog>
    </f-dialog>
    <h-confirm v-model="HConfirmShow" @hconfirm="deleteItem" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import HTable from '@/components/h-table.vue'
import http from '@/decorator/httpDecorator'
import util from '@/decorator/utilsDecorator'
import FDialog from '@/components/f-dialog.vue'
import RoleDialog from './childComponent/roleDialog.vue'
import { RoleFormObj } from '@/type/role.type'
import AuthDialog from './childComponent/authDialog.vue'
import HConfirm from '@/components/h-confirm.vue'
import { FormObj } from '@/type/dialog-form.type'
import { topicTable } from '@/type/topic.type'
import { mdiMagnify } from '@mdi/js'
import HSearch from '@/components/h-search.vue'
@Component({
  components: {
    HTable,
    FDialog,
    RoleDialog,
    AuthDialog,
    HConfirm,
    HSearch
  }
})
@http
@util
export default class Role extends Vue {
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
  private dialogFlag = false
  private dialogShow = true
  private pageNum = 1
  private pageSize = 20
  private paginationLength = 0
  private desserts: Array<topicTable> = []
  private loading = true
  private roles: Array<any> = []
  private queryRolesName = ''
  private headers = [
    {
      text: '角色ID',
      align: 'center',
      value: 'id'
    },
    {
      text: '角色名称',
      align: 'center',
      value: 'name'
    },
    {
      text: '创建时间',
      align: 'center',
      value: 'gmtCreated',
      format: (time: number) => {
        return this.h_utils.timeUtil.stamptoTime(time, '-')
      }
    },
    {
      text: '更新时间',
      align: 'center',
      value: 'gmtUpdated',
      format: (time: number) => {
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
    const { data } = bool
      ? await this.h_request['httpGET']<object>('GET_ROLE_FIND_ALL_ROLE_BY_PARAM', params as object)
      : await this.h_request['httpGET']<object>('GET_ROLE_FIND_ALL_ROLE', params as object)

    this.desserts = data ? [...data.list] : []
    this.paginationLength = Math.ceil(data?.total / this.pageSize) || 1

    this.loading = false
  }

  private searchRoles() {
    if (!this.queryRolesName) {
      this.searchMethod(false, {
        pageNum: 1,
        pageSize: this.pageSize
      })
    } else {
      this.searchMethod(true, {
        name: this.queryRolesName,
        pageNum: 1,
        pageSize: this.pageSize
      })
    }
    this.pageNum = 1
  }
  // 添加角色
  private addItem() {
    this.dialogFlag = true
    this.dialogShow = true
    this.formProvide.title = '新建角色'
    this.formProvide.btnName = ['立即创建']
    this.formProvide.methodName = 'addRole'
    this.formProvide.formObj = {}
  }

  private editItem(item: any) {
    this.dialogFlag = true
    this.dialogShow = true
    this.formProvide.title = '编辑角色'
    this.formProvide.btnName = ['立即修改']
    this.formProvide.methodName = 'editRole'
    this.formProvide.formObj = {
      id: item.id,
      name: item.name
    }
  }

  private getActionRoles(data: Array<any>): Array<number> {
    return data.map(item => {
      return item.id
    })
  }

  // 权限页面
  private async authItem(item: { id: number; loading: boolean }) {
    this.$set(item, `loading`, true)

    const { data } = await this.h_request['httpGET'](
      'GET_PERMISSION_AUTHORIZATION_FINDPERMISSIONLISTBYROLEID',
      {},
      item.id.toString()
    )
    if (data) {
      this.dialogFlag = true
      this.dialogShow = false
      this.formProvide.title = '角色授权'
      this.formProvide.btnName = ['提交授权', '取消']
      this.formProvide.methodName = 'authRole'
      this.formProvide.formObj.id = item.id
      this.formProvide.formObj.roles = this.getActionRoles(data)
    }

    this.$set(item, `loading`, false)
  }

  private async addRole(formObj: RoleFormObj) {
    const { name } = formObj
    const { success } = await this.h_request['httpPOST']<RoleFormObj>('POST_ROLE_ADDROLE', {
      name
    })
    if (success) {
      this.searchMethod(false, {
        pageNum: 1,
        pageSize: this.pageSize
      })
      this.pageNum = 1
      return Promise.resolve(success)
    }
  }

  private async editRole(formObj: RoleFormObj) {
    const { name, id } = formObj
    const { success } = await this.h_request['httpPUT']<RoleFormObj>('PUT_ROLE_UPDATEROLE', {
      name,
      id
    })
    if (success) {
      this.searchMethod(false, {
        pageNum: 1,
        pageSize: this.pageSize
      })
      this.pageNum = 1
      return Promise.resolve(success)
    }
  }

  private async authRole(formObj: RoleFormObj) {
    const { roles, id } = formObj
    const { success } = await this.h_request['httpPOST']<RoleFormObj>(
      'POST_PERMISSION_AUTHORIZATION_ADDROLEIDPERMISSIONID',
      {
        roleId: id,
        perssionId: roles
      }
    )
    return Promise.resolve(success)
  }

  private getRoles(data: any): Array<any> {
    const arr: Array<any> = []
    data.forEach((item: any) => {
      if (item.childrenList && item.childrenList.length > 0) {
        arr.push({
          id: item.id,
          name: item.name,
          children: this.getRoles(item.childrenList)
        })
      } else {
        arr.push({
          id: item.id,
          name: item.name
        })
      }
    })
    return arr
  }

  // 删除角色
  private async deleteItem() {
    const { success } = await this.h_request['httpGET']('GET_ROLE_DELETE', {}, this.HConfirmItem.id)
    if (success) {
      this.HConfirmShow = false
      this.h_utils.alertUtil.open('删除成功', true, 'success')
      this.searchMethod(false, {
        pageNum: 1,
        pageSize: this.pageSize
      })
      this.pageNum = 1
    }
  }

  async created(): Promise<void> {
    this.loading = true
    const [{ data: data1 }, { data: data2 }] = await this.h_request['httpAll']([
      {
        name: 'GET_ROLE_FIND_ALL_ROLE',
        method: 'get',
        data: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      },
      {
        name: 'GET_PERMISSION_AUTHORIZATION_FIND_ALL_PERMISSION',
        method: 'get',
        data: {}
      }
    ])

    this.desserts = data1 ? data1.list : []
    this.paginationLength = Math.ceil(data1?.total / this.pageSize) || 1
    data2 && (this.roles = this.getRoles(data2))
    this.loading = false
  }
}
</script>
