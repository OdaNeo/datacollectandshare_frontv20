<template>
    <div id="viewLog">
        <v-row>
            <v-col cols="2">
                <v-text-field
                solo
                dense
                placeholder="请输入查找的用户名"
                clearable
                v-model="queryUserName"
                >

                </v-text-field>
            </v-col>
            <v-col cols="2" style="max-width:19%;flex:0 0 19%">
                <h-date-picker
                placeholder="选择查询起始时间"
                :begin="true"
                :anotherDate="afterDate"
                @pickerDate = "(time)=> beginDate=time"
                ></h-date-picker>
            </v-col>
            <v-col cols="2" style="max-width:19%;flex:0 0 19%">
                <h-date-picker
                placeholder="选择查询截止时间"
                :begin="false"
                :anotherDate="beginDate"
                @pickerDate = "(time)=> afterDate=time"
                ></h-date-picker>
            </v-col>
        </v-row>
        <h-table
        :headers="headers"
        :desserts="desserts"
        :height="450"
        :pageNum="pageNum"
        :paginationLength="paginationLength"
        @PaginationsNow = "PaginationsNow"
        ></h-table>
    </div>
</template>
<script lang="ts">
import { Component, Vue,Provide} from "vue-property-decorator";
import HTable from '../../../components/h-table.vue';
import http from '@/decorator/httpDecorator';
import { returnDataType } from '../../../type/http-request.type';
import util from '@/decorator/utilsDecorator';
import HDatePicker from '../../../components/h-date-picker.vue';

@Component({
    components:{
        HTable,
        HDatePicker
    }
})
@http
@util
export default class ViewLog extends Vue{
    private pageSize:number = 20
    private pageNum:number = 1
    private desserts:Array<any> = []
    private paginationLength:number = 0
    private dialogFlag:boolean = false
    private queryUserName:string = ""
    private beginDate:string|null = null
    private afterDate:string|null = null
    private headers = [
        {
            text:"用户名称",
            align:"center",
            value:"username"
        },
        {
            text:"用户IP",
            align:"center",
            value:"ip"
        },
        {
            text:"方法名称",
            align:"center",
            value:"method"
        },
        {
            text:"创建时间",
            align:"center",
            value:"createdate",
            format:(time:number)=>{
                return this.h_utils.timeutil.stamptoTime(time,"-")
            }
        },
        {
            text:"描述信息",
            align:"center",
            value:"operation"
        }
    ]

    private async searchMethod(bool:boolean,params:object){
        const {data}: returnDataType = bool?await this.h_request["httpGET"]<object>("GET_SYSNET_GETBINDBYNAME",params):await this.h_request["httpGET"]<object>("GET_LOGMGT_VIEWLOG_LOG_FINDALLLOG",params)
        this.paginationLength = Math.floor((data["total"]/this.pageSize)+1)
        this.desserts = data["list"]
    }

    private PaginationsNow(page:number){
        this.pageNum = page
        this.searchMethod(false,{
            pageSize:this.pageSize,
            pageNum:this.pageNum
        })
    }

    created() {
        this.searchMethod(false,{
            pageSize:this.pageSize,
            pageNum:this.pageNum
        })
    }
}
</script>