<template>
    <div id="role">
        <v-row>
            <v-col cols="3">
                <v-text-field
                solo
                dense
                placeholder="请输入查找的角色名称"
                clearable
                append-icon="mdi-magnify"
                @click:append="searchRoles"
                v-model="queryRolesName"
                >

                </v-text-field>
            </v-col>
            <v-col cols="2">
                <v-btn
                color="primary"
                dark
                @click.stop="addItem"
                >
                添加
                </v-btn>
            </v-col>
        </v-row>
        <h-table
        :headers="headers"
        :desserts="desserts"
        :height="450"
        :pageNum="pageNum"
        :paginationLength="paginationLength"
        >
            <template v-slot:buttons="{item}">
                <v-btn
                small
                text
                color="success"
                class="my-2"
                @click="authItem(item)"
                >
                    授权
                </v-btn>
                <v-btn
                small
                text
                color="primary"
                class="my-2"
                @click="editItem(item)"
                >
                    编辑
                </v-btn>
                <v-btn
                text
                color="orange"
                small
                class="my-2"
                @click="deleteItem(item)"
                >
                    删除
                </v-btn>
            </template>
        </h-table>
        <h-dialog v-model="dialogFlag">
            <role-dialog slot="dialog-content" v-if="dialogShow"></role-dialog>
            <auth-dialog slot="dialog-content" v-else :roles="roles" ></auth-dialog>
        </h-dialog>
    </div>
</template>
<script lang="ts">
import { Component, Vue,Provide} from "vue-property-decorator";
import HTable from '../../../components/h-table.vue';
import http from '@/decorator/httpDecorator';
import util from '@/decorator/utilsDecorator';
import { httpAllParams, paramsType } from '../../../type/http-request.type';
import HDialog from '../../../components/h-dialog.vue';
import RoleDialog from './childComponent/roleDialog.vue';
import { RoleFormObj } from '../../../type/role.type';
import AuthDialog from './childComponent/authDialog.vue';

@Component({
    components:{
        HTable,
        HDialog,
        RoleDialog,
        AuthDialog
    }
})
@http
@util
export default class Role extends Vue{
     @Provide("formProvide") private formObj = new Vue({
        data(){
            return{
                title:"",
                btnName:([] as string[]),
                methodName:"",
                formObj:{
                    name:"",
                    id:"",
                    roles:([] as number[])
                }
            }
        }
    })

    private dialogFlag:boolean = false
    private dialogShow:boolean = true
    private pageNum:number = 1
    private pageSize:number = 20
    private paginationLength:number = 0
    private desserts:Array<any> = []
    private roles:Array<any> = []
    private queryRolesName:string = ""
    private headers = [
        {
            text:"角色ID",
            align:"center",
            value:"id"
        },
        {
            text:"角色名称",
            align:"center",
            value:"name"
        },
        {
            text:"创建时间",
            align:"center",
            value:"gmtCreated",
            format:(time:number)=>{
                return this.h_utils.timeutil.stamptoTime(time,"-")
            }
        },
        {
            text:"更新时间",
            align:"center",
            value:"gmtUpdated",
            format:(time:number)=>{
                return this.h_utils.timeutil.stamptoTime(time,"-")
            }
        },
        {
            text:"操作",
            align:"center",
            slot:"buttons"
        },
    ]

    private async searchMethod(bool:boolean,params?:object){
        const {data} = bool?await this.h_request["httpGET"]<object>("GET_ROLE_FIND_ALL_ROLE_BY_PARAM",params as object):await this.h_request["httpGET"]<object>("GET_ROLE_FIND_ALL_ROLE",params as object)
        const {list,total} = data
        this.desserts = list
        this.paginationLength = Math.floor((total/this.pageSize)+1)
    }

    private searchRoles(){
        if(this.queryRolesName == ""){
            this.searchMethod(false,{
                pageNum:this.pageNum,
                pageSize:this.pageSize
            })
        }else{
            this.searchMethod(true,{
                name:this.queryRolesName,
                pageNum:this.pageNum,
                pageSize:this.pageSize
            })
        }
    }

    private addItem(){
        this.dialogFlag = true
        this.dialogShow = true
        this.formObj.title = "新建角色"
        this.formObj.btnName = ["立即创建"]
        this.formObj.methodName = "addRole"
    }
    // 删除角色
    private async deleteItem(item:any){
        const {data} = await this.h_request["httpGET"]("GET_ROLE_DELETE",{},item.id)
        this.searchMethod(false,{
            pageNum:this.pageNum,
            pageSize:this.pageSize
        })
    }

    private editItem(item:any){
        this.dialogFlag = true
        this.dialogShow = true
        this.formObj.title = "编辑角色"
        this.formObj.btnName = ["立即修改"]
        this.formObj.methodName = "editRole"
        this.formObj.formObj.name = item.name
        this.formObj.formObj.id = item.id
    }

    private getActionRoles(data:Array<any>):Array<number>{
        return data.map((item)=>{
            return item.id
        })
    }

    private async authItem(item:any){
        const {data} = await this.h_request["httpGET"]("GET_PERMISSION_AUTHORIZATION_FINDPERMISSIONLISTBYROLEID",{},item.id)
        this.dialogFlag = true
        this.dialogShow = false
        this.formObj.title = "角色授权"
        this.formObj.btnName = ["提交授权","取消"]
        this.formObj.methodName = "authRole"
        this.formObj.formObj.id = item.id
        this.formObj.formObj.roles = this.getActionRoles(data)
    }

    private addRole(formObj:RoleFormObj){
        const {name} = formObj
        return new Promise( async(resolve,reject):Promise<any>=>{
            const {success} = await this.h_request["httpPOST"]<RoleFormObj>("POST_ROLE_ADDROLE",{
                name
            })
            if(success){
                this.searchMethod(false,{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                })
            }
            resolve(success)
        })
    }

    private editRole(formObj:RoleFormObj){
        const {name,id} = formObj
        return new Promise( async(resolve,reject):Promise<void>=>{
            const {success} = await this.h_request["httpPUT"]<RoleFormObj>("PUT_ROLE_UPDATEROLE",{
                name,
                id
            })
            if(success){
                this.searchMethod(false,{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                })
            }
            resolve(success)
        })
    }

    private authRole(formObj:RoleFormObj){

        const{roles,id} = formObj
        return new Promise( async(resolve,reject):Promise<void>=>{
            const {success} = await this.h_request["httpPOST"]<RoleFormObj>("POST_PERMISSION_AUTHORIZATION_ADDROLEIDPERMISSIONID",{
                roleId:id,
                perssionId:roles
            })
            resolve(success)
        })
    }

    private getRoles(data:any):Array<any>{
        let arr:Array<any> = []
        data.forEach((item:any) => {
            if(item.childrenList&&item.childrenList.length>0){
                arr.push({
                    id:item.id,
                    name:item.name,
                    children:this.getRoles(item.childrenList)
                })
            }else{
                arr.push({
                    id:item.id,
                    name:item.name
                })
            }
        });
        return arr
    }

    async created() {
        const [{data:data1},{data:data2}] = await this.h_request["httpAll"]<httpAllParams>([
            {
                name:"GET_ROLE_FIND_ALL_ROLE",
                method:"get",
                data:{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                }
            },
            {
                name:"GET_PERMISSION_AUTHORIZATION_FIND_ALL_PERMISSION",
                method:"get",
                data:{}
            }
        ])
        this.desserts = data1.list
        this.paginationLength = Math.floor((data1["total"]/this.pageSize)+1)
        this.roles = this.getRoles(data2)
    }
}
</script>
