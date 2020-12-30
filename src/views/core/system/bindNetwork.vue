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
            <v-col cols="2">
                <v-btn
                color="primary"
                dark
                @click.stop="bindNet"
                >
                绑定网络
                </v-btn>
            </v-col>
        </v-row>
        <h-table
        :headers="headers"
        :desserts="desserts"
        :height="450"
        :pageNum="pageNum"
        @PaginationsNow="PaginationsNow"
        :paginationLength="paginationLength"
        >
            <template v-slot:operation="{item}">
                <v-btn
                small
                text
                color="primary"
                class="my-2"
                @click="relieveNetWork(item)"
                >
                    解绑网络
                </v-btn>
            </template>
        </h-table>
        <h-dialog v-model="dialogFlag">
            <bind-net-dialog slot="dialog-content"></bind-net-dialog>
        </h-dialog>
    </div>
</template>
<script lang="ts">
import { Component, Vue,Provide} from "vue-property-decorator";
import HTable from '../../../components/h-table.vue';
import { returnDataType } from '../../../type/http-request.type';
import http from '@/decorator/httpDecorator';
import HDialog from '../../../components/h-dialog.vue';
import BindNetDialog from './childComponent/bindNetDialog.vue';
import {ResourcesFormObj} from "@/type/resources.type";
import {BindNetworkObj} from "@/type/bindNetwork";

@Component({
    components:{
        HTable,
        HDialog,
        BindNetDialog
    }
})
@http
export default class BindNetwork extends Vue{
    @Provide("formProvide") private formObj = new Vue({
        data(){
            return{
                title:"",
                btnName:([] as string[]),
                methodName:"",
                formObj:{
                    networkId:"",
                    networkName:"",
                    systemId:"",
                    systemName:""
                }
            }
        }
    })

    private pageSize:number = 20
    private pageNum:number = 1
    private desserts:Array<any> = []
    private paginationLength:number = 0
    private dialogFlag:boolean = false
    private querySystemName = null
    private headers = [
        {
            text:"系统ID",
            align:"center",
            value:"systemId"
        },
        {
            text:"系统名称",
            align:"center",
            value:"systemName"
        },
        {
            text:"网络Id",
            align:"center",
            value:"networkId"
        },
        {
            text:"网络名称",
            align:"center",
            value:"networkName"
        },
        {
            text:"操作",
            align:"center",
            slot:"operation"
        }
    ]

    async searchMethod(bool:boolean,params:object){
        const {data}: returnDataType = bool?await this.h_request["httpGET"]<object>("GET_SYSNET_GETBINDBYNAME",params):await this.h_request["httpGET"]<object>("GET_SYSNET_GETBINDLIST",params)
        this.paginationLength = Math.ceil((data["total"]/this.pageSize))
        this.desserts = data["list"]
    }

    private searchSystemName(){
        if(!this.querySystemName){
            this.searchMethod(false,{
                pageSize:this.pageSize,
                pageNum:this.pageNum
            })
        }else{
            this.searchMethod(true,{
                type:"system",
                name:this.querySystemName,
                pageSize:this.pageSize,
                pageNum:this.pageNum
            })
        }
    }

    private bindNet(){
        this.dialogFlag = true
        this.formObj.btnName = ["立即绑定"]
        this.formObj.title = "绑定网络"
        this.formObj.methodName = "bindNetCallBack"
    }

    private bindNetCallBack(formObj:any){
        return new Promise( async(resolve,reject):Promise<any>=>{
            const {success} = await this.h_request["httpPOST"]<BindNetworkObj>("GET_SYSNET_ADDBINDINFO",{
                systemId:formObj.systemId,
                systemName:formObj.systemName,
                networkId:formObj.networkId,
                networkName:formObj.networkName
            })
            if(success){
                this.searchMethod(false,{
                    pageSize:this.pageSize,
                    pageNum:this.pageNum
                })
            }
            resolve(success)
        })
    }


    private async relieveNetWork(formObj:any){
        const {data} = await this.h_request["httpPOST"]("POST_SYSNET_DELETEBINDINFO",{
            systemId:formObj.systemId,
            systemName:formObj.systemName,
            networkId:formObj.networkId,
            networkName:formObj.networkName
        })
        this.searchMethod(false,{
            pageSize:this.pageSize,
            pageNum:this.pageNum
        })
    }

    private PaginationsNow(page: number) {
        this.pageNum = page;
        this.searchMethod(false,{
            pageSize: this.pageSize,
            pageNum: this.pageNum,
        });
    }
    
    created() {
        this.searchMethod(false,{
            pageSize:this.pageSize,
            pageNum:this.pageNum
        })
    }
}
</script>
