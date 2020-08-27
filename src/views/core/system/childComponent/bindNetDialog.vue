<template>
    <v-row>
        <v-col cols="7" offset="1" style="padding:0">
            <v-select 
            single-line 
            outlined
            dense
            solo
            label="请选择系统名称"
            :items="systems"
            height="32"
            class="dialogInput"
            :rules="systemRules"
            v-model="formProvide.formObj.systemId"
            @change="systemChange"
            required
            >
                <template v-slot:prepend>
                     <div class="text-label">
                        <p>*</p>
                        <label>系统名称：</label>
                    </div>
                </template>
            </v-select>
        </v-col>
        <v-col cols="7" offset="1" style="padding:0">
            <v-select 
            single-line 
            outlined
            dense
            solo
            label="请选择系统名称"
            :items="networks"
            height="32"
            class="dialogInput"
            v-model="formProvide.formObj.networkId"
            :rules="netWorkRules"
            @change="netWorkChange"
            required
            >
                <template v-slot:prepend>
                     <div class="text-label">
                        <p>*</p>
                        <label>网络名称：</label>
                    </div>
                </template>
            </v-select>
        </v-col>
    </v-row>
</template>
<script lang="ts">
import { Component, Vue,Inject } from "vue-property-decorator";
import http from '@/decorator/httpDecorator';
import { returnDataType } from '../../../../type/http-request.type';
import { H_Vue } from '@/declaration/vue-prototype';

@Component
@http
export default class BindNetDialog extends Vue{
    @Inject() private readonly formProvide!:H_Vue
    private networks:Array<any> = []
    private systems:Array<any> = [] 

    private systemRules = [
        (v:string) =>!!v||"请选择系统名称"
    ]

    private netWorkRules = [
        (v:string) =>!!v||"请选择网络名称"
    ]

    private netWorkChange(value:any){
        this.networks.forEach((item:any)=>{
            if(item.value==value){
                this.formProvide.formObj.networkName = item.text
            }
        })
    }

    private systemChange(value:any){
        this.systems.forEach((item:any)=>{
            if(item.value==value){
                this.formProvide.formObj.systemName = item.text
            }
        })
    }

    private clearMethod(){
        this.formProvide.formObj.networkName = ""
        this.formProvide.formObj.systemName = ""
    }

    async created() {
        const {data}:returnDataType = await this.h_request["httpGET"]("GET_SYSNET_GETSYSNETLIST",{})
        this.networks = data.network.map((n:any)=>{
            return {
                text:n.name,
                value:n.id
            }
        })
        this.systems = data.system.map((n:any)=>{
             return {
                text:n.name,
                value:n.id
            }
        })
    }
}
</script>
<style scoped>
.text-label{
    width:100px;
    display: flex;
    justify-content:flex-end;
}
.text-label p{
    color:red;
}
</style>