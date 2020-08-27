<template>
    <div id="topicSubExamine">
        <v-row>
            <v-col cols="3">
                <v-text-field
                solo
                dense
                placeholder="请输入要查询的订阅用户名"
                clearable
                append-icon="mdi-magnify"
                @click:append="searchExamine"
                v-model="queryExamineUser"
                >

                </v-text-field>
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
                color="primary"
                class="my-2"
                @click="dataStructure(item)"
                >
                    数据结构详情
                </v-btn>
            </template>
            <template v-slot:operation="{item}">
                <v-btn
                small
                text
                color="success"
                class="my-2"
                @click="examine(item,1)"
                >
                    审核通过
                </v-btn>
                <v-btn
                text
                color="red"
                small
                class="my-2"
                @click="examine(item,2)"
                >
                    审核拒绝
                </v-btn>
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
import { paramsType, returnDataType } from '../../../type/http-request.type';
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
}])
export default class TopicSubExamine extends Vue{
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
    private rowObj:object = {}
    private pageNum:number = 1
    private pageSize:number = 20
    private dialogFlag:boolean = false
    private paginationLength:number = 0
    private queryExamineUser:string = ""
    headers = [
        {
            text:"主题名称",
            align: "center",
            value:"topicName"
        },
        {
            text:"所属用户",
            align:"center",
            value:"belongUserName"
        },
        {
            text:"订阅用户",
            align:"center",
            value:"userName"
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
            text:"操作",
            align:"center",
            slot:"operation"
        }
    ]

     async searchMethod(bool:boolean,params:object){
        const {data}: returnDataType = bool?await this.h_request["httpGET"]<object>("GET_SUBMODERATIONS_SELECTBYUSERNAMESTATUS",params):await this.h_request["httpGET"]<object>("GET_SUB_MODERATIONS_SELECT_STATUS",params)
        this.paginationLength = Math.floor((data["total"]/this.pageSize)+1)
        this.desserts = data["list"]
    }

    private dataStructure(item:any){
        this.dialogFlag = true
        this.rowObj = item
        this.formObj.title = "数据结构详情"
    }

    private async examine(item:any,status:number){
        const {success} = await this.h_request["httpPOST"]("POST_SUBMODERATIONS_UPDATESUBMODERATION",{
            status:status,
            subUserId:item.subUserId,
            topicId:item.id
        })
        if(success){
            this.searchMethod(false,{
                pageSize:this.pageSize,
                pageNum:this.pageNum
            })
            this.queryExamineUser = ""
        }
    }

    private searchExamine(){
        if(this.queryExamineUser==""){
            this.searchMethod(false,{
                pageSize:this.pageSize,
                pageNum:1
            })
        }else{
            this.searchMethod(true,{
                userName:this.queryExamineUser,
                pageSize:this.pageSize,
                pageNum:1
            })
        }
    }

    created() {
        this.searchMethod(true,{
            pageSize:this.pageSize,
            pageNum:this.pageNum
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