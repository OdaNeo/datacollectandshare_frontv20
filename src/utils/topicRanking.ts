import { userInfo } from '@/type/user.type'
import { topicRankingInfo, topicRankingData } from '@/type/welcome.type'
import Echarts from 'echarts'
const echarts = Echarts

class topicRanking {
  public static init(elementName: string, msg: topicRankingInfo, endTime: string): void {
    // console.log(msg)
    const years: Array<string> = this.getYearsList(['年', '月'], endTime) // ["2020年03月", "2020年04月",]
    const keysList: Array<Array<string>> = this.getKeysList(msg.list) // [["dubbo_test", "test"],["dubbo_test", "test"]]
    const dataList: Array<Array<number>> = this.getDataList(this.getYearsList(['-', '-'], endTime), msg.list) // [[0,0,0],[0,0,0]]

    const element = document.getElementById(elementName)
    const myChartElement = echarts.init(element as HTMLCanvasElement)
    myChartElement.setOption(
      {
        baseOption: {
          timeline: {
            data: years,
            axisType: 'category',
            autoPlay: true,
            playInterval: 4500,
            left: '6%',
            right: '0%',
            width: '87%',
            label: {
              normal: {
                textStyle: {
                  color: '#000'
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
              fontSize: 14,
              color: '#000'
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: (
              params:
                | Array<{
                    componentType: string
                    name: unknown
                    value: unknown
                  }>
                | { componentType: string; name: unknown; value: unknown }
            ) => {
              if (Array.isArray(params)) {
                if (params[0].componentType === 'timeline') {
                  return params[0].name
                } else {
                  return `主题${params[0].name}发布${params[0].value}条主题`
                }
              } else {
                if (params.componentType === 'timeline') {
                  return params.name
                } else {
                  return `主题${params.name}发布${params.value}条主题`
                }
              }
            }
          },
          calculable: true,
          grid: {
            left: '15%',
            right: '12%',
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
          yAxis: [
            {
              name: '主题名',
              nameGap: 1,
              type: 'category',
              interval: 50,
              data: '',
              axisLabel: {
                show: false,
                textStyle: {
                  fontSize: 32,
                  color: function (params: string) {
                    const colorArrays = [
                      '#6bc0fb',
                      '#7fec9d',
                      '#fedd8b',
                      '#ffa597',
                      '#84e4dd',
                      '#749f83',
                      '#ca8622',
                      '#bda29a',
                      '#a8d8ea',
                      '#aa96da',
                      '#fcbad3',
                      '#ffffd2',
                      '#f38181',
                      '#fce38a',
                      '#eaffd0',
                      '#95e1d3',
                      '#e3fdfd',
                      '#749f83',
                      '#ca8622'
                    ]
                    return colorArrays[keysList[0].indexOf(params)]
                  }
                },
                interval: 50
              },
              axisLine: {
                lineStyle: {
                  color: '#ffa597'
                }
              },
              splitLine: {
                show: false
              }
            }
          ],
          xAxis: [
            {
              type: 'value',
              name: '主题数目',
              splitNumber: 5,
              min: 0,
              minInterval: 1,
              nameTextStyle: {
                color: 'black'
              },
              axisLine: {
                lineStyle: {
                  color: '#ffa597' // X轴颜色
                }
              },
              axisLabel: {
                formatter: '{value}'
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#fedd8b'
                }
              }
            }
          ],
          series: [
            {
              name: '',
              type: 'bar',
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
                  color: function (params: { name: string }) {
                    const colorList = [
                      '#6bc0fb',
                      '#7fec9d',
                      '#fedd8b',
                      '#ffa597',
                      '#84e4dd',
                      '#749f83',
                      '#ca8622',
                      '#bda29a',
                      '#a8d8ea',
                      '#aa96da',
                      '#fcbad3',
                      '#ffffd2',
                      '#f38181',
                      '#fce38a',
                      '#eaffd0',
                      '#95e1d3',
                      '#e3fdfd',
                      '#749f83',
                      '#ca8622'
                    ]
                    return colorList[keysList[0].indexOf(params.name)]
                  }
                }
              }
            },
            {
              name: '',
              type: 'bar',
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
              barWidth: '50%',
              barGap: '-100%',
              label: {
                normal: {
                  show: true,
                  fontSize: 12,
                  position: 'left',
                  formatter: function (params: { name: string }) {
                    return params.name
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: function (params: { name: string }) {
                    const colorList = [
                      '#6bc0fb',
                      '#7fec9d',
                      '#fedd8b',
                      '#ffa597',
                      '#84e4dd',
                      '#749f83',
                      '#ca8622',
                      '#bda29a',
                      '#a8d8ea',
                      '#aa96da',
                      '#fcbad3',
                      '#ffffd2',
                      '#f38181',
                      '#fce38a',
                      '#eaffd0',
                      '#95e1d3',
                      '#e3fdfd',
                      '#749f83',
                      '#ca8622'
                    ]
                    return colorList[keysList[0].indexOf(params.name)]
                  }
                }
              }
            }
          ],
          animationEasingUpdate: 'quinticInOut',
          animationDurationUpdate: 1500
        },
        options: this.pushOption(years, keysList, dataList)
      },
      true
    )
  }

  private static getYearsList(arr: string[], endTime: string): string[] {
    const yearsList: string[] = []
    const timearr = endTime.split('-')
    const year = parseInt(timearr[0])
    const month = parseInt(timearr[1])
    for (let i = 0; i < 12; i++) {
      if (month - i > 0) {
        yearsList.unshift(`${year}${arr[0]}${(month - i).toString().padStart(2, '0')}${arr[1] ? arr[1] : ''}`)
      } else {
        yearsList.unshift(
          `${year - 1}${arr[0]}${(12 + (month - i)).toString().padStart(2, '0')}${arr[1] ? arr[1] : ''}`
        )
      }
    }
    return yearsList
  }

  private static getKeysList(list: Array<object>): Array<Array<string>> {
    return Array.from({ length: 12 }, () => {
      return list?.map(obj => {
        return Object.keys(obj)[0]
      })
    })
  }

  private static getDataList(years: string[], list: Array<userInfo>): Array<Array<number>> {
    return Array.from({ length: 12 }, (v, k) => {
      return list?.map(obj => {
        return obj[Object.keys(obj)[0]].reduce(
          ({ count: prevcount }: topicRankingData, { time: nexttime, count: nextcount }: topicRankingData) => {
            if (nexttime.indexOf(years[k]) === -1) {
              return { time: years[k], count: Number(prevcount) }
            } else {
              return {
                time: years[k],
                count: Number(prevcount) + Number(nextcount)
              }
            }
          },
          { time: years[k], count: 0 }
        ).count
      })
    })
  }

  private static pushOption(years: Array<string>, keysList: Array<Array<string>>, dataList: Array<Array<number>>) {
    const options = []
    for (let n = 0; n < years?.length; n++) {
      const res = []
      for (let j = 0; j < dataList[n]?.length; j++) {
        res.push({
          name: keysList[n][j],
          value: dataList[n][j]
        })
      }
      res
        .sort(function (a, b) {
          return b.value - a.value
        })
        .slice(0, 6)
      res.sort(function (a, b) {
        return a.value - b.value
      })
      const res1 = []
      const res2 = []
      for (let t = 0; t < res.length; t++) {
        res1[t] = res[t].name
        res2[t] = res[t].value
      }
      options.push({
        title: {
          text: years[n]
        },
        yAxis: {
          data: res1
        },
        series: [
          {
            data: res2
          },
          {
            data: res2
          }
        ]
      })
    }
    return options
  }
}

export default topicRanking
