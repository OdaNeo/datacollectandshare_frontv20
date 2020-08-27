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
            <v-col cols="2">
                <v-btn
                color="primary"
                dark
                @click.stop="addConfigure"
                >
                添加配置
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
            <template v-slot:serial-number="{index}">
                {{index+1}}
            </template>
            <template v-slot:operation="{item}">
                <v-btn
                small
                text
                color="primary"
                class="my-2"
                @click="deleteConfigure(item)"
                >
                    删除配置
                </v-btn>
            </template>
        </h-table>
        <h-dialog v-model="dialogFlag">
            <create-configure-dialog slot="dialog-content"></create-configure-dialog>
        </h-dialog>
    </div>
</template>
<script lang="ts">
import { Component, Vue,Provide } from "vue-property-decorator";
import HTable from '../../../components/h-table.vue';
import { returnDataType } from '../../../type/http-request.type';
import http from '@/decorator/httpDecorator';
import HDialog from '../../../components/h-dialog.vue';
import CreateConfigure from './childComponent/createConfigure.vue';
import CreateConfigureDialog from './childComponent/createConfigureDialog.vue';
import { SystemConfigFormObj } from '../../../type/system-config.type';

@Component({
    components:{
        HTable,
        HDialog,
        CreateConfigureDialog
    }
})
@http
export default class SystemConfig extends Vue{
    @Provide("formProvide") private formObj = new Vue({
        data(){
            return{
                title:"",
                btnName:([] as string[]),
                methodName:"",
                formObj:{
                    type:"",
                    typeInput:"",
                    name:"",
                    nameInput:"",
                    value:""
                }
            }
        }
    })
    private pageSize:number = 20
    private pageNum:number = 1
    private desserts:Array<any> = []
    private paginationLength:number = 0
    private querySystemName:string = ""
    private dialogFlag:boolean = false 
    private headers = [
        {
            text:"序号",
            align: "center",
            slot:"serial-number"
        },
        {
            text:"配置名称",
            align:"center",
            value:"name"
        },
        {
            text:"配置属性",
            align:"center",
            value:"value"
        },
        {
            text:"配置类型",
            align:"center",
            value:"type"
        },
        {
            text:"操作",
            align:"center",
            slot:"operation"
        }
    ]

    private searchSystem(){
        if(this.querySystemName==""){
            this.searchMethod(false,{
                pageSize:this.pageSize,
                pageNum:1
            })
        }else{
            this.searchMethod(true,{
                name:this.querySystemName,
                pageSize:this.pageSize,
                pageNum:1
            })
        }
    }

    private addConfigure(){
        this.dialogFlag = true
        this.formObj.btnName = ["立即创建"]
        this.formObj.title = "添加配置"
        this.formObj.methodName = "addConfigureCallBack"
    }

    private addConfigureCallBack(formObj:SystemConfigFormObj){
        const {name,nameInput,type,typeInput,value} = formObj
        return new Promise(async (resolve,reject):Promise<void>=>{
            const {success} = await this.h_request["httpPOST"]<SystemConfigFormObj>("POST_SYSTEM_ADDCONFIG",{
                name:formObj.nameInput?formObj.nameInput:formObj.name,
                type:formObj.typeInput?formObj.typeInput:formObj.type,
                value:formObj.value
            })
            if(success){
                this.searchMethod(false,{
                    pageSize:this.pageSize,
                    pageNum:1
                })
            }
            resolve(success)
        })
    }

    private async deleteConfigure(item:any){
        const {success} = await this.h_request["httpGET"]("GET_SYSTEM_DELCONFIG",{id:item.id})
        if(success){
            this.searchMethod(false,{
                pageSize:this.pageSize,
                pageNum:1
            })
        }
    }

    async searchMethod(bool:boolean,params:object){
        const {data}: returnDataType = bool?await this.h_request["httpGET"]<object>("GET_SYSTEM_GETINFOBYTYPENAME",params):await this.h_request["httpGET"]<object>("GET_SYSTEM_FINDALL",params)
        this.paginationLength = Math.floor((data["total"]/this.pageSize)+1)
        this.desserts = data["list"]
    }

    created() {
        this.searchMethod(false,{
            pageSize:this.pageSize,
            pageNum:this.pageNum
        })
    }
}
</script>