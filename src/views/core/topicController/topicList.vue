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
                v-only-num="{
                    set:this,
                    name:'userID'
                }"
                >
                </v-text-field>
            </v-col>
            <v-col cols="1">
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
                        @click="dataStructureDetails(item)"
                        >
                            数据结构详情
                        </v-btn>
                    </template>
                    <template v-slot:buttons2="{item,index}">
                        <v-btn
                                v-if="tab"
                                small
                                text
                                color="primary"
                                class="my-2"
                                @click.stop="addFileds(item)"
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

                            @click="getTopicInformation(item,index)"
                        >
                            查看附加信息
                        </v-btn>
                    </template>
                </h-table>
            </v-tab-item>
        </v-tabs-items>
        <h-dialog v-if="dialogFlag" v-model="dialogFlag">
            <data-structure-dialog slot="dialog-content" :rowObj="rowObj" v-if="dialogShow==2"></data-structure-dialog>
            <create-topic-dialog slot="dialog-content" v-else-if="dialogShow==1"></create-topic-dialog>
            <topic-ancilary-information-dialog slot="dialog-content" :otherObj="otherObj" v-else-if="dialogShow==3"></topic-ancilary-information-dialog>
        </h-dialog>
        <!-- 上传文件对话框 -->
        <v-dialog
            v-model="upLoadFlag"
            max-width="750px"
            persistent
            content-class="upLoadDialog"
        >
            <v-card>
                <v-card-title class="dialog-title">上传文件</v-card-title>
                <v-card-text>仅支持.xls, .xlsx格式的单文件上传。</v-card-text>
                <v-file-input accept=".xls,.xlsx" label="File input" @change="upLoadFile" @click:clear="canUpLoad=false" style="width:730px" :key="forceRenderFlag"/>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn  class="mr-4"  solo :disabled="!canUpLoad" @click="upLoadFileConfirm">确定上传</v-btn>
                    <v-btn  class="mr-4"  solo @click="upLoadFileCancel">取消上传</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
import TopicAncilaryInformationDialog from './childComponent/topicAncilaryInformationDialog.vue';
import util from '@/decorator/utilsDecorator';
import { MomentInputObject } from "moment";

import XLSX from 'xlsx';

@Component({
    components:{
        HTable,
        HDialog,
        DataStructureDialog,
        CreateTopicDialog,
        TopicAncilaryInformationDialog
    }
})
@http
@Enum([{
    tsFileName:"topic-list-enum",
    enumName:"queneType"
}])
@util
export default class TopicList extends Vue{

    @Provide("formProvide") private formObj = new Vue({
        data(){
            return{
                title:"",
                btnName:([] as string[]),
                methodName:"",
                upLoad:true,// 主题列表页面上传文件按钮flag
                formObj:{
                    id:'', // 主题ID
                    canNotEdit: false, // 添加数据
                    interfaceType:1,
                    topicName:'', // 主题名称
                    messageType:'', // 消息类型
                    dataBaseIp:'', // 数据库地址
                    databaseType:'', // 数据库类型
                    dataStructSchema:'', //
                    writeElasticsearch: 1, // 是否展示
                    redisTimer: '', // 内存过期时间
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
                    ],
                    AuthorizationObj:{
                        key:"",
                        value:""
                    },
                    type: '', // 请求类型
                    body:'' // body 数据结构
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
    private dialogShow:number = 0 //展示哪个弹窗 1.是主题添加和修改弹窗 2.是详细信息弹窗 3.是附加信息弹窗
    private rowObj:object = {} //数据结构弹窗数据
    private otherObj:any = {} //数据结构弹窗数据 补充
    private onlyShowOther:boolean = false // 只显示补充信息

    private upLoadFlag:boolean = false
    private canUpLoad:boolean = false
    private SheetNames:string[] = [""]
    private Sheets:any
    private forceRenderFlag:number=Math.random()
    private fileName:string=""
    private topicListNameList=['序号','字段名','字段类型(Int,String,TimeStamp)','字段含义']

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
                    case 4:
                        return '多级嵌套免校验'
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
        this.dialogShow = 1
        this.formObj.btnName = ["立即提交"]
        this.formObj.title = "创建主题"
        this.formObj.methodName = "addTopic" // 立即提交

        // if 增加字段
        if(item){
            this.formObj.title = "添加字段"
            this.formObj.formObj.canNotEdit = true
            this.formObj.formObj.interfaceType = item.topicInterFaceType
            this.formObj.formObj.topicName = item.topicName
            this.formObj.formObj.messageType = item.queneType
            this.formObj.formObj.id = item.id
            this.formObj.formObj.redisTimer = item.redisTimer
            this.formObj.formObj.writeElasticsearch = item.writeElasticsearch
            this.formObj.formObj.dataStructSchema = item.dataStructSchema
            this.formObj.formObj.type = item.type
            this.formObj.formObj.body = item.body
            this.formObj.formObj.url = item.url
            console.log(item.dataBaseIp)
            this.formObj.formObj.dataBaseIp = item.dataBaseIp
            console.log(item.dataBaseType)
            this.formObj.formObj.databaseType = item.dataBaseType

            // console.log(item.AuthorizationObj)
            this.formObj.formObj.AuthorizationObj = {
                key:"***",
                value:"***"
            }
            this.formObj.formObj.header = JSON.parse(item.header)
            if(this.otherObj[0]){
                this.formObj.formObj.dataBaseIp = this.otherObj[0].dataBaseIp||''
                this.formObj.formObj.databaseType =  this.otherObj[0].dataBaseType||''
                this.formObj.formObj.header =  JSON.parse(this.otherObj[0].header)||''
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
                        params.redisTimer = formObj.redisTimer
                        params.writeElasticsearch = formObj.writeElasticsearch
                        break
                    case 2:
                        params.topicInterFaceType = formObj.interfaceType
                        params.topicName = formObj.topicName
                        params.dataBaseType = formObj.databaseType
                        params.dataBaseIp = formObj.dataBaseIp
                        break
                    case 3:
                        // 只在添加的时候 转base64
                        if(formObj.AuthorizationObj.key!=='' && formObj.AuthorizationObj.value!==''){
                            formObj.header.unshift(this.authorizationBase64(formObj.AuthorizationObj))
                        }
                        params.topicInterFaceType = formObj.interfaceType
                        params.topicName = formObj.topicName
                        params.url = formObj.url
                        params.header = JSON.stringify(formObj.header)
                        params.type = formObj.type
                        params.body = formObj.body.replace(/\s+/g,"")
                        break
                    case 4:
                        params.topicInterFaceType = formObj.interfaceType
                        params.topicName = formObj.topicName
                        params.queneType = formObj.messageType
                        params.redisTimer = formObj.redisTimer
                        params.writeElasticsearch = formObj.writeElasticsearch
                        params.dataStructSchema = formObj.dataStructSchema.replace(/\s+/g,"")
                        delete params.dataStruct
                        delete params.structMapping
                        delete params.dsAnnotation
                        break
                }
            }else{
                params.id = formObj.id
            }


            const {success} = await this.h_request["httpPOST"](!formObj.canNotEdit?"POST_TOPICS_ADD":"POST_TOPICS_UPDATE",params)

            if(success){
                this.h_utils["alertUtil"].open(!formObj.canNotEdit?"主题创建成功":"主题修改成功",true,"success")
                this.searchMethod(false,{
                    pageSize:this.pageSize,
                    pageNum:1
                },this.tab?true:false)
            }
            resolve(success)
        })
    }

    private authorizationBase64(obj:any){
        console.log('查看要处理的数据',obj)
        return {"key":"Authorization","value":"Basic " + window.btoa(obj.key+':'+ obj.value+"")}
    }
    //查询通用调用方法
    private async searchMethod(bool:boolean,params:object,tab?:boolean){
        if(tab){
            const {data}: returnDataType = bool?await this.h_request["httpGET"]<object>("GET_TOPICS_MYTOPICSBYID",params):await this.h_request["httpGET"]<object>("GET_TOPICS_MYTOPICS",params)
            this.desserts = data.list.map((item:any)=>{
                return {...item,flag:false}
            })
            this.paginationLength = Math.floor((data["total"]/this.pageSize)+1)
        }else{
            const {data}: returnDataType = bool?await this.h_request["httpGET"]<object>("GET_TOPICS_SELECTTOPIC",params):await this.h_request["httpGET"]<object>("GET_TOPICS_FIND_ALL",params)
            this.desserts = data.list.map((item:any)=>{
                return {...item,flag:false}
            })
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
        this.dialogShow = 2
        this.rowObj = item
        this.formObj.title = str
        this.formObj.btnName = []
        this.formObj.methodName = " "
    }

    private ancillaryInformation(info:any,str:string){
        this.dialogFlag = true
        this.dialogShow = 3
        this.otherObj = info
        this.formObj.title = str
        this.formObj.btnName = []
        this.formObj.methodName = " "
    }

    private dataStructureDetails(item:any){
        this.dataStructure(item,"数据结构详情")
    }

    private addFileds(item:any){
        console.log(item)
        this.createTopic(item)
    }

    private async getTopicInformation(item:any,index:number){
        let info:any = {}
        if(!this.desserts[index].flag){
            const {data}:any = await this.h_request["httpGET"]("GET_TOPICS_INFORMATION",{
                topicID:item.id,
                topicName:item.topicName,
                topicInterFaceType:item.topicInterFaceType
            })

            if(data.length>0){
                this.desserts[index].dataBaseIp = data[0].dataBaseIp
                this.desserts[index].dataBaseType = data[0].dataBaseType
                this.desserts[index].url = data[0].url
                this.desserts[index].header = data[0].header
            }
            // info = {...data[0],topicInterFaceType:item.topicInterFaceType,redisTimer:item.redisTimer}
            this.desserts[index].flag = true;
        }
        this.ancillaryInformation(this.desserts[index],"附加信息")
    }
    private async deleteTopic(item:any){
        const {success} = await this.h_request["httpGET"]("GET_TOPICS_DELETE",{
            topicID:item.id,
            topicName:item.topicName,
            topicInterFaceType:item.topicInterFaceType
        })
        if(success){
            this.h_utils["alertUtil"].open("主题删除成功",true,"success")
            this.searchMethod(false,{
                pageSize:this.pageSize,
                pageNum:1
            },true)
        }
    }
    private PaginationsNow(page:number){
        this.pageNum = page
        this.searchMethod(false,{
            pageSize:this.pageSize,
            pageNum:this.pageNum
        },!!this.tab)
    }
    public openUpload(){
        this.upLoadFlag=true
    }

    // 上传文件
    private  upLoadFile  (e:File[]){
        const file=e as any 
        if(!file){ return }
        // xlsx 或者 xls 格式才能上传
        if(file.type==='application/vnd.ms-excel'|| file.type=== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            
            const reader = new FileReader()
            reader.onload  = (e:any) =>{
                const data = new Uint8Array(e.target.result)
                const {SheetNames,Sheets} = XLSX.read(data, {type: 'array'})
                
                this.canUpLoad=true
                this.SheetNames=SheetNames
                this.Sheets=Sheets
                this.fileName=file.name.split('.')[0]
            }
            reader.readAsArrayBuffer(file);
        }
    }

    //  确定上传
    private upLoadFileConfirm(){
        this.upLoadFlag = false
        this.dialogFlag = true
        this.canUpLoad=false
        this.forceRenderFlag=Math.random()

        // 填充创建主题页面
        this.formObj.formObj.topicName=this.fileName
        const obj=this.Sheets.sheet1
        const _l:number=obj['!ref'].split('D')[1]

         this.formObj.formObj.topicList = []
         
            for(let i=1;i<_l;i++){
                this.formObj.formObj.topicList.push({
                    number: obj[`A${i+1}`].v,
                    key: obj[`B${i+1}`].v,
                    type: obj[`C${i+1}`].v,
                    description: obj[`D${i+1}`].v,
                    disabled:false
                })
            }

        console.log(this.formObj.formObj.topicList)

    }
    // 取消上传
    private upLoadFileCancel(){
        this.upLoadFlag = false
        this.dialogFlag = true
        this.canUpLoad=false

        this.forceRenderFlag=Math.random()

        this.SheetNames = [""]
        this.Sheets={}
        this.fileName=""
    }
    created() {
        // console.log(418)
        // this.searchMethod(false,{
        //     pageSize:this.pageSize,
        //     pageNum:this.pageNum
        // },false)
    }
}
</script>
<style scoped>
.dialog-title{
    text-align: center;
    display: block;
}
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
