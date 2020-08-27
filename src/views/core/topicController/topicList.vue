<template>
    <div id="topicList">
        <v-row>
            <v-col cols="3">
                <v-text-field
                solo
                dense
                placeholder="请输入查找的主题ID"
                clearable
                append-icon="mdi-magnify"
                @click:append="searchTopic"
                v-model="queryTopicID"
                >

                </v-text-field>
            </v-col>
            <v-col cols="2">
                <v-btn
                color="primary"
                dark
                @click.stop="createTopic"
                >
                    创建主题
                </v-btn>
            </v-col>
        </v-row>
        <v-tabs v-model="tab" @change="tabChange">
            <v-tab v-for="item in items" :key="item">{{item}}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item v-for="item in items" :key="item">
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
                </h-table>
            </v-tab-item>
        </v-tabs-items>
        <h-dialog v-model="dialogFlag">
            <data-structure-dialog slot="dialog-content" :rowObj="rowObj" v-if="dialogShow"></data-structure-dialog>
            <create-topic-dialog slot="dialog-content" v-else></create-topic-dialog>
        </h-dialog>
    </div>
</template>
<script lang="ts">
import { Component, Vue,Provide } from "vue-property-decorator";
import { paramsType, returnDataType } from '../../../type/http-request.type';
import http from "../../../decorator/httpDecorator";
import { topicTable } from '../../../type/topic.type';
import HTable from '../../../components/h-table.vue';
import Enum from '@/decorator/enumDecorator';
import { queneType } from '../../../enum/topic-list-enum';
import HDialog from '../../../components/h-dialog.vue';
import DataStructureDialog from './childComponent/dataStructureDialog.vue';
import CreateTopicDialog from './childComponent/createTopicDialog.vue';
@Component({
    components:{
        HTable,
        HDialog,
        DataStructureDialog,
        CreateTopicDialog
    }
})
@http
@Enum([{
    tsFileName:"topic-list-enum",
    enumName:"queneType"
}])
export default class TopicList extends Vue{

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

    private tab = null
    private items = [
        "所有主题",
        "我的主题"
    ]
    private dialogFlag:boolean = false //弹窗展示
    private dialogShow:boolean = true //展示哪个弹窗
    private rowObj:object = {} //数据结构弹窗数据
    private desserts:Array<topicTable> = []  //数据列表
    private queryTopicID = null  //查询主题ID input框内容
    private paginationLength:number = 0 //分页数
    private pageNum:number = 1 //第几页
    private pageSize:number = 20 //每页展示多少条数据
    private headers = [  //表头内容
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
            value:"userName"
        },
        {
            text:"订阅用户",
            align:"start",
            value:"userSubNameList",
            format:(userSubNameList:Array<string>)=>{
                return userSubNameList.toString()
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
        }
    ]

    //查询通用调用方法
    private async searchMethod(bool:boolean,params:object,tab?:boolean){
        if(tab){
            const {data}: returnDataType = bool?await this.h_request["httpGET"]<object>("GET_TOPICS_MYTOPICSBYID",params):await this.h_request["httpGET"]<object>("GET_TOPICS_MYTOPICS",params)
            this.desserts = data.list
            this.paginationLength = Math.floor((data["total"]/this.pageSize)+1)
        }else{
            const {data}: returnDataType = bool?await this.h_request["httpGET"]<object>("GET_TOPICS_SELECTTOPIC",params):await this.h_request["httpGET"]<object>("GET_TOPICS_FIND_ALL",params)
            this.desserts = data.list
            this.paginationLength = Math.floor((data["total"]/this.pageSize)+1)
        }
    }

    //主题查询
    private searchTopic(){
        if(!this.queryTopicID){
            this.searchMethod(false,{
                pageNum:1,
                pageSize:this.pageSize
            },!!this.tab)
        }else{
            this.searchMethod(true,{
                topicID:this.queryTopicID==""?0:this.queryTopicID,
                pageNum:1,
                pageSize:this.pageSize
            },!!this.tab)
        }
    }


    //tab切换方法
    private tabChange(tab:number){
        this.searchMethod(false,{
            pageSize:this.pageSize,
            pageNum:1
        },!!tab)
    }

    //数据结构展示方法
    private dataStructure(item:any){
        this.dialogFlag = true
        this.dialogShow = true
        this.rowObj = item
        this.formObj.title = "数据结构详情"
    }

    //创建主题
    private createTopic(){
        this.dialogFlag = true
        this.dialogShow = false
        this.formObj.btnName = ["立即提交"]
        this.formObj.title = "数据结构详情"
    }

    created() {
        this.searchMethod(false,{
            pageSize:this.pageSize,
            pageNum:this.pageNum
        },false)
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