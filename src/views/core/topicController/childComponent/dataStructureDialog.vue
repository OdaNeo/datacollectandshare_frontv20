<template>
    <div id="dataStructureDialog">
        <h-table
            :headers="otherHeaders"
            :desserts="desserts2"
            :height="100"
            style="margin-bottom: 10px"
            v-show="onlyShowOther&&showOther"
        ></h-table>
        <!-- 服务器拉取数据的头信息 -->
        <h-table
            :headers="otherHeaders3"
            :desserts="desserts3"
            style="margin-bottom: 10px"
            v-show="onlyShowOther&&showOther&&showHeader"
        ></h-table>
        <h-table
            v-show="!onlyShowOther"
            :headers="headers"
            :desserts="desserts"
            :height="400"
            style="margin-bottom: 10px"
        ></h-table>
    </div>
</template>
<script lang="ts">
    import {Component, Vue, Prop, Inject} from "vue-property-decorator";
import HTable from '../../../../components/h-table.vue';
    import {H_Vue} from "@/declaration/vue-prototype";

@Component({
    components:{
        HTable
    }
})
export default class DataStructureDialog extends Vue{
    @Prop() private rowObj!:any
    @Prop() private otherObj!:any // 展示附加信息
    @Prop() private onlyShowOther!:any //展示头信息
    private showHeader:boolean = false
    @Inject() private readonly formProvide!:H_Vue
    private showOther:boolean = false
    get desserts(){
        console.log(this.rowObj)
        switch (this.rowObj.topicInterFaceType) {
            case 1:
                // 没有额外信息
                this.showOther = false
                this.showHeader = false
                break
            case 2:
                this.showOther = true
                this.showHeader = false
                this.otherHeaders = [
                    {
                        text:"数据库地址",
                        align: "center",
                        value:"dataBaseIp",
                    },
                    {
                        text:"数据库类型",
                        align: "center",
                        value:"dataBaseType"
                    }
                ]
                break
            case 3:
                this.showOther = true
                this.showHeader = true
                this.otherHeaders = [
                    {
                        text:"url",
                        align: "center",
                        value:"url"
                    }
                ]
                break
        }
        let arr = []
        const dataStruct = JSON.parse(this.rowObj.dataStruct)[0]
        for(let key in dataStruct){
            arr.push({
                id:key,
                key:JSON.parse(this.rowObj.structMapping)[key],
                value:dataStruct[key]
            })
        }
        return arr
    }
    get desserts2(){
        console.log('当前数据',this.otherObj)
        return this.otherObj[0]
    }
    get desserts3(){
        if(this.otherObj[0]){
            console.log('当前数2',JSON.parse(this.otherObj[0].header))
            return JSON.parse(this.otherObj[0].header)
        }
    }
    private headers = [
        {
            text:"数据编号",
            align: "center",
            value:"id",
        },
        {
            text:"数据key",
            align: "center",
            value:"key"
        },
        {
            text:"数据value",
            align: "center",
            value:"value"
        }
    ]
    private otherHeaders3 = [
        {
            text:"头信息：键",
            align: "center",
            value:"key",
        },
        {
            text:"头信息：值",
            align: "center",
            value:"value"
        },

    ]
    private otherHeaders:Array<any> = []
}
</script>
