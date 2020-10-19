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
                v-model="queryResourcesName"
                >

                </v-text-field>
            </v-col>
            <v-col cols="2">
                <v-btn
                color="primary"
                dark
                @click.stop="addItem"
                >
                添加权限
                </v-btn>
            </v-col>
        </v-row>
        <h-table
        :max-height="500"
        :headers="headers"
        :desserts="desserts"
        >
            <template v-slot:buttons="{item}">
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
            <resources-dialog slot="dialog-content" :desserts="desserts"></resources-dialog>
        </h-dialog>
    </div>
</template>
<script lang="ts">
import { Component, Vue,Provide} from "vue-property-decorator";
import { paramsType, returnDataType } from '../../../type/http-request.type';
import http from '../../../decorator/httpDecorator';
import HTable from '../../../components/h-table.vue';
import HDialog from '../../../components/h-dialog.vue';
import ResourcesDialog from './childComponent/resourcesDialog.vue';
import { ResourcesFormObj } from '../../../type/resources.type';
import util from '@/decorator/utilsDecorator';

@Component({
    components:{
        HTable,
        HDialog,
        ResourcesDialog
    }
})
@http
@util
export default class Resources extends Vue{

    @Provide("formProvide") private formObj = new Vue({
        data(){
            return{
                title:"",
                btnName:[""],
                methodName:"",
                formObj:{
                    name:"",
                    url:"",
                    parentid:null,
                    type:"",
                    id:""
                }
            }
        }
    })

    private queryResourcesName:string = ""
    private desserts:Array<any> = []
    private dialogFlag:boolean = false

    private headers = [
        {
            text:"权限名称",
            align: "left",
            value:"name",
            expand:true
        },
        {
            text:"权限地址",
            align:"center",
            value:"url"
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
        }
    ]


    private async searchMethod(bool:boolean,params?:object){

        const {data}:returnDataType = bool?await this.h_request["httpGET"]<object>("GET_PERMISSION_FIND_ALL_PERMISSION_BY_PARAM",params as object):await this.h_request["httpGET"]("GET_PERMISSION_FIND_ALL_PERMISSION",{})
        this.desserts = data
    }

    private searchResources(){
        if(this.queryResourcesName==""){
            this.searchMethod(false)
        }else{
            this.searchMethod(true,{name:this.queryResourcesName})
        }
    }


    private addItem(){
        this.dialogFlag = true
        this.formObj.title = "" +
            "添加权限"
        this.formObj.btnName = ["立即创建","取消"]
        this.formObj.methodName = "addResources"
    }

    private editItem(item:any){
        this.dialogFlag = true
        this.formObj.title = "权限修改"
        this.formObj.btnName = ["立即修改","取消"]
        this.formObj.methodName = "updataResources"
        this.formObj.formObj = {
            name:item.name,
            url:item.url,
            parentid:null,
            type:item.type,
            id:item.id
        }
    }

    private async deleteItem(item:any){
        const {success} = await this.h_request["httpGET"]("GET_PERMISSION_DELETE",{},item.id)
        if(success){
            this.searchMethod(false)
        }
    }


    private addResources(formObj:ResourcesFormObj){
        const {name,url,parentid,type} = formObj
        return new Promise( async(resolve,reject):Promise<any>=>{
            const {success} = await this.h_request["httpPOST"]<ResourcesFormObj>("POST_PERMISSION_ADD_PERMISSION",{
                name,
                url,
                parentid,
                type
            })
            if(success){
                this.searchMethod(false)
            }
            resolve(success)
        })
    }

    private updataResources(formObj:ResourcesFormObj){
        const {name,url,parentid,type,id} = formObj
        return new Promise( async(resolve,reject):Promise<any>=>{
            const {success} = await this.h_request["httpPUT"]<ResourcesFormObj>("PUT_PERMISSION_UPDATE_PERMISSION",{
                name,
                url,
                parentid,
                type,
                id
            })
            if(success){
                this.searchMethod(false)
            }
            resolve(success)
        })
    }

    created() {
        this.searchMethod(false)
    }
}
</script>
