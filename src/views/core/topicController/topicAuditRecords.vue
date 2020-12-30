<template>
    <div id="topicAuditRecords">
        <v-row>
            <v-col cols="3">
                <v-text-field
                solo
                dense
                placeholder="请输入要查询的主题ID"
                clearable
                append-icon="mdi-magnify"
                @click:append="searchTopicID"
                v-model="queryTopicID"
                >

                </v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="10" style="padding:0 12px 12px">
                <v-btn 
                class="ma-2" 
                outlined 
                :color="btnAction==index?'primary':''"
                v-for="(btnName,index) in btnNames"
                :key="index"
                @click="btnClickMethod(index)"
                >{{btnName}}</v-btn>
            </v-col>
        </v-row>
        <h-table
        :headers="headers"
        :desserts="desserts"
        :height="400"
        :pageNum="pageNum"
        :paginationLength="paginationLength"
        >
            <template v-slot:buttons="{item}">
                <v-btn
                small
                text
                color="primary"
                class="my-2"
                @click="dataStructure(item)"
                >
                    数据结构详情
                </v-btn>
            </template>
            <template v-slot:examineType="{}">
                <span :style="'color:'+colors[btnAction]">{{h_enum["examineType"][btnAction]}}</span>
            </template>
        </h-table>
        <h-dialog v-model="dialogFlag">
            <data-structure-dialog slot="dialog-content" :rowObj="rowObj"></data-structure-dialog>
        </h-dialog>
    </div>
</template>
<script lang="ts">
import { Component, Vue,Provide } from "vue-property-decorator";
import { VueConstructor } from 'vue';
import {paramsType,returnDataType} from "../../../type/http-request.type"
import http from "../../../decorator/httpDecorator";
import { topicTable } from '../../../type/topic.type';
import HTable from '../../../components/h-table.vue';
import util from '@/decorator/utilsDecorator';
import Enum from '@/decorator/enumDecorator';
import HDialog from '../../../components/h-dialog.vue';
import DataStructureDialog from './childComponent/dataStructureDialog.vue';
@Component({
    components:{
        HTable,
        HDialog,
        DataStructureDialog
    }
})
@http
@util
@Enum([{
    tsFileName:"topic-list-enum",
    enumName:"queneType"
},{
    tsFileName:"topic-audit-enum",
    enumName:"examineType"
}])
export default class TopicAuditRecords extends Vue{
    @Provide("formProvide") private formObj = new Vue({
        data(){
            return{
                title:"",
                btnName:([] as string[]),
                methodName:"",
                formObj:{
                }
            }
        }
    })
    private desserts:Array<topicTable> = []
    private btnNames:Array<string> = ["未审核","已通过","已拒绝"]
    private colors:Array<string> = ["#e6a23c","#67c23a","#f56c6c"]
    private btnAction:number = 0
    private rowObj:object = {}
    private pageNum:number = 1
    private pageSize:number = 20
    private paginationLength:number = 0
    private dialogFlag:boolean = false 
    private queryTopicID:string = ""
    headers = [
        {
            text:"主题ID",
            align: "center",
            value:"id"
        },
        {
            text:"主题名称",
            align:"center",
            value:"topicName"
        },
        {
            text:"所属用户",
            align:"center",
            value:"belongUserName"
        },
        {
            text:"订阅时间",
            align:"center",
            value:"subscribe",
            format:(time:number)=>{
                return this.h_utils.timeutil.stamptoTime(time,"-")
            }
        },
        {
            text:"审核时间",
            align:"center",
            value:"auditTime",
            format:(time:number)=>{
                return time?this.h_utils.timeutil.stamptoTime(time,"-"):""
            }
        },
        {
            text:"消息类型",
            align:"center",
            value:"queneType",
            format:(quene:number)=>{
                return this.h_enum["queneType"][quene]
            }
        },
        {
            text:"数据结构",
            align:"center",
            slot:"buttons"
        },
        {
            text:"审核状态",
            align:"center",
            slot:"examineType"
        }
    ]

    async searchMethod(bool:boolean,params:object){
        const {data}: returnDataType = bool?await this.h_request["httpGET"]<object>("GET_SUBMODERATIONS_SELECTAUDITSTATUSBYTOPICID",params):await this.h_request["httpGET"]<object>("GET_SUB_MODERATIONS_SELECT_AUDIT_STATUS",params)
        this.paginationLength = Math.ceil((data["total"]/this.pageSize))
        this.desserts = data["list"]
    }

    private dataStructure(item:any){
        this.dialogFlag = true
        this.rowObj = item
        this.formObj.title = "数据结构详情"
    }

    private btnClickMethod(index:number){
        this.searchMethod(false,{
            pageSize:this.pageSize,
            pageNum:1,
            status:index
        })
        this.btnAction = index
    }

    private searchTopicID(){
        if(this.queryTopicID==""){
            this.searchMethod(false,{
                pageSize:this.pageSize,
                pageNum:1,
                status:this.btnAction
            })
        }else{
            this.searchMethod(true,{
                topicId:this.queryTopicID,
                pageSize:this.pageSize,
                pageNum:1,
                status:this.btnAction
            })
        }
    }

    created() {
        this.searchMethod(false,{
            pageSize:this.pageSize,
            pageNum:this.pageNum,
            status:this.btnAction
        })
    }
}
</script>
<style scoped>
.table-leave-to{
    opacity:0;
    transform: translate3d(800px,0,0);
}
.table-enter{
    opacity:0;
    transform: translate3d(800px,0,0);
}
.table-leave-active{
    transition: .5s all ease;
}
.table-enter-active{
    transition: .5s all ease;
}
</style>