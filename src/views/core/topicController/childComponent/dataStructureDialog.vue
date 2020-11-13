<template>
    <div id="dataStructureDialog">
        <h-table
                v-if="rowObj.topicInterFaceType!==4"
            :headers="headers"
            :desserts="desserts"
            :height="400"
            style="margin-bottom: 10px"
        ></h-table>
        <!--如果接口类型是4 就展示一个json数据-->
        <p v-if="rowObj.topicInterFaceType===4">
            {{rowObj.dataStructSchema}}
        </p>
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Inject} from "vue-property-decorator";
import HTable from '../../../../components/h-table.vue';

@Component({
    components:{
        HTable
    }
})
export default class DataStructureDialog extends Vue{
    @Prop() private rowObj!:any
    get desserts(){
        let arr = []
        const dataStruct = JSON.parse(this.rowObj.dataStruct)[0]
        for(let key in dataStruct){
            arr.push({
                id:key,
                key:JSON.parse(this.rowObj.dsAnnotation)[key],
                value:dataStruct[key]
            })
        }
        return arr
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
}
</script>
