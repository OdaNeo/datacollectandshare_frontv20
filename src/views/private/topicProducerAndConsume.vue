<template>
  <div id="topicProducerAndConsume">
    <div id="topicProducer">
      <h3>主题生产数据</h3>
      <v-form ref="producerForm" style="margin-top: 15px">
        <v-row>
          <v-col cols="10" offset="1" style="padding: 0">
            <v-text-field v-model="topicId" solo dense placeholder="请输入生产的主题ID" clearable></v-text-field>
          </v-col>
          <v-col cols="10" offset="1" style="padding: 0">
            <v-text-field v-model="userToken" solo dense placeholder="请输入生产的用户token" clearable></v-text-field>
          </v-col>
          <v-col cols="10" offset="1" style="padding: 0">
            <v-radio-group v-model="producerMsgState" single-line outlined dense solo row>
              <v-radio v-for="n in msgStates" :key="n.value" :label="`${n.text}`" :value="n.value"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="10" offset="1" v-if="producerMsgState == '2'" style="padding: 0">
            <v-textarea solo name="input-7-4" label="主题生产数据"></v-textarea>
          </v-col>
          <v-col cols="10" offset="1" v-if="producerMsgState == '1'" style="padding: 0">
            <v-text-field v-model="createMsgNum" solo dense placeholder="随机生成数据数量" clearable>
              <template v-slot:append-outer>
                <v-btn color="primary" class="mr-4" solo @click="createMsg" style="margin-top: -4px"> 生成数据 </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col
            cols="10"
            offset="1"
            v-if="producerMsgState == '1'"
            style="padding: 0; margin-top: 0"
            class="expansion"
          >
            <v-expansion-panels>
              <v-expansion-panel v-for="(item, i) in createMsgArray" :key="i">
                <v-expansion-panel-header color="green">随机生成数据{{ i + 1 }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  {{ item }}
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-col cols="10" offset="1" v-if="producerMsgState == '1'" style="padding: 0; margin-top: 10px">
            <v-radio-group v-model="collectiveState" single-line outlined dense solo row>
              <v-radio v-for="n in collective" :key="n.value" :label="`${n.text}`" :value="n.value"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="10" offset="1" v-if="producerMsgState == '1' && collectiveState == '2'" style="padding: 0">
            <v-text-field
              v-model="sendMsgRate"
              solo
              dense
              placeholder="数据发送频率（毫秒值）"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="10" offset="1" v-if="producerMsgState == '1'" style="padding: 0">
            <v-text-field v-model="delayConsume" solo dense placeholder="延迟消费（毫秒值）" clearable></v-text-field>
          </v-col>
          <v-col cols="10" offset="1" style="padding: 0">
            <v-btn color="primary" class="mr-4" solo @click="sendMsg"> 单独发送数据 </v-btn>
            <v-btn color="primary" class="mr-4" solo @click="sendMsgAndConsumeRealtime"> 发送数据并消费实时数据 </v-btn>
            <v-btn color="primary" class="mr-4" solo @click="sendMsgAndConsumeHistorytime">
              发送数据并消费历史数据
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
    <div id="topicConsume">
      <h3>主题消费数据</h3>
      <v-form ref="consumeForm" style="margin-top: 15px">
        <v-row>
          <v-col cols="10" offset="1" style="padding: 0">
            <v-text-field v-model="consumeTopicId" solo dense placeholder="请输入消费的主题ID" clearable></v-text-field>
          </v-col>
          <v-col cols="10" offset="1" style="padding: 0">
            <v-text-field
              v-model="consumeUserToken"
              solo
              dense
              placeholder="请输入消费的用户token"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="10" offset="1" style="padding: 0; margin-bottom: 20px">
            <v-btn color="primary" class="mr-4" solo @click="consumeRealtimeMethod(consumeTopicId, consumeUserToken)">
              消费实时数据
            </v-btn>
            <v-btn color="primary" class="mr-4" solo @click="consumeHistoryMethod(consumeTopicId, consumeUserToken)">
              消费离线数据
            </v-btn>
          </v-col>
          <v-col cols="10" offset="1" style="padding: 0">
            <p class="consumeBox" style="white-space: pre-wrap; padding-top: 10px; padding-left: 10px">
              {{ consumeBox }}
            </p>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </div>
</template>
<script lang="ts">
import http from '@/decorator/httpDecorator'
import http2 from '@/decorator/httpDecorator2'
import util from '@/decorator/utilsDecorator'
import { Component, Vue } from 'vue-property-decorator'
import RequestData from '@/api'

@Component
@http
@http2({
  methodName: 'h_request2',
  header: [
    {
      headerKey: 'x-auth-token',
      headerVal: 1234
    }
  ]
})
@util
export default class TopicProducerAndConsume extends Vue {
  private producerForm = true
  private consumeForm = true
  private topicId = ''
  private consumeTopicId = ''
  private createMsgNum = ''
  private producerMsgState = ''
  private collectiveState = '1'
  private createMsgArray: any[] = []
  private sendMsgRate = ''
  private delayConsume = ''
  private userToken = ''
  private consumeUserToken = ''
  private consumeBox = ''

  private msgStates: Array<{ text: string; value: string }> = [
    { text: '随机生成数据', value: '1' },
    { text: '指定数据', value: '2' }
  ]

  private collective: Array<{ text: string; value: string }> = [
    { text: '打包发送', value: '1' },
    { text: '单条发送', value: '2' }
  ]

  private async createMsg() {
    const result = await this.h_request.httpGET('GET_TOPICS_SELECTTOPIC', {
      topicID: this.topicId,
      pageNum: 1,
      pageSize: 10
    })
    const dataStruct = JSON.parse(result.data.list[0].dataStruct)[0]
    this.createMsgArray = this.createRandom(dataStruct)
  }

  private createRandom(dataStruct: any) {
    const num: number = this.createMsgNum === '' ? 10 : Number(this.createMsgNum)
    const createRandomArray = []
    for (let i = 0; i < num; i++) {
      const createRandom: any = {}
      for (const key in dataStruct) {
        let val: any
        switch (dataStruct[key]) {
          case 1:
            val = i + 1
            break
          case 'str':
            val = key + '_' + i
            break
          default:
            break
        }
        createRandom[key] = val
      }
      createRandomArray.push(createRandom)
    }
    return createRandomArray
  }

  private async sendMsg(callback?: Function) {
    if (this.userToken) {
      const h_request3 = new RequestData([
        {
          headerKey: 'x-auth-token',
          headerVal: this.userToken
        }
      ])
      if (this.collectiveState === '1') {
        const { success } = await h_request3.httpPOST(
          'POST_TRANSMISSION_ATS',
          {
            requestId: new Date().getTime(),
            data: this.createMsgArray
          },
          this.topicId
        )
        if (success) {
          this.h_utils.alertUtil.open(this.topicId + '主题生产成功，可以进行消费了！', true, 'success')
          callback && callback()
        }
      } else {
        this.createMsgArray.forEach((element, i: number) => {
          setTimeout(async () => {
            const { success } = await h_request3.httpPOST(
              'POST_TRANSMISSION_ATS',
              {
                requestId: new Date().getTime(),
                data: [element]
              },
              this.topicId
            )
            if (success) {
              this.h_utils.alertUtil.open(this.topicId + '主题生产成功，可以进行消费了！', true, 'success')
              callback && callback()
            }
          }, Number(this.sendMsgRate) * i)
        })
      }
    } else {
      this.h_utils.alertUtil.open('请设置主题生产的用户的token', true, 'error')
    }
  }

  private async consumeRealtimeMethod(id: string, token: string) {
    if (id && token) {
      const h_request3 = new RequestData([
        {
          headerKey: 'x-auth-token',
          headerVal: token
        }
      ])
      const response = await h_request3.httpGET('GET_TRANSMISSION_REALTIME', {}, id)
      this.consumeBox = JSON.stringify(response, null, '\t')
    } else {
      this.h_utils.alertUtil.open('请设置主题消费的用户的token', true, 'error')
    }
  }

  private async consumeHistoryMethod(id: string, token: string) {
    if (id && token) {
      const h_request3 = new RequestData([
        {
          headerKey: 'x-auth-token',
          headerVal: token
        }
      ])
      const response = await h_request3.httpPOST(
        'GET_TRANSMISSION_HISTORY',
        {
          query_sql: 'select * from ' + id
        },
        id
      )
      this.consumeBox = JSON.stringify(response, null, '\t')
    } else {
      this.h_utils.alertUtil.open('请设置主题消费的用户的token', true, 'error')
    }
  }

  private sendMsgAndConsumeRealtime() {
    let time = 200
    if (this.delayConsume) {
      time = Number(this.delayConsume)
    }
    this.sendMsg(() => {
      setTimeout(() => {
        this.consumeRealtimeMethod(this.topicId, this.userToken)
      }, time)
    })
  }

  private sendMsgAndConsumeHistorytime() {
    let time = 200
    if (this.delayConsume) {
      time = Number(this.delayConsume)
    }
    this.sendMsg(() => {
      setTimeout(() => {
        this.consumeHistoryMethod(this.topicId, this.userToken)
      }, time)
    })
  }
}
</script>
<style scoped>
#topicProducerAndConsume {
  height: 100%;
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.87);
}
#topicProducerAndConsume h3 {
  text-align: center;
}
#topicProducer {
  width: 50%;
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.87);
}
#topicConsume {
  height: 100%;
  width: 50%;
}
.expansion {
  margin-top: 20px;
  max-height: 150px;
  overflow-x: hidden;
  overflow-y: auto;
}
.consumeBox {
  width: 100%;
  height: 400px;
  overflow: auto;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
</style>
