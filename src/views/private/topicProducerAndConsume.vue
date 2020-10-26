<template>
    <div id="topicProducerAndConsume">
        <div id="topicProducer">
            <h3>主题生产数据</h3>
            <v-form
            ref="producerForm"
            >
               <v-row>
                   <v-col cols="10" offset="1" style="padding:0">
                        <v-text-field
                            v-model="topicId"
                            solo
                            dense
                            placeholder="请输入查找的主题ID"
                            clearable
                        ></v-text-field>
                    </v-col>
                    <v-col cols="10" offset="1" style="padding:0">
                        <v-radio-group
                        v-model="producerMsgState"
                        single-line
                        outlined
                        dense
                        solo
                        row
                        >
                            <v-radio
                                v-for="n in msgStates"
                                :key="n.value"
                                :label="`${n.text}`"
                                :value="n.value"
                            ></v-radio>
                        </v-radio-group>
                    </v-col>
                    <v-col cols="10" offset="1" v-if="producerMsgState=='2'" style="padding:0">
                        <v-textarea
                        solo
                        name="input-7-4"
                        label="主题生产数据"
                        ></v-textarea>
                    </v-col>
                    <v-col cols="10" offset="1" v-if="producerMsgState=='1'" style="padding:0">
                        <v-text-field
                            v-model="createMsgNum"
                            solo
                            dense
                            placeholder="随机生成数据数量"
                            clearable
                        ></v-text-field>
                    </v-col>
                    <v-col cols="10" offset="1" v-if="producerMsgState=='1'" style="padding:0">
                        <v-btn
                        color="primary"
                        class="mr-4"
                        solo
                        @click="createMsg"
                        >
                            生成数据
                        </v-btn>
                    </v-col>
                    <v-col cols="10" offset="1" v-if="producerMsgState=='1'" style="padding:0" class="expansion">
                        <v-expansion-panels>
                            <v-expansion-panel
                            v-for="(item,i) in createMsgArray"
                            :key="i"
                            >
                            <v-expansion-panel-header  color="green">随机生成数据{{i+1}}</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                {{item}}
                            </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                    <v-col cols="10" offset="1" v-if="producerMsgState=='1'" style="padding:0;margin-top:10px">
                        <v-text-field
                            v-model="sendMsgRate"
                            solo
                            dense
                            placeholder="数据发送频率（毫秒值）"
                            clearable
                        ></v-text-field>
                    </v-col>
                    <v-col cols="10" offset="1" v-if="producerMsgState=='1'" style="padding:0">
                        <v-text-field
                            v-model="delayConsume"
                            solo
                            dense
                            placeholder="延迟消费（毫秒值）"
                            clearable
                        ></v-text-field>
                    </v-col>
                    <v-col cols="10" offset="1" style="padding:0">
                        <v-btn
                        color="primary"
                        class="mr-4"
                        solo
                        @click="sendMsg"
                        >
                            单独发送数据
                        </v-btn>
                         <v-btn
                        color="primary"
                        class="mr-4"
                        solo
                        @click="sendMsgAndConsume"
                        >
                            发送数据并消费
                        </v-btn>
                    </v-col>
               </v-row>
            </v-form>
        </div>
        <div id="topicConsume">
            <h3>主题消费数据</h3>
        </div>
    </div>
</template>
<script lang="ts">
import http from '@/decorator/httpDecorator';
import { Component, Vue} from "vue-property-decorator";

@Component
@http
export default class TopicProducerAndConsume extends Vue{
    private producerForm:boolean = true

    private topicId:string = ""

    private createMsgNum:string = "" 

    private producerMsgState:string = ""

    private createMsgArray:any[] = []

    private sendMsgRate:string = ""

    private delayConsume:string = ""

    private msgStates:Array<any> = [{text:"随机生成数据",value:"1"},{text:"指定数据",value:"2"}]

    private async createMsg(){
        const result = await this.h_request["httpGET"]<object>("GET_TOPICS_SELECTTOPIC",{
            topicID:this.topicId,
            pageNum:1,
            pageSize:10
        })
        const dataStruct = JSON.parse(result.data.list[0].dataStruct)[0]
        this.createMsgArray = this.createRandom(dataStruct)
    }

    private createRandom(dataStruct:any){
        const num:number = this.createMsgNum==""?10:Number(this.createMsgNum)
        let createRandomArray = []
        for(let i=0;i<num;i++){
            let createRandom:any = {}
            for (let key in dataStruct) {
                let val:any
                switch (dataStruct[key]) {
                    case 1:
                        val = i+1;
                        break;
                    case "str":
                        val = "str"+i
                        break;
                    default:
                        break;
                }
                createRandom[key] = val
            }
            createRandomArray.push(createRandom)
        }
        return createRandomArray
    }

    private sendMsg(){
        this.createMsgArray.forEach((element:any,i:number) => {
            setTimeout(async ()=>{
                const {success} = await this.h_request["httpPOST"]("POST_TRANSMISSION_ATS",{
                    data:[
                        element
                    ]
                },this.topicId)
                if(success){

                }
            },Number(this.sendMsgRate)*i)
        });
    }

    private sendMsgAndConsume(){

    }
}
</script>
<style scoped>
    #topicProducerAndConsume{
        height:100%;
        display: flex;
        border:1px solid rgba(0,0,0,0.87);
    }
    #topicProducerAndConsume h3{
        text-align: center;
    }
    #topicProducer{
        width:35%;
        height:100%;
        border-right:1px solid rgba(0,0,0,0.87)
    }
    #topicConsume{
        height:100%;
        width:65%
    }
    .expansion{
        margin-top:20px;
        max-height: 250px;
        overflow-x: hidden;
        overflow-y:auto;
    }
</style>