<template>
    <div id="exportExcelFromDialog">
        <v-card elevation="0">
            <v-card-subtitle 
            style="color:red;margin-top:-20px;margin-bottom:15px">温馨提示：导出excel时间较长，请核对筛选条件后点击确认开始导出！</v-card-subtitle>
            <v-card-text v-if="formProvide.formObj.username">{{"用户名："+formProvide.formObj.username}}</v-card-text>
            <v-card-text v-if="formProvide.formObj.method">{{"方法名："+formProvide.formObj.method}}</v-card-text>
            <v-card-text v-if="formProvide.formObj.operationType">{{"方法类型："+formProvide.formObj.operationType}}</v-card-text>
            <v-card-text v-if="formProvide.formObj.startTime">{{"起始时间："+h_utils.timeUtil.stamptoTime(formProvide.formObj.startTime)}}</v-card-text>
            <v-card-text v-if="formProvide.formObj.endTime">{{"结束时间："+h_utils.timeUtil.stamptoTime(formProvide.formObj.endTime,"-")}}</v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue , Model, Inject, Prop } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import util from '@/decorator/utilsDecorator'

@Component
@util
export default class ExportExcelFromDialog extends Vue{
    @Inject() private readonly formProvide!: H_Vue
}
</script>