<template>
  <div id="user">
    <v-row>
      <HSearch
        v-model="queryUserName"
        placeholder="请输入查找的账号名称"
        @append="searchUserList"
        @enter="searchUserList"
        @clear="
          searchMethod(false, {
            pageSize: pageSize,
            pageNum: pageNum
          })
        "
      />
      <v-col>
        <v-btn color="primary" depressed small dark @click.stop="addItem">添加用户</v-btn>
      </v-col>
    </v-row>

    <h-table
      :headers="headers"
      :desserts="desserts"
      :pageNum="pageNum"
      :loading="loading"
      @PaginationNow="PaginationNow"
      :paginationLength="paginationLength"
    >
      <template v-slot:buttons="{ item }">
        <v-btn text color="primary" @click="editItem(item)">编辑</v-btn>
      </template>
    </h-table>

    <f-dialog v-if="dialogFlag" v-model="dialogFlag">
      <user-dialog />
    </f-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { paramsType, returnType } from '@/type/http-request.type'
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
import FDialog from '@/components/f-dialog.vue'
import { FormObj } from '@/type/dialog-form.type'
import HTable from '@/components/h-table.vue'
import HSearch from '@/components/h-search.vue'
import { mdiMagnify } from '@mdi/js'

@Component({
  components: {
    UserDialog,
    FDialog,
    HTable,
    HSearch
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
  private desserts: Array<userInfo> = []
  private pageNum = 1
  private pageSize = 10
  private paginationLength = 1
  private queryUserName = ''
  private loading = true
  private headers = [
    {
      text: '账号ID',
      align: 'center',
      value: 'id'
    },
    {
      text: '账号名称',
      align: 'start',
      value: 'loginName'
    },
    {
      text: '创建时间',
      align: 'center',
      value: 'gmtCreated',
      format: (n: number) => {
        return this.h_utils.timeUtil.stamptoTime(n, '-')
      }
    },
    {
      text: '用户类型',
      align: 'start',
      value: 'phone'
    },
    {
      text: '用户状态',
      align: 'center',
      value: 'userState',
      format: (n: number) => {
        return this.h_enum['userState'][n]
      }
    },
    {
      text: '系统名称',
      align: 'center',
      value: 'systemName'
    },
    {
      text: '用户Token',
      align: 'start',
      value: 'userToken'
    },
    {
      text: '操作',
      align: 'center',
      slot: 'buttons'
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
      userId: item.id,
      canNotEdit: true
    }
  }

  private async searchMethod(bool: boolean, params: paramsType): Promise<void> {
    this.loading = true

    const { data }: returnType = bool
      ? await this.h_request['httpGET']<paramsType>('GET_USER_FIND_ALL_USER_BY_PARAM', params)
      : await this.h_request['httpGET']<paramsType>('GET_USER_FIND_ALL_USER', params)
    this.desserts = data ? [...data.list] : []
    this.paginationLength = Math.ceil(data?.total / this.pageSize) || 1
    this.loading = false
  }

  private PaginationNow(nowPage: number): void {
    this.pageNum = nowPage
    const params: paramsType = {
      pageSize: this.pageSize,
      pageNum: this.pageNum
    }
    this.searchMethod(true, params)
  }

  // private tableAfterEnter(): void {
  //   this.tableShow = true
  // }

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
    // 如果是添加 验重
    if (!formObj.canNotEdit && formObj.loginName) {
      const text = await this.h_utils['noRepeat'].loginName(formObj.loginName)

      if (text === undefined) {
        // 网络错误
        return
      } else if (text) {
        // 如果重复，阻止提交
        this.h_utils.alertUtil.open(text, true, 'error')
        return
      }
    }

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
