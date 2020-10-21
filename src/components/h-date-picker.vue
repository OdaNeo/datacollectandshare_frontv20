<template>
    <v-menu
    :ref="refMenu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="date"
    transition="scale-transition"
    offset-y
    >
        <template v-slot:activator="{ on, attrs }">
            <v-text-field
            v-model="date"
            solo
            dense
            :placeholder="placeholder"
            readonly
            prepend-inner-icon="mdi-magnify"
            v-bind="attrs"
            v-on="on"
            ></v-text-field>
        </template>
        <v-date-picker
        v-model="date"
        no-title
        scrollable
        locale="zh-cn"
        :allowed-dates="begin?allowedBeginDates:allowedAfterDates">
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="cancelClick">取消</v-btn>
            <v-btn text color="primary" @click="pickerClick">确定</v-btn>
        </v-date-picker>
    </v-menu>
</template>
<script lang="ts">
import { Component, Vue,Prop,Emit} from "vue-property-decorator";
import util from '@/decorator/utilsDecorator';

@Component
@util
export default class HDatePicker extends Vue{
    @Prop() private placeholder!:string
    @Prop() private begin!:string
    @Prop() private anotherDate!:null|string

    private menu:boolean = false
    private date:string|null = null

    get refMenu(){
        return this.begin?"beginMenu":"afterMenu"
    }

    private allowedBeginDates(val:string){
        if(!this.anotherDate){
            return true
        }else{
            const beginTime = this.h_utils.timeutil.timeToStamp(val,"-")
            const afterTime = this.h_utils.timeutil.timeToStamp(this.anotherDate,"-")
            return afterTime>beginTime
        }
    }

    private allowedAfterDates(val:string){
        if(!this.anotherDate){
            return true
        }else{
            const afterTime = this.h_utils.timeutil.timeToStamp(val,"-")
            const beginTime = this.h_utils.timeutil.timeToStamp(this.anotherDate,"-")
            return beginTime<afterTime
        }
    }

    @Emit("pickerDate") private pickerClick(){
        (this.$refs[this.refMenu] as any).save(this.date)
        return this.date
    }
    @Emit("pickerDate") private cancelClick(){
        (this.$refs[this.refMenu] as any).save('')
        return ''
    }
}
</script>
