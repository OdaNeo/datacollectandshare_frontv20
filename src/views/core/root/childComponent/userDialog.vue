<template>
    <v-row>
        <v-col cols="9" offset="1" style="padding:0">
            <v-text-field
            single-line
            outlined
            clearable
            dense
            solo
            height="32"
            class="dialogInput"
            v-model="formProvide.formObj.loginName.text"
            :rules="loginNameRules"
            required
            :disabled="formProvide.formObj.loginName.disabled"
            >
                <template v-slot:prepend>
                    <div class="text-label">
                        <p>*</p>
                        <label>用户名：</label>
                    </div>
                </template>
            </v-text-field>
        </v-col>
        <v-col cols="9" offset="1" style="padding:0" v-if="formProvide.formObj.loginPwd.show">
            <v-text-field
            single-line
            outlined
            clearable
            dense
            solo
            height="32"
            class="dialogInput"
            v-model="formProvide.formObj.loginPwd.text"
            :rules="loginPwdRules"
            required
            >
                <template v-slot:prepend>
                    <div class="text-label">
                        <p>*</p>
                        <label>密码：</label>
                    </div>
                </template>
            </v-text-field>
        </v-col>
        <v-col cols="7" offset="1" style="padding:0">
            <v-select
            single-line
            outlined
            dense
            solo
            label="请选择用户类型"
            :items="userRoots"
            height="32"
            class="dialogInput"
            v-model="formProvide.formObj.userType.text"
            :rules="userTypeRules"
            required
            >
                <template v-slot:prepend>
                    <div class="text-label">
                        <p>*</p>
                        <label>用户类型：</label>
                    </div>
                </template>
            </v-select>
        </v-col>
        <v-col cols="9" offset="1" style="padding:0">
            <v-radio-group
            v-model="formProvide.formObj.userState.text"
            single-line
            outlined
            dense
            class="dialogInput"
            height="32"
            solo
            row
            :rules="userStateRules"
            required
            >
                <template v-slot:prepend>
                    <div class="text-label" style="margin-top:7px">
                        <p>*</p>
                        <label>用户状态：</label>
                    </div>
                </template>
                <v-radio
                    v-for="n in userStates"
                    :key="n.value"
                    :label="`${n.text}`"
                    :value="n.value"
                ></v-radio>
            </v-radio-group>
        </v-col>
        <v-col cols="7" offset="1" style="padding:0">
            <v-select
            single-line
            outlined
            dense
            solo
            label="请选择系统名称"
            :items="systemNames"
            height="32"
            class="dialogInput"
            v-model="formProvide.formObj.systemName.value"
            :rules="systemNameRules"
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
    </v-row>
</template>
<script lang="ts">
import { Component, Vue,Inject,Emit } from "vue-property-decorator";
import http from "../../../../decorator/httpDecorator";
import { returnDataType, httpAllParams } from '../../../../type/http-request.type';
import { H_Vue } from '../../../../declaration/vue-prototype';
import { userFormVar } from '../../../../type/user.type';
@Component
@http
export default class UserDialog extends Vue{
    @Inject() private readonly formProvide!:H_Vue
    private userStates:Array<userFormVar> = [{text:"正常",value:"1"},{text:"锁定",value:"2"},{text:"删除",value:"0"}]
    private userRoots:Array<userFormVar> = []
    private systemNames:Array<userFormVar> = []

    private loginNameRules:Array<Function> = [
        (v:string) =>!!v||"请设置用户名"
    ]

    private loginPwdRules:Array<Function> = [
        (v:string) =>!!v||"请设置用户密码"
    ]

    private userTypeRules:Array<Function> = [
        (v:string) =>!!v||"请选择用户类型"
    ]

    private userStateRules:Array<Function> = [
        (v:string) =>!!v||"请选择用户状态"
    ]

    private systemNameRules:Array<Function> = [
        (v:string) =>!!v||"请选择系统名称"
    ]

    private getUserRoot({data}:returnDataType){
        this.userRoots = data.map((s:any)=>{
            return {
                text:s.name,
                value:s.id.toString()
            }
        })
    }
    private getSystemName({data}:returnDataType){
        this.systemNames = data.map((s:any)=>{
            return {
                text:s.name,
                value:s.id.toString()
            }
        })
    }
    private async httpAll(){
        const results = await this.h_request["httpAll"]<httpAllParams>([
            {
                name:"GET_USER_ADDUSER_FIND_ALL_ROLE",
                method:"get",
                data:{}
            },
            {
                name:"GET_USER_ADDUSER_GET_SYSTEM_INFO_ADD_ADDUSER",
                method:"get",
                data:{}
            }
        ])
        this.getUserRoot(results[0])
        this.getSystemName(results[1])
    }
    created() {
        this.httpAll()
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
