<template>
  <div id="user">
    <v-row>
      <v-col cols="3">
        <v-text-field
          v-model.trim="queryUserName"
          solo
          dense
          placeholder="请输入查找的账号名称"
          clearable
          append-icon="mdi-magnify"
          @click:append="searchUserList"
        >
        </v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn color="primary" height="38" dark @click.stop="addItem">添加用户</v-btn>
      </v-col>
    </v-row>
    <transition name="table" @after-leave="tableAfterEnter" style="background: #fff">
      <div>
        <v-data-table
          :headers="headers"
          :items="desserts"
          class="elevation-1"
          hide-default-footer
          item-key="name"
          dense
          :items-per-page="10"
          v-show="tableShow"
        >
          <template v-slot:[`item.gmtCreated`]="{ item }">
            {{ h_utils.timeutil.stamptoTime(item.gmtCreated, '-') }}
          </template>
          <template v-slot:[`item.userState`]="{ item }">
            {{ h_enum['userState'][item.userState] }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small @click="editItem(item)">mdi-pencil</v-icon>
            <!-- <v-icon small @click="deleteItem(item)">mdi-delete</v-icon> -->
          </template>
        </v-data-table>
        <v-pagination
          :length="paginationLength"
          :total-visible="7"
          circle
          @input="handleCurrentChange"
          :value="pageNum"
        ></v-pagination>
      </div>
    </transition>
    <t-dialog v-if="dialogFlag" v-model="dialogFlag">
      <user-dialog />
    </t-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { paramsType, returnDataType } from '@/type/http-request.type'
import http from '@/decorator/httpDecorator'
import {
  userInfo,
  userParamsType,
  userFormObj,
  dialogRequestStructure,
  dialogRequestStructure2
} from '@/type/user.type'
import util from '@/decorator/utilsDecorator'
import Enum from '@/decorator/enumDecorator'
import UserDialog from './childComponent/userDialog.vue'
import TDialog from '@/components/t-dialog.vue'
import { FormObj } from '@/type/dialog-form.type'

@Component({
  components: {
    UserDialog,
    TDialog
  }
})
@http
@util
@Enum([
  {
    tsFileName: 'user-enum',
    enumName: 'userState'
  }
])
export default class User extends Vue {
  @Provide('formProvide') private formProvide: FormObj = {
    title: '' as string,
    btnName: [] as Array<string>,
    methodName: '' as string,
    formObj: {}
  }

  private dialogFlag = false
  private desserts: Array<userInfo> = []
  private pageNum = 1
  private pageSize = 10
  private paginationLength = 1
  private queryUserName = ''
  private tableShow = true

  private headers = [
    {
      text: '账号ID',
      align: 'center',
      sortable: false,
      value: 'id',
      divider: true
    },
    {
      text: '账号名称',
      align: 'start',
      sortable: false,
      value: 'loginName',
      divider: true
    },
    {
      text: '创建时间',
      align: 'center',
      sortable: false,
      value: 'gmtCreated',
      divider: true
    },
    {
      text: '用户类型',
      align: 'start',
      sortable: false,
      value: 'phone',
      divider: true
    },
    {
      text: '用户状态',
      align: 'center',
      sortable: false,
      value: 'userState',
      divider: true
    },
    {
      text: '系统名称',
      align: 'center',
      sortable: false,
      value: 'systemName',
      divider: true
    },
    {
      text: '用户Token',
      align: 'start',
      sortable: false,
      value: 'userToken',
      divider: true
    },
    {
      text: '操作',
      align: 'center',
      sortable: false,
      value: 'actions',
      divider: true
    }
  ]

  private addItem() {
    this.dialogFlag = true
    this.formProvide.title = '创建用户'
    this.formProvide.btnName = ['立即创建', '取消']
    this.formProvide.methodName = 'addUser'
    this.formProvide.formObj = {}
  }

  private editItem(item: userInfo) {
    this.dialogFlag = true
    this.formProvide.title = '用户信息编辑'
    this.formProvide.btnName = ['立即修改', '取消']
    this.formProvide.methodName = 'editUser'
    this.formProvide.formObj = {
      loginName: item.loginName,
      userType: { text: item.phone, value: item.userType.toString() },
      userState: item.userState.toString(),
      systemName: { text: item.systemName.toString(), value: item.email },
      userId: item.id
    }
  }

  private async searchMethod(bool: boolean, params: paramsType): Promise<void> {
    const { data }: returnDataType = bool
      ? await this.h_request['httpGET']<paramsType>('GET_USER_FIND_ALL_USER_BY_PARAM', params)
      : await this.h_request['httpGET']<paramsType>('GET_USER_FIND_ALL_USER', params)
    this.paginationLength = Math.ceil(data['total'] / this.pageSize) || 1
    this.desserts = data['list']
  }

  private handleCurrentChange(nowPage: number): void {
    this.pageNum = nowPage
    const params: paramsType = {
      pageSize: this.pageSize,
      pageNum: this.pageNum
    }
    this.searchMethod(true, params)
  }

  private tableAfterEnter(): void {
    this.tableShow = true
  }

  private searchUserList() {
    const params: userParamsType = {
      pageSize: this.pageSize,
      pageNum: 1,
      loginName: this.queryUserName ? this.queryUserName : null
    }
    this.searchMethod(true, params)
    this.pageNum = 1
  }

  // 添加用户
  private async addUser(formObj: userFormObj) {
    const { loginName, loginPwd, userType, userState, systemName } = formObj
    const { success } = await this.h_request['httpPOST']<dialogRequestStructure>('POST_USER_ADD_USER', {
      loginName,
      loginPwd,
      userType: userType.value || userType.toString(),
      userState,
      systemName: systemName.value || systemName.toString()
    })
    if (success) {
      const params: paramsType = {
        pageSize: this.pageSize,
        pageNum: 1
      }
      this.pageNum = 1
      this.searchMethod(false, params)
      return Promise.resolve(success)
    }
  }
  // 修改用户
  private async editUser(formObj: userFormObj) {
    const { loginName, userType, userState, systemName, userId } = formObj
    const { success } = await this.h_request['httpPUT']<dialogRequestStructure2>('POST_USER_UPDATE_USER', {
      loginName: loginName,
      userType: userType.value || userType.toString(),
      userState: userState,
      systemName: systemName.value || systemName.toString(),
      id: userId
    })
    if (success) {
      const params: paramsType = {
        pageSize: this.pageSize,
        pageNum: 1
      }
      this.pageNum = 1
      this.searchMethod(false, params)
      return Promise.resolve(success)
    }
  }

  created(): void {
    const params: paramsType = {
      pageSize: this.pageSize,
      pageNum: 1
    }
    this.pageNum = 1
    this.searchMethod(false, params)
  }
}
</script>

<style scoped>
.table-leave-to {
  opacity: 0;
  transform: translate3d(800px, 0, 0);
}
.table-enter {
  opacity: 0;
  transform: translate3d(800px, 0, 0);
}
.table-leave-active {
  transition: 0.5s all ease;
}
.table-enter-active {
  transition: 0.5s all ease;
}
</style>
