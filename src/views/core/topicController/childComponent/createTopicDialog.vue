<template>
    <v-row id="createTopicDialog">
        <v-col cols="9" offset="1" style="padding:0">
            <v-text-field
            single-line 
            outlined
            clearable
            dense
            solo
            height="32"
            class="dialogInput"
            v-model="topicName"
            :rules="topicNameRules"
            required
            >
                <template v-slot:prepend>
                    <div class="text-label">
                        <p>*</p>
                        <label>主题名称：</label>
                    </div>
                </template>
            </v-text-field>
        </v-col>
        <v-col cols="9" offset="1" style="padding:0">
            <v-radio-group 
            v-model="messageType"
            single-line 
            outlined
            dense
            class="dialogInput"
            height="32"
            solo
            row
            :rules="messageTypeRules"
            required
            >
                <template v-slot:prepend>
                    <div class="text-label" style="margin-top:7px">
                        <p>*</p>
                        <label>消息类型：</label>
                    </div>
                </template>
                <v-radio
                    v-for="n in types"
                    :key="n.value"
                    :label="`${n.text}`"
                    :value="n.value"
                ></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import http from '@/decorator/httpDecorator';
import { returnDataType } from '@/type/http-request.type';

@Component
@http
export default class CreateTopicDialog extends Vue{
    private topicName:string = ""
    private messageType:string = ""
    private bool:boolean = false
    private types:Array<any> = [{text:"数据量优先",value:"1"},{text:"顺序优先",value:"2"}]

    private topicNameRules = [
        (v:string) =>!!v||"主题名称不能为空",
        (v:string) =>(v&&v.length<=20) || "主题名称最长可设置20个字符",
        (v:string) => /^\w*$/.test(v) || "主题名称只能为数字、字母、下划线的组合"
    ]

    private messageTypeRules = [
        (v:string) =>!!v||"请选择消息类型"
    ]

    private clearMethod(){
        this.topicName = ""
        this.messageType = ""
    }
}
</script>

<style scoped>
.text-label{
    width:120px;
    display: flex;
    justify-content:flex-end;
}
.text-label p{
    color:red;
}
</style>