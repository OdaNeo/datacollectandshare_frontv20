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
                @click.stop="createTopic(false)"
                >
                    创建主题
                </v-btn>
            </v-col>
        </v-row>
        <v-tabs v-model="tab" @change="tabChange">
            <v-tab v-for="item in items" :key="item">{{item}}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" >
            <v-tab-item v-for="item in items" :key="item">
                <h-table
                :headers="headers"
                :desserts="desserts"
                :height="500"
                :pageNum="pageNum"
                @PaginationsNow = "PaginationsNow"
                :paginationLength="paginationLength"
                >
                    <template v-slot:buttons="{item}">
                        <v-btn
                        small
                        text
                        color="primary"
                        class="my-2"
                        @click="getTopicInformation(item,false,false)"
                        >
                            数据结构详情
                        </v-btn>
                    </template>
                    <template v-slot:buttons2="{item}">
                        <v-btn
                                v-if="tab"
                                small
                                text
                                color="primary"
                                class="my-2"
                                @click.stop="getTopicInformation(item,true,false)"
                        >
                            增加字段
                        </v-btn>
                        <v-btn
                                small
                                v-if="tab"
                                text
                                color="primary"
                                class="my-2"
                                @click="deleteTopic(item)"
                        >
                            删除
                        </v-btn>
                        <v-btn
                            small
                            text
                            color="primary"
                            class="my-2"
                            :disabled="!item.topicInterFaceType||item.topicInterFaceType===1"
                            @click="getTopicInformation(item,false,true)"
                        >
                            查看附加信息
                        </v-btn>
                    </template>
                </h-table>
            </v-tab-item>
        </v-tabs-items>
        <h-dialog v-if="dialogFlag" v-model="dialogFlag">
            <data-structure-dialog slot="dialog-content" :rowObj="rowObj" :otherObj="otherObj" :onlyShowOther="onlyShowOther" v-if="dialogShow"></data-structure-dialog>
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
import { TopicAdd } from '../../../type/topic-add.type';
import {SystemConfigFormObj} from "@/type/system-config.type";
import {GET_TOPICS_INFORMATION} from "@/api/requestName";

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
                    id:'', // 主题ID
                    canNotEdit: false, // 添加数据
                    interfaceType:1,
                    topicName:'', // 主题名称
                    messageType:'', // 消息类型
                    dataBaseIp:'', // 数据库地址
                    databaseType:'', // 数据库类型
                    header: [{key:'',value:''},],
                    url: '',
                    topicList:[
                        {
                            number: '',
                            key:'',
                            type:'',
                            description:'', // 描述
                            disabled:false
                        }
                    ]
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
    private otherObj:any = {} //数据结构弹窗数据 补充
    private onlyShowOther:boolean = false // 只显示补充信息

    private desserts:Array<topicTable> = []  //数据列表
    private queryTopicID = null  //查询主题ID input框内容
    private paginationLength:number = 0 //分页数
    private pageNum:number = 1 //第几页
    private pageSize:number = 20 //每页展示多少条数据
    private headers = [  //表头内容 所有主题
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
            align:"center",
            value:"userSubNameList",
            format:(userSubNameList:Array<string>)=>{
                return userSubNameList.toString()
            }
        },
        {
            text:"接口类型",
            align:"center",
            value:"topicInterFaceType",
            format:(val:number)=>{
                switch (val) {
                    case 1:
                        return '通用Rest接口'
                    case 2:
                        return '数据库采集'
                    case 3:
                        return '服务主动拉取'
                }
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
            slot:"buttons2"
        }
    ]
    // 添加主题调用方法
    //  创建主题
    private createTopic(item:any){
        this.dialogFlag = true
        this.dialogShow = false
        this.formObj.btnName = ["立即提交"]
        this.formObj.title = "创建主题"
        this.formObj.methodName = "addTopic" // 立即提交

        // if 增加字段
        if(item){
            console.log(this.otherObj)
            this.formObj.formObj.canNotEdit = true
            this.formObj.formObj.interfaceType = item.topicInterFaceType
            this.formObj.formObj.topicName = item.topicName
            this.formObj.formObj.messageType = item.queneType
            this.formObj.formObj.id = item.id
            if(this.otherObj[0]){
                this.formObj.formObj.dataBaseIp = this.otherObj[0].dataBaseIp||''
                this.formObj.formObj.databaseType =  this.otherObj[0].databaseType||''
                this.formObj.formObj.header =  JSON.parse(this.otherObj[0].header||'')
                this.formObj.formObj.url =  this.otherObj[0].url||''
            }
            let obj1:any = JSON.parse(item.dsAnnotation)
            let obj2:any = JSON.parse(item.structMapping)
            let obj3:any = JSON.parse(item.dataStruct)[0]
            this.formObj.formObj.topicList = []
            for(let k in obj2){
                this.formObj.formObj.topicList.push({
                    number: k,
                    key: obj2[k],
                    type: obj3[k],
                    description: obj1[k],
                    disabled:true
                })
            }
        }
    }
    //  提交创建
    private addTopic(formObj:TopicAdd){
        return new Promise(async (resolve,reject):Promise<void>=>{
            let dataStruct:any = {};
            let dataStructNumber:any = {};
            let description:any = {}
            formObj.topicList.forEach((val,index)=>{
                dataStruct[val.number] = val.key;
                dataStructNumber[val.number] = val.type=="1"?Number(val.type):val.type;
                description[val.number] = val.description;
            })
            let _numberS = JSON.stringify(dataStruct);
            let _keyS = '['+JSON.stringify(dataStructNumber)+']';
            let _description = JSON.stringify(description);
            let params:any ={
                dataStruct: _keyS,
                structMapping : _numberS,
                dsAnnotation : _description,
            }
            if(!formObj.canNotEdit){
                switch (formObj.interfaceType) {
                    case 1:
                        params.topicInterFaceType = formObj.interfaceType
                        params.topicName = formObj.topicName
                        params.queneType = formObj.messageType
                        break
                    case 2:
                        params.topicInterFaceType = formObj.interfaceType
                        params.topicName = formObj.topicName
                        params.dataBaseType = formObj.databaseType
                        params.dataBaseIp = formObj.dataBaseIp
                        break
                    case 3:
                        params.topicInterFaceType = formObj.interfaceType
                        params.topicName = formObj.topicName
                        params.url = formObj.url
                        params.header = JSON.stringify(formObj.header)
                        break
                }
            }else{
                params.id = formObj.id
            }


            const {success} = await this.h_request["httpPOST"](!formObj.canNotEdit?"POST_TOPICS_ADD":"POST_TOPICS_UPDATE",params)
            if(success){
                this.searchMethod(false,{
                    pageSize:this.pageSize,
                    pageNum:1
                })
            }
            resolve(success)
        })
    }
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
    private dataStructure(item:any,str:string){
        this.dialogFlag = true
        this.dialogShow = true
        this.rowObj = item
        this.formObj.title = str
        this.formObj.btnName = []
        this.formObj.methodName = " "
    }

    private async getTopicInformation(item:any,bool:boolean,showOther:boolean){
        console.log(item)
        const {success, data}:any = await this.h_request["httpGET"]("GET_TOPICS_INFORMATION",{
            topicID:item.id,
            topicName:item.topicName,
            topicInterFaceType:item.topicInterFaceType
        })
        if(success){
            this.otherObj = data
            if(!bool){
                this.onlyShowOther = showOther
                if(!showOther){
                    this.dataStructure(item,"数据结构详情")
                }else{
                    this.dataStructure(item,"附加信息")
                }

            }else{
                this.createTopic(item)
            }
        }
    }
    private async deleteTopic(item:any){
        const {success} = await this.h_request["httpGET"]("GET_TOPICS_DELETE",{
            topicID:item.id,
            topicName:item.topicName,
            topicInterFaceType:item.topicInterFaceType
        })
        if(success){
            this.searchMethod(false,{
                pageSize:this.pageSize,
                pageNum:1
            })
        }
    }
    private PaginationsNow(page:number){
        this.pageNum = page
        this.searchMethod(false,{
            pageSize:this.pageSize,
            pageNum:this.pageNum
        },!!this.tab)
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
