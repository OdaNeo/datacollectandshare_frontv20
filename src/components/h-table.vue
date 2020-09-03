<template>
    <div id="h-table">
        <div
        class="simple-table"
        :style="maxHeight?'max-height:'+maxHeight+'px':''"
        >
            <v-simple-table
            fixed-header
            :height="height?height+'px':undefined"
            dense>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th
                            v-for="(header,index) in headers"
                            :key="index"
                            :class="'text-'+header.align"
                            :style="header.divider?'border:1px solid rgba(0, 0, 0, 0.12)':''"
                            >{{header.text}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,key) in desserts2" :key="key" v-show="showFun(item.parentid)">
                            <td
                            v-for="(header,index) in headers"
                            :key="index"
                            :class="'text-'+header.align"
                            :style="header.divider?'border:1px solid rgba(0, 0, 0, 0.12)':''"
                            >
                                <div :style="'margin-left:'+(header.expand?(item.icon?((item.level-1)*10):((item.level-1)*20)):0)+'px'">
                                    <v-icon
                                    v-if="header.expand&&item.icon"
                                    @click="expandMethod(item)"
                                    :style="expandStyle(item)"
                                    >mdi-chevron-right</v-icon>
                                    {{header.format?header.format(item[header.value]):item[header.value]}}
                                    <slot
                                    :name="header.slot"
                                    v-if="header.slot"
                                    :item = item
                                    :index= key
                                    ></slot>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
        <v-pagination
        :length="paginationLength"
        :total-visible="7"
        circle
        @input="handleCurrentChange"
        :value="pageNum"
        v-if="paginationLength&&pageNum"
        ></v-pagination>
    </div>
</template>
<script lang="ts">
import { Component, Vue,Watch,Prop,Emit } from "vue-property-decorator";

@Component
export default class HTable extends Vue{
    private desserts2:Array<any> = []
    private expanded:Array<any> = []

    @Prop() private maxHeight!:number
    @Prop() private height!:number
    @Prop() private paginationLength!:number
    @Prop() private pageNum!:number
    @Prop() private headers!:any
    @Prop() private desserts!:any

    @Watch("desserts")
    private dessertsChanged(val:any,oldVal:any):void{
        this.desserts2 = []
        this.dessertsRecursion(val,1)
    }

    private dessertsRecursion(val:any,level:number){
        const nowVal = Object.prototype.toString.call(val) == '[object Array]'?val:[val]

        nowVal.forEach((dessert:any) => {
            if(dessert&&dessert.childrenList&&dessert.childrenList.length>0){
                this.desserts2.push({...dessert,level,icon:true})
                this.dessertsRecursion(dessert.childrenList,level+1)
            }else{
                this.desserts2.push({...dessert,level,icon:false})
            }
        });
    }

    private showFun(parentid:number){
        if(parentid==null){
            return true
        }else{
            return this.expanded.some((val:number)=>{
                return val == parentid
            })
        }
    }

    private expandMethod(expand:any){
        const flag = this.expanded.some((num:number)=>{
            return num==expand.id
        })
        if(flag){
            if(expand.parentid==null){
                this.expanded = []
            }else{
                this.expanded.forEach((num,index)=>{
                    if(num==expand.id){
                        this.expanded.splice(index,1)
                    }
                })
            }
        }else{
            this.expanded = []
            if(expand.parentid==null){
                this.expanded.push(expand.id)
            }else{
                this.expanded.push(expand.parentid)
                this.expanded.push(expand.id)
            }
        }
    }

    private expandStyle(expand:any){
        const flag = this.expanded.some((num:number)=>{
            return num==expand.id
        })
        if(flag){
            return "transform:rotate(90deg)"
        }else{
            return "transform:rotate(0deg)"
        }
    }

    @Emit("PaginationsNow") private handleCurrentChange(value:number):number{
        return value
    }

    created() {
        this.dessertsRecursion(this.desserts,1)
    }
}
</script>

<style scoped>
.simple-table{
    border:1px solid rgba(0, 0, 0, 0.12);
    border-radius:5px;
    background-color:#FFF;
    border-collapse: collapse;
    box-shadow:0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) !important;
    overflow-y:auto;
    overflow-x:hidden;
}
.simple-table table thead tr th{
    border:1px solid rgba(0, 0, 0, 0.12);
    border-top:0px !important;
    border-left:0px !important;
}
.simple-table table thead tr th:last-child{
    border-right:0px !important;
}
.simple-table table tbody tr td{
    border:1px solid rgba(0, 0, 0, 0.12);
    border-top: 0px !important;
    border-left:0px !important;
}
.simple-table table tbody tr td:last-child{
    border-right:0px !important;
}
</style>
