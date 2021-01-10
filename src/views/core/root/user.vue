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
      <div style="height: 448px">
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
          <template [`v-slot:item.actions`]="{ item }">
            <v-icon small class="mr-4" @click="editItem(item)"> mdi-pencil </v-icon>
            <!--                        <v-icon-->
            <!--                        small-->
            <!--                        @click="deleteItem(item)"-->
            <!--                        >-->
            <!--                            mdi-delete-->
            <!--                        </v-icon>-->
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

    <h-dialog v-model="dialogFlag">
      <user-dialog slot="dialog-content"></user-dialog>
    </h-dialog>
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
import HDialog from '@/components/h-dialog.vue'
import UserDialog from './childComponent/userDialog.vue'
@Component({
  components: {
    HDialog,
    UserDialog
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
  @Provide('formProvide') private formObj = new Vue({
    data() {
      return {
        title: '',
        btnName: [''],
        methodName: '',
        formObj: {
          loginPwd: {
            text: '',
            reset: false,
            show: false
          },
          loginName: {
            text: '',
            reset: false,
            disabled: false
          },
          userType: {
            text: '',
            reset: false
          },
          userState: {
            text: '',
            reset: false
          },
          systemName: {
            text: '',
            value: '',
            reset: false
          },
          userId: {
            text: 1,
            value: 1,
            reset: false
          }
        },
        userId: ''
      }
    }
  })
  private dialogFlag = false
  private desserts: Array<userInfo> = []
  // private dessertsBF: Array<userInfo> = []
  private pageNum = 1
  private pageSize = 10
  private paginationLength = 1
  // private paginationLengthBF = 0
  private queryUserName = ''
  private tableShow = true
  // private tableFlag = true
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
    this.formObj.title = '创建用户'
    this.formObj.btnName = ['立即创建', '取消']
    this.formObj.methodName = 'addUser'
    this.formObj.formObj = {
      loginName: {
        text: '',
        reset: false,
        disabled: false
      },
      loginPwd: {
        text: '',
        reset: false,
        show: true
      },
      userType: {
        text: '',
        reset: false
      },
      userState: {
        text: '',
        reset: false
      },
      systemName: {
        text: '',
        value: '',
        reset: false
      },
      userId: {
        text: 1,
        value: 1,
        reset: false
      }
    }
  }

  private editItem(item: userInfo) {
    this.dialogFlag = true
    this.formObj.title = '用户信息编辑'
    this.formObj.btnName = ['立即修改', '取消']
    this.formObj.methodName = 'editUser'
    this.formObj.formObj = {
      loginName: {
        text: item.loginName,
        reset: true,
        disabled: true
      },
      loginPwd: {
        text: '',
        reset: false,
        show: false
      },
      userType: {
        text: item.userType.toString(),
        reset: false
      },
      userState: {
        text: item.userState.toString(),
        reset: false
      },
      systemName: {
        text: item.systemName,
        value: item.email,
        reset: false
      },
      userId: {
        text: item.id,
        value: item.id,
        reset: false
      }
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
    // this.desserts = this.dessertsBF
    // this.paginationLength = this.paginationLengthBF
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

  // 修改用户
  private async editUser(childObj: userFormObj) {
    const { loginName, userType, userState, systemName, userId } = childObj
    const { success } = await this.h_request['httpPUT']<dialogRequestStructure2>('POST_USER_UPDATE_USER', {
      loginName: loginName.text,
      userType: userType.text,
      userState: userState.text,
      systemName: systemName.value,
      id: userId.value
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

  private async addUser(childObj: userFormObj) {
    const { loginName, loginPwd, userType, userState, systemName } = childObj
    const { success } = await this.h_request['httpPOST']<dialogRequestStructure>('POST_USER_ADD_USER', {
      loginName: loginName.text,
      loginPwd: loginPwd.text,
      userType: userType.text,
      userState: userState.text,
      systemName: systemName.value
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
