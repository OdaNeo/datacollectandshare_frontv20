<template>
    <div id="welcome">
        <div class="topContent">
            <system-topic-proportion></system-topic-proportion>
            <user-proportion></user-proportion>
        </div>
        <div class="btmContent" style="width:100%;height:60.5%;display:flex;justify-content:space-around;margin-top:1%">
            <release-menu :systemItems="systemItems"></release-menu>
            <subscribe-menu :systemItems="systemItems"></subscribe-menu>
        </div>
        <!-- <v-snackbar
        v-model="snackbar"
        >
            close
        </v-snackbar> -->
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { returnDataType} from '../../../type/http-request.type';
import http from '../../../decorator/httpDecorator';
import echarts from '../../../decorator/echarsDecorator';
import { topicRankingInfo, topicRankingData } from '../../../type/welcome.type';
import ReleaseMenu from './childComponent/releaseMenu.vue';
import SystemTopicProportion from './childComponent/systemTopicProportion.vue';
import UserProportion from './childComponent/userProportion.vue';
import { userInfo } from '@/type/user.type';
import SubscribeMenu from './childComponent/subscribeMenu.vue';
import http2 from '../../../decorator/httpDecorator2';


@Component({
    components:{
        ReleaseMenu,
        SubscribeMenu,
        SystemTopicProportion,
        UserProportion
    }
})
@echarts
// @http2()
export default class Welcome extends Vue{
    private systemItems:any[] = []
    // private snackbar:boolean = true

    private getYearsList(arr:string[],endTime:string):string[]{
        const yearsList:string[] = []
        const timearr = endTime.split("-")
        const year = parseInt(timearr[0])
        const month = parseInt(timearr[1])
        const day = timearr[2]?parseInt(timearr[2]):""
        for(let i=0;i<12;i++){
            if(month-i>0){
                yearsList.unshift(`${year}${arr[0]}${(month-i).toString().padStart(2,"0")}${arr[1]?arr[1]:''}`)
            }else{
                yearsList.unshift(`${year-1}${arr[0]}${(12+(month-i)).toString().padStart(2,"0")}${arr[1]?arr[1]:''}`)
            }
        }
        return yearsList
    }
    private getKeysList(list:Array<object>):Array<Array<string>>{
        return Array.from({length:12},(v,k)=>{
            return list.map((obj)=>{
                return Object.keys(obj)[0]
            })
        })
    }
    private getDatasList(years:string[],list:Array<userInfo>):Array<Array<number>>{
        return Array.from({length:12},(v,k)=>{
            return list.map((obj)=>{
                return obj[Object.keys(obj)[0]].reduce(({time:prevtime,count:prevcount}:topicRankingData,{time:nexttime,count:nextcount}:topicRankingData) => {
                    if(nexttime.indexOf(years[k])==-1){
                        return {time:years[k],count:Number(prevcount)}
                    }else{
                        return {time:years[k],count:Number(prevcount) + Number(nextcount)}
                    }
                },{time:years[k],count:0}).count;
            })
        })
    }
    public topicRanking(elementName:string,msg:topicRankingInfo,endTime:string){
        const _this = this
        const years:Array<string> = this.getYearsList(["年","月"],endTime)
        const keysList:Array<Array<string>> = this.getKeysList(msg.list)
        const datasList:Array<Array<number>>= this.getDatasList(this.getYearsList(["-","-"],endTime),msg.list)
        this.$nextTick(function(){
            const element = document.getElementById(elementName)
            let myChartElement = this.h_echars.init(element as HTMLCanvasElement) 
            myChartElement.setOption({
                baseOption:{
                    timeline:{
                        data: years,
                        axisType: 'category',
                        autoPlay: true,
                        playInterval: 1500,
                        left: '8%',
                        right: '2%',
                        width: '85%',
                        label: {
                            normal: {
                                textStyle: {
                                    color: '#FFF',
                                }
                            },
                            emphasis: {
                                textStyle: {
                                    color: '#884046'
                                }
                            }
                        },
                        symbolSize: 10,
                        lineStyle: {
                            color: '#red'
                        },
                        checkpointStyle: {
                            borderColor: '#red',
                            borderWidth: 2
                        },
                        controlStyle: {
                            showNextBtn: true,
                            showPrevBtn: true,
                            normal: {
                                color: '#ff8800',
                                borderColor: '#ff8800'
                            },
                            emphasis: {
                                color: 'red',
                                borderColor: 'red'
                            }
                        }
                    },
                    title: {
                        text: '',
                        right: '10%',
                        bottom: '25%',
                        textStyle: {
                            fontSize: 20,
                            color: '#FFF'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: (params:any)=>{
                            if(Array.isArray(params)){
                                if(params[0].componentType=="timeline"){
                                    return params[0].name
                                }else{
                                    return `主题${params[0].name}发布${params[0].value}条主题`
                                }
                            }else{
                                if(params.componentType=="timeline"){
                                    return params.name
                                }else{
                                    return `主题${params.name}发布${params.value}条主题`
                                }
                            }
                        }
                    },
                    calculable: true,
                    grid: {
                        left: '14%',
                        right: '7%',
                        bottom: '14%',
                        top: '5%',
                        containLabel: true
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: 'red'
                            }
                        }
                    },
                    yAxis: [{
                        nameGap: 50,
                        offset: '37',
                        'type': 'category',
                        interval: 50,
                        data: '',
                        nameTextStyle: {
                            color: 'red'
                        },
                        axisLabel: {
                            show: false,
                            textStyle: {
                                fontSize: 32,
                                color: function(params:string, Index:number) {
                                    const colorarrays = ['#6bc0fb', '#7fec9d', '#fedd8b', '#ffa597', '#84e4dd', '#749f83',
                                                        '#ca8622', '#bda29a', '#a8d8ea', '#aa96da', '#fcbad3', '#ffffd2',
                                                        '#f38181', '#fce38a', '#eaffd0', '#95e1d3', '#e3fdfd', '#749f83', '#ca8622'
                                    ];
                                    return colorarrays[keysList[0].indexOf(params)];
                                },
                            }, 
                            interval: 50
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'balck'
                            }
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: 'balck'
                            }
                        }

                    }],
                    xAxis: [{
                        'type': 'value',
                        'name': '',
                        splitNumber: 8,
                        nameTextStyle: {
                            color: 'balck'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#ffa597' //X轴颜色
                            }
                        },
                        axisLabel: {
                            formatter: '{value} '
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#fedd8b'
                            }
                        },
                    }],
                    series: [{
                        'name': '',
                        'type': 'bar',
                        markLine: {
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            lineStyle: {
                                normal: {
                                    color: 'red',
                                    width: 3
                                }
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                formatter: '{c}'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: function(params:any) {        
                                    const colorList = ['#6bc0fb', '#7fec9d', '#fedd8b', '#ffa597', '#84e4dd', '#749f83',
                                                    '#ca8622', '#bda29a', '#a8d8ea', '#aa96da', '#fcbad3', '#ffffd2',
                                                    '#f38181', '#fce38a', '#eaffd0', '#95e1d3', '#e3fdfd', '#749f83', '#ca8622'
                                    ];
                                    return colorList[keysList[0].indexOf(params.name)];
                                },
                            }
                        },
                    },
                    {
                        'name': '',
                        'type': 'bar',
                        markLine: {
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            lineStyle: {
                                normal: {
                                    color: 'red',
                                    width: 3
                                }
                            },
                        },
                        barWidth: '50%',
                        barGap: '-100%',
                        label: {
                            normal: {
                                show: true,
                                fontSize: 12,
                                position: 'left',
                                formatter: function(params:any) {
                                    return params.name;
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: function(params:any) {
                                    const colorList = ['#6bc0fb', '#7fec9d', '#fedd8b', '#ffa597', '#84e4dd', '#749f83',
                                                    '#ca8622', '#bda29a', '#a8d8ea', '#aa96da', '#fcbad3', '#ffffd2',
                                                    '#f38181', '#fce38a', '#eaffd0', '#95e1d3', '#e3fdfd', '#749f83', '#ca8622'
                                    ];
                                    return colorList[keysList[0].indexOf(params.name)];
                                },
                            }
                        },
                    }],
                    animationEasingUpdate: 'quinticInOut',
                    animationDurationUpdate: 1500,
                },
                options: _this.pushOption(years,keysList,datasList)
            },true)
        })
    }
    private pushOption(years:Array<string>,keysList:Array<Array<string>>,datasList:Array<Array<number>>){
        let options = []
        for (var n = 0; n < years.length; n++) {
            let res = [];
            for (var j = 0; j < datasList[n].length; j++) {
                res.push({
                    name: keysList[n][j],
                    value: datasList[n][j]
                });
            }
            res.sort(function(a, b) {
                return b.value - a.value;
            }).slice(0, 6);
            res.sort(function(a, b) {
                return a.value - b.value;
            });
            let res1 = [];
            let res2 = [];
            for (let t = 0; t < res.length; t++) {
                res1[t] = res[t].name;
                res2[t] = res[t].value;
            }
            options.push({
                title: {
                text: years[n]
                },
                yAxis: {
                    data: res1,
                },
                series: [{
                data: res2
                }, {
                data: res2
                }]
            });
        }
        return options
    }

    async created():Promise<void> {
        // const {data}:returnDataType = await this.h_request["httpGET"]("GET_SYSTEM_GETSYSTEMINFO",{})
        // this.systemItems = data
        // const result = await this.h_request2["GET_SYSTEM_GETSYSTEMINFO"]({a:1})
        // console.log(result)
    }
}
</script>
<style lang="stylus" scoped>
    #welcome
        width:100%
        height:100%
        .btmContent
        .topContent
            width:100%
            height:30%
            display:flex
            justify-content:space-around
            .viewBox
                width:49%
                height:100%
                background:rgb(30,31,67)
                box-shadow: 2px 6px 15px 0 rgba(69,65,78,.1)
                border-radius: 4px
                transition: .5s all ease
                position: relative
                animation-duration:2s
                animation-delay:1s
            .enter
                transform: scale(1.03)
    ::-webkit-scrollbar
        display:none
    
</style>