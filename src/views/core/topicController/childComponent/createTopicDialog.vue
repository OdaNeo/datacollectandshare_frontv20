<template>
    <v-row id="createTopicDialog">
        <!-- 弹框 展示数据结 -->
        <v-dialog
                v-model="showConstruction"
                width="500"
        >
            <v-card>
                <v-card-title class="headline grey lighten-2">
                    数据发送示例
                </v-card-title>

                <v-card-text>
                    <p style="padding-top: 20px;white-space:pre-wrap;">
                        {{msgSendExample}}
                    </p>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="primary"
                            text
                            @click="showConstruction = false"
                    >
                        关闭
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-col cols="12"  class="btn-line">
            <div class="text-label-line" style="display: inline-block">
                <label>数据类型：</label>
            </div>
            <v-btn small :disabled="formProvide.formObj.canNotEdit&&!onlineData" :color="onlineData?'primary':''" @click="showonlineData(true)">实时</v-btn>
            <v-btn small :disabled="formProvide.formObj.canNotEdit&&onlineData" :color="!onlineData?'primary':''" @click="showonlineData(false)">离线</v-btn>
        </v-col>
        <v-col cols="12"  class="btn-line">
            <div class="text-label-line" style="display: inline-block">
                <label>接口类型：</label>
            </div>
            <v-btn v-if="onlineData" :disabled="formProvide.formObj.canNotEdit&&formProvide.formObj.interfaceType!==1" small :color="formProvide.formObj.interfaceType===1?'primary':''" @click="formProvide.formObj.interfaceType=1">通用Rest接口</v-btn>
            <v-btn v-if="onlineData" :disabled="formProvide.formObj.canNotEdit&&formProvide.formObj.interfaceType!==4" small :color="formProvide.formObj.interfaceType===4?'primary':''" @click="formProvide.formObj.interfaceType=4">多级嵌套免校验</v-btn>
            <v-btn v-if="!onlineData" :disabled="formProvide.formObj.canNotEdit&&formProvide.formObj.interfaceType!==2" small :color="formProvide.formObj.interfaceType===2?'primary':''" @click="formProvide.formObj.interfaceType=2">数据库采集</v-btn>
            <v-btn v-if="!onlineData" :disabled="formProvide.formObj.canNotEdit&&formProvide.formObj.interfaceType!==3" small :color="formProvide.formObj.interfaceType===3?'primary':''" @click="formProvide.formObj.interfaceType=3">服务主动拉取</v-btn>
        </v-col>
        <v-col cols="9"  style="padding:0">
            <v-text-field
                    single-line
                    outlined
                    clearable
                    dense
                    :disabled="formProvide.formObj.canNotEdit"
                    height="32"
                    @blur="checkTopicName(formProvide.formObj.topicName)"
                    class="dialogInput"
                    v-model="formProvide.formObj.topicName"
                    :rules="topicNameRulesTest"
                    required
            >
                <template v-slot:prepend>
                    <div class="text-label">

                        <label><span class="require-span">*</span>主题名称：</label>
                    </div>
                </template>
            </v-text-field>
        </v-col>
        <v-col cols="9"  style="padding:0" v-if="formProvide.formObj.interfaceType===2">
            <v-text-field
                    single-line
                    outlined
                    clearable
                    dense
                    height="32"
                    class="dialogInput"
                    v-model="formProvide.formObj.dataBaseIp"
                    :rules="valueRequire"
                    required
                    :disabled="formProvide.formObj.canNotEdit"
            >
                <template v-slot:prepend>
                    <div class="text-label">

                        <label><span class="require-span">*</span>数据库地址：</label>
                    </div>
                </template>
            </v-text-field>
        </v-col>
        <v-col cols="9"  style="padding:0" v-if="formProvide.formObj.interfaceType===2">
            <v-autocomplete
                    v-model="formProvide.formObj.databaseType"
                    :disabled="formProvide.formObj.canNotEdit"
                    :items="items2"
                    dense
                    :rules="valueRequire"
                    required
                    single-line
                    outlined
            >
                <template v-slot:prepend>
                    <div class="text-label">
                        <label><span class="require-span">*</span>数据库类型：</label>
                    </div>
                </template>
            </v-autocomplete>

        </v-col>
        <div  v-if="formProvide.formObj.interfaceType===3" style="max-height:200px;overflow-y: auto;overflow-x: hidden;" >
            <div
            style="display: flex;width: 100%;flex-wrap: wrap;">
                <v-col cols="7"  style="padding:0;max-width:53.8%" >
                    <v-text-field
                            single-line
                            outlined
                            clearable
                            dense
                            label="用户名"
                            height="32"
                            class="dialogInput"
                            v-model="formProvide.formObj.AuthorizationObj.key"
                    >
                        <template v-slot:prepend>
                            <div class="text-label">
                                <label>Authorization：</label>
                            </div>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="5"  style="padding:0 0 0 6px;max-width:34%" >
                    <v-text-field
                            single-line
                            outlined
                            clearable
                            dense
                            label="密码"
                            height="32"
                            class="dialogInput"
                            v-model="formProvide.formObj.AuthorizationObj.value"
                    >
                    </v-text-field>
                </v-col>
            </div>
        </div>
        <v-col cols="9"  style="padding:0" v-if="formProvide.formObj.interfaceType===3">
            <v-text-field
                    single-line
                    outlined
                    clearable
                    dense
                    :disabled="formProvide.formObj.canNotEdit"
                    height="32"
                    class="dialogInput"
                    v-model="formProvide.formObj.url"
                    :rules="valueRequire"
                    required
            >
                <template v-slot:prepend>
                    <div class="text-label">
                        <label><span class="require-span">*</span>url：</label>
                    </div>
                </template>
            </v-text-field>
        </v-col>
        <div  v-if="formProvide.formObj.interfaceType===3" style="max-height:200px;overflow-y: auto;overflow-x: hidden;" >
            <div
            v-for="(item,index) in formProvide.formObj.header"
            style="display: flex;width: 100%;flex-wrap: wrap;"
            :key="index">
                <v-col cols="6"  style="padding:0" >
                    <v-text-field
                            single-line
                            outlined
                            clearable
                            dense
                            label="键"
                            :disabled="formProvide.formObj.canNotEdit"
                            height="32"
                            class="dialogInput"
                            v-model="item.key"
                            :rules="valueRequire"
                            required
                    >
                        <template v-slot:prepend>
                            <div class="text-label">
                                <label v-show="index===0"><span class="require-span">*</span>头信息：</label>
                            </div>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="3"  style="padding:0 0 0 6px;" >
                    <v-text-field
                            single-line
                            outlined
                            clearable
                            dense
                            label="值"
                            :disabled="formProvide.formObj.canNotEdit"
                            height="32"
                            class="dialogInput"
                            v-model="item.value"
                            :rules="valueRequire"
                            required
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="2" class="input-item" v-if="!formProvide.formObj.canNotEdit" style="padding-left: 6px;">
                    <v-btn fab dark small color="indigo" class="add-btn"  v-if="formProvide.formObj.header.length ===index+1" @click="add2()">
                        <v-icon dark>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn fab dark small color="error" class="add-btn" v-if="formProvide.formObj.header.length !==index+1"  @click="minus2(index)" >
                        <v-icon dark>mdi-minus</v-icon>
                    </v-btn>
                </v-col>
            </div>
        </div>
        <v-col cols="9"  style="padding:0" v-if="formProvide.formObj.interfaceType===1||formProvide.formObj.interfaceType===4">
            <v-radio-group
                    v-model="formProvide.formObj.messageType"
                    single-line
                    outlined
                    dense
                    class="dialogInput"
                    height="32"
                    :disabled="formProvide.formObj.canNotEdit"
                    row
                    :rules="messageTypeRules"
                    required
            >
                <template v-slot:prepend>
                    <div class="text-label" style="margin-top:7px">
                        <label><span class="require-span">*</span>消息类型：</label>
                    </div>
                </template>
                <v-radio
                        :disabled="formProvide.formObj.canNotEdit"userDialogValid
                        v-for="n in types"
                        :key="n.value"
                        :label="`${n.text}`"
                        :value="n.value"
                ></v-radio>
            </v-radio-group>
        </v-col>
        <v-col cols="9"  style="padding:0" v-if="formProvide.formObj.interfaceType===4">
            <v-radio-group
                    v-model="formProvide.formObj.writeElasticsearch"
                    single-line
                    outlined
                    dense
                    class="dialogInput"
                    height="32"
                    :disabled="formProvide.formObj.canNotEdit"
                    row
                    :rules="writeEsRules"
                    required
            >
                <template v-slot:prepend>
                    <div class="text-label" style="margin-top:7px">
                        <label><span class="require-span">*</span>是否写入ES：</label>
                    </div>
                </template>
                <v-radio
                        :disabled="formProvide.formObj.canNotEdit"
                        v-for="n in esList"
                        :key="n.value"
                        :label="`${n.text}`"
                        :value="n.value"
                ></v-radio>
            </v-radio-group>
        </v-col>

        <v-col cols="9" style="padding:0 0 18px 0" v-if="onlineData" >
            <v-slider
                    v-model="formProvide.formObj.redisTimer"
                    class="align-center"
                    max="30"
                    min="5"
                    :disabled="formProvide.formObj.canNotEdit"
                    hide-details
            >
                <template v-slot:prepend>
                    <div class="text-label">
                        <label>内存过期时间：</label>
                    </div>
                </template>
                <template v-slot:append>
                    <v-text-field
                            v-model="formProvide.formObj.redisTimer"
                            class="mt-0 pt-0"
                            disabled
                            hide-details
                            single-line
                            style="width: 60px"
                    ></v-text-field>
                </template>
            </v-slider>
        </v-col>
        <v-col cols="9"  style="padding:0"  v-if="formProvide.formObj.interfaceType===4">
            <v-textarea
                    outlined
                    :disabled="formProvide.formObj.canNotEdit"
                    v-model="formProvide.formObj.dataStructSchema"
                    :rules="dataStructSchema"
                    required
            >
                <template v-slot:prepend>
                    <div class="text-label">

                        <label><span class="require-span">*</span>数据结构：</label>
                    </div>
                </template>
            </v-textarea>
        </v-col>
        <div style="width: 100%;max-height:200px;overflow-y: auto;overflow-x: hidden;" v-if="formProvide.formObj.interfaceType!==4">
            <div
            v-for="(item,index) in formProvide.formObj.topicList"
            style="display: flex;flex: 1;"
            :key="index"
            >
                <v-col cols="4"  class="input-item">
                    <v-text-field
                            single-line
                            outlined
                            dense
                            :disabled="item.disabled"
                            height="32"
                            class="dialogInput"
                            label="序号"
                            v-model="item.number"
                            :rules="valueRequire"
                            required
                    >
                        <template v-slot:prepend >
                            <div class="text-label" v-if="index===0">
                                <label><span class="require-span">*</span>数据结构：</label>
                            </div>
                            <div class="text-label" v-else>
                                <p></p>
                                <label></label>
                            </div>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="2"  class="input-item">
                    <v-text-field
                            single-line
                            :disabled="item.disabled"
                            outlined
                            dense
                            label="字段名"
                            height="32"
                            class="dialogInput"
                            v-model="item.key"
                            :rules="valueRequire"
                            required
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="2"  class="input-item">
                    <v-text-field
                            single-line
                            outlined
                            :disabled="item.disabled"
                            dense
                            height="32"
                            class="dialogInput"
                            label="描述"
                            v-model="item.description"
                            :rules="valueRequire"
                            required
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="2" class="input-item">
                    <v-autocomplete
                            v-model="item.type"
                            :items="items"
                            dense
                            :disabled="item.disabled"
                            :rules="valueRequire"
                            required
                            height="28"
                            solo
                            single-line
                            outlined
                            style="min-height:32px"
                    ></v-autocomplete>
                </v-col>
                <v-col cols="2" class="input-item">
                    <v-btn fab dark small color="error" class="add-btn" v-if="(formProvide.formObj.topicList.length !==index+1||index!=0)&& !item.disabled "  @click="minus(index)" >
                        <v-icon dark>mdi-minus</v-icon>
                    </v-btn>
                    <v-btn fab dark small color="indigo" class="add-btn" v-if="formProvide.formObj.topicList.length ===index+1" @click="add()">
                        <v-icon dark>mdi-plus</v-icon>
                    </v-btn>
                </v-col>
            </div>
        </div>
        <v-col cols="9"  style="padding:0"  v-if="onlineData && formProvide.formObj.interfaceType==1">
            <v-radio-group
                    v-model="formProvide.formObj.messageType"
                    single-line
                    outlined
                    dense
                    class="dialogInput"
                    height="32"
                    :disabled="formProvide.formObj.canNotEdit"
                    row
                    required
            >
                <template v-slot:prepend>
                    <div class="text-label" style="margin-top:7px">
                        <label><span class="require-span"></span>数据发送示例：</label>
                    </div>
                </template>
                <v-btn solo @click.native="showConstruction=true">
                    查看
                </v-btn>
            </v-radio-group>
        </v-col>
    </v-row>
</template>
<script lang="ts">
    import {Component, Inject, Vue} from "vue-property-decorator";
    import http from '@/decorator/httpDecorator';
    import { H_Vue } from '@/declaration/vue-prototype';

    @Component
    @http
    export default class CreateTopicDialog extends Vue{
        @Inject() private readonly formProvide!:H_Vue
        private topicName:string = ""
        private messageType:string = ""
        private bool:boolean = false
        private showConstruction:boolean = false
        private topicBool:boolean = false
        private onlineData:boolean = this.formProvide.formObj.interfaceType===2||this.formProvide.formObj.interfaceType===3?false:true
        private items:Array<any> = [{text:"Int",value:1},{text:"String",value:"str"},{text:"Data",value:"Data"},{text:"TimeStamp",value:new Date().getTime()}]
        private items2:Array<any> = ['Mysql','Oracle','Sql Server']
        private types:Array<any> = [{text:"数据量优先",value:1},{text:"顺序优先",value:2}]
        private esList:Array<any> = [{text:"是",value:1},{text:"否",value:0}]
        private arr:Array<any> = ['','']
        private valueRequire:any = [
            (v:string) =>!!v||"不能为空",

        ]
        private topicNameRulesTest:any = [
            (v:string) =>!!v||"不能为空",
            (v:string) =>(v&&v.length<=20) || "内容最长可设置20个字符",
            (v:string) => /^\w*$/.test(v) || "内容只能为数字、字母、下划线的组合",
        ]
        private isJSON(str:string) {
            if (typeof str == 'string') {
                try {
                    var obj=JSON.parse(str);
                    if(typeof obj == 'object' && obj ){
                        return true;
                    }else{
                        return false;
                    }

                } catch(e) {
                    console.log('error：'+str+'!!!'+e);
                    return false;
                }
            }
            console.log('It is not a string!')
        }
        private dataStructSchema:any = [
            (v:string) =>!!v||"不能为空",
            (v:string) =>this.isJSON(v)||"请输入正确的Json数据"
        ]
        private topicNameRules = [
            (v:string) =>!!v||"不能为空",
            (v:string) =>(v&&v.length<=20) || "内容最长可设置20个字符",
            (v:string) => /^\w*$/.test(v) || "内容只能为数字、字母、下划线的组合"
        ]
        // 校验主题名称是否存在
        private writeEsRules = [
            (v:string) =>v!==''||"请选择是否写入ES"
        ]
        // 校验主题名称是否存在
        private messageTypeRules = [
            (v:string) =>!!v||"请选择消息类型"
        ]
        // 查询 主题名称是否重复
        private async checkTopicName(v:any){
            const {success} = await this.h_request["httpGET"]("GET_TOPICS_CHECKED",{
                topicName:v,
            })
            this.topicBool = success
            if(success){
                this.topicNameRulesTest = [
                    (v:string) => "主题名称重复",
                ]
            }else{
                this.topicNameRulesTest = [
                    (v:string) =>!!v||"不能为空",
                    (v:string) =>(v&&v.length<=20) || "内容最长可设置20个字符",
                    (v:string) => /^\w*$/.test(v) || "内容只能为数字、字母、下划线的组合",
                ]
            }

        }
        private showonlineData(dataType:boolean){
            if(dataType){
                this.formProvide.formObj.interfaceType=1
            }else{
                if(this.formProvide.formObj.interfaceType===3){
                    this.formProvide.formObj.interfaceType=3
                }else{
                    this.formProvide.formObj.interfaceType=2
                }
            }
            this.onlineData = dataType
        }
        private add(){ // 增加数据结构
            (this.formProvide.formObj.topicList as Array<any>).push({
                number: '',
                key:'',
                type:'',
                disabled:false
            })
        }
        private minus (num:number){ // 删减数据结构
            (this.formProvide.formObj.topicList as Array<any>).splice(num,1)
        }
        private add2(){ // 增加数据结构
            (this.formProvide.formObj.header as Array<any>).push({
                key:'',
                value:''
            })
        }
        private minus2 (num:number){ // 删减数据结构
            (this.formProvide.formObj.header as Array<any>).splice(num,1)
        }
        private clearMethod(){
            this.formProvide.formObj={
                id:'', // 主题ID
                canNotEdit: false, // 添加数据
                interfaceType:1,
                topicName:'', // 主题名称
                messageType:'', // 消息类型
                dataBaseIp:'', // 数据库地址
                databaseType:'', // 数据库类型
                header: [{key:'',value:''},],
                redisTimer: '',
                dataStructSchema:'', //
                writeElasticsearch: '', // 是否展示
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
                }
            }
        }

        private get msgSendExample(){
            const topicList = this.formProvide.formObj.topicList as any[]
            const msg:any = {}
            topicList.forEach((element:any) => {
                msg[element.number] = element.key
            });
            return JSON.stringify({
                "requestid":new Date().getTime(),
                "data":[msg]
            },null,"\t")
        }
    }
</script>

<style scoped>
    .text-label{
        width:130px;
        display: inline-block;
        text-align: right;
    }
    .text-label p{
        color:red;
    }
    .btn-line{
        padding-bottom: 20px;
    }
    .btn-line .v-btn{
      margin-right: 10px;
    }
    .input-item{
        margin-right: 6px;
        padding: 0;
    }
    .add-btn{
        width: 30px;
        height: 30px;
        margin-right: 4px;
    }
    .text-label-line{
       width: 130px;
        display: inline-block;
        box-sizing: border-box;
        padding-right: 14px;
        font-size: 16px;
        text-align: right;
        color: #000;
    }
    .text-label-line label{
        font-size: 16px;
    }
    .require-span{
        color: red;
        margin-right: 4px;
    }
    .dialogInput .v-input__slot{
        box-shadow: 2px 2px 10px #dddddd !important;
    }
</style>
