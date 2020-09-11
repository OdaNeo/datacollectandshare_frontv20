<template>
    <div>
        <v-form
        ref="userDialogForm"
        v-model="userDialogValid"
        >
            <slot name="dialog-form-content"></slot>
            <v-row>
                <v-col cols="5" offset="3" style="padding:0;margin-left:153px">
                    <v-btn
                        color="primary"
                        class="mr-4"
                        height="32"
                        solo
                        :disabled="!userDialogValid"
                        v-if="formProvide.btnName.length>0&&formProvide.btnName[0]"
                        @click="validate($event)"
                    >
                        {{formProvide.btnName[0]}}
                    </v-btn>
                    <v-btn
                        class="mr-4"
                        height="32"
                        solo
                        v-if="formProvide.btnName.length>0&&formProvide.btnName[1]"
                        @click="cancel($event)"
                    >
                        {{formProvide.btnName[1]}}
                    </v-btn>
                    <v-btn
                        class="mr-4"
                        height="32"
                        solo
                        v-if="formProvide.btnName.length>0&&!formProvide.btnName[1]"
                        @click="resetData"
                    >
                        重置
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Ref,Inject} from "vue-property-decorator";
import { H_Vue } from '../declaration/vue-prototype';
import http from '../decorator/httpDecorator';
import { FormStructure } from '@/type/dialog-form.type';
@Component
@http
export default class DialogForm extends Vue{
    @Ref("userDialogForm") readonly udf!:HTMLFormElement
    @Inject() private  formProvide!:H_Vue
    private userDialogValid:boolean = true
    private formProvideBF = JSON.parse(JSON.stringify(this.formProvide.formObj))

    private async validate(e:Event){
        if(this.udf.validate()){
            const parent = this.$parent.$parent.$parent.$parent as any
            const parent2 = this.$parent.$parent.$parent.$parent.$parent as any
            const bool = await parent2[this.formProvide.methodName](this.formProvide.formObj)
            if(bool){
                parent.closeMethod(e)
            }
        }
    }

    private cancel(e:Event){
        const parent = this.$parent.$parent.$parent.$parent as any
        parent.closeMethod(e)
    }
    private resetData(){
        const formObj:any = this.formProvide.formObj
        if(formObj.title = "添加字段"){
            // 增加字段的重置 至重置数据结构部分
            for(let i=0;i<formObj.topicList.length;i++){
                if(!formObj.topicList[i].disabled){
                    formObj.topicList.splice(i, 1)
                }
            }
            return
        }
        for(let key in formObj){
            if(Object.prototype.toString.call(formObj[key]) != '[object Object]'){
                if(Object.prototype.toString.call(formObj[key])=='[object Array]'){
                    formObj[key] = []
                }else{
                    formObj[key] = ""
                }
            }else{
                if((formObj[key] as FormStructure).reset){
                    (formObj[key] as FormStructure).text = this.formProvideBF[key].text
                }else{
                    (formObj[key] as FormStructure).text = ""
                }
            }
        }
        if((this.$children[0].$children[0] as any).clearMethod){
            (this.$children[0].$children[0] as any).clearMethod()
        }

        this.formProvide.formObj = {
            id:'', // 主题ID
            canNotEdit: false, // 添加数据
            interfaceType:1,
            topicName:'', // 主题名称
            messageType:'', // 消息类型
            dataBaseIp:'', // 数据库地址
            databaseType:'', // 数据库类型
            redisTimer: '',
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
        this.udf.resetValidation()
    }
    private reset(){
        // 增加字段的重置 至重置数据结构部分
        // this.udf.reset()
        const formObj = this.formProvide.formObj
        for(let key in formObj){
            if(Object.prototype.toString.call(formObj[key]) != '[object Object]'){
                if(Object.prototype.toString.call(formObj[key])=='[object Array]'){
                    formObj[key] = []
                }else{
                    formObj[key] = ""
                }
            }else{
                if((formObj[key] as FormStructure).reset){
                    (formObj[key] as FormStructure).text = this.formProvideBF[key].text
                }else{
                    (formObj[key] as FormStructure).text = ""
                }
            }
        }
        if((this.$children[0].$children[0] as any).clearMethod){
            (this.$children[0].$children[0] as any).clearMethod()
        }

        this.formProvide.formObj = {
            id:'', // 主题ID
            canNotEdit: false, // 添加数据
            interfaceType:1,
            topicName:'', // 主题名称
            messageType:'', // 消息类型
            dataBaseIp:'', // 数据库地址
            databaseType:'', // 数据库类型
            redisTimer: '',
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
        this.udf.resetValidation()
    }
}
</script>
