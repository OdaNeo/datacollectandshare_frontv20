<template>
  <v-row no-gutters id="createTopicDialog">
    <!-- 弹框 展示数据结 -->
    <v-dialog v-model="showConstruction" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2"> 数据发送示例 </v-card-title>
        <v-card-text>
          <p style="padding-top: 20px; white-space: pre-wrap">
            {{ msgSendExample }}
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showConstruction = false"> 关闭 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-col cols="11" class="btn-line">
      <div class="text-label-line">
        <label>数据类型：</label>
      </div>
      <v-btn
        small
        class="mx-2"
        :disabled="formProvide.formObj.canNotEdit && !onlineData"
        :color="onlineData ? 'primary' : ''"
        @click="showonlineData(true)"
        >实时</v-btn
      >
      <v-btn
        small
        class="mx-2"
        :disabled="formProvide.formObj.canNotEdit && onlineData"
        :color="!onlineData ? 'primary' : ''"
        @click="showonlineData(false)"
        >离线</v-btn
      >
    </v-col>
    <v-col cols="11" class="btn-line">
      <div class="text-label-line">
        <label>接口类型：</label>
      </div>
      <v-btn
        v-if="onlineData"
        :disabled="formProvide.formObj.canNotEdit && formProvide.formObj.interfaceType !== 1"
        small
        class="mx-2"
        :color="formProvide.formObj.interfaceType === 1 ? 'primary' : ''"
        @click="formProvide.formObj.interfaceType = 1"
        >通用Rest接口</v-btn
      >
      <v-btn
        v-if="onlineData"
        class="mx-2"
        :disabled="formProvide.formObj.canNotEdit && formProvide.formObj.interfaceType !== 4"
        small
        :color="formProvide.formObj.interfaceType === 4 ? 'primary' : ''"
        @click="formProvide.formObj.interfaceType = 4"
        >多级嵌套免校验</v-btn
      >
      <v-btn
        v-if="onlineData"
        class="mx-2"
        :disabled="formProvide.formObj.canNotEdit && formProvide.formObj.interfaceType !== 6"
        small
        :color="formProvide.formObj.interfaceType === 6 ? 'primary' : ''"
        @click="formProvide.formObj.interfaceType = 6"
        >protobuf</v-btn
      >
      <v-btn
        v-if="!onlineData"
        class="mx-2"
        :disabled="formProvide.formObj.canNotEdit && formProvide.formObj.interfaceType !== 2"
        small
        :color="formProvide.formObj.interfaceType === 2 ? 'primary' : ''"
        @click="formProvide.formObj.interfaceType = 2"
        >数据库采集</v-btn
      >
      <v-btn
        v-if="!onlineData"
        class="mx-2"
        :disabled="formProvide.formObj.canNotEdit && formProvide.formObj.interfaceType !== 3"
        small
        :color="formProvide.formObj.interfaceType === 3 ? 'primary' : ''"
        @click="formProvide.formObj.interfaceType = 3"
        >服务主动拉取</v-btn
      >
      <v-btn
        v-if="!onlineData"
        class="mx-2"
        :disabled="formProvide.formObj.canNotEdit && formProvide.formObj.interfaceType !== 5"
        small
        :color="formProvide.formObj.interfaceType === 5 ? 'primary' : ''"
        @click="formProvide.formObj.interfaceType = 5"
        >拉取FTP</v-btn
      >
    </v-col>
    <v-col cols="11">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        :disabled="formProvide.formObj.canNotEdit"
        class="dialogInput"
        v-model="formProvide.formObj.topicName"
        :rules="[...h_validator.topicNameVilidata(), ...topicRepeat]"
        @input="inputEvent(formProvide.formObj.topicName)"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>主题名称：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="11" v-if="onlineData && formProvide.formObj.interfaceType === 6">
      <v-file-input
        class="pt-0 mt-0"
        accept=".proto"
        :rules="h_validator.fileInputVilidata()"
        @change="readFile"
        label="File input"
      >
        <template v-slot:prepend-inner>
          <span class="require-span">*</span>
        </template>
      </v-file-input>
    </v-col>
    <v-col cols="11" v-if="formProvide.formObj.interfaceType === 5">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput"
        v-model="formProvide.formObj.baseUrl"
        :rules="h_validator.baseUrlVilidata()"
        required
        :disabled="formProvide.formObj.canNotEdit"
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>baseUrl：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-row v-if="formProvide.formObj.interfaceType === 5" no-gutters>
      <v-col cols="6">
        <v-text-field
          single-line
          outlined
          clearable
          dense
          solo
          :disabled="formProvide.formObj.canNotEdit"
          :rules="h_validator.hostVilidata()"
          label="host"
          class="dialogInput"
          v-model="formProvide.formObj.host"
        >
          <template v-slot:prepend>
            <div class="text-label">
              <label><span class="require-span">*</span>FTP地址：</label>
            </div>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="1" />
      <v-col cols="4">
        <v-text-field
          single-line
          outlined
          :disabled="formProvide.formObj.canNotEdit"
          clearable
          dense
          solo
          label="port"
          class="dialogInput"
          :rules="h_validator.portVilidata()"
          v-model="formProvide.formObj.port"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-col cols="11" v-if="formProvide.formObj.interfaceType === 5">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput"
        v-model="formProvide.formObj.userName"
        :rules="h_validator.ftpNameVilidata()"
        required
        :disabled="formProvide.formObj.canNotEdit"
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>FTP账号：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="11" v-if="formProvide.formObj.interfaceType === 5">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput"
        v-model="formProvide.formObj.password"
        :rules="h_validator.ftpPasswordVilidata()"
        required
        :disabled="formProvide.formObj.canNotEdit"
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>FTP密码：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="11" v-if="formProvide.formObj.interfaceType === 2">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        class="dialogInput"
        v-model="formProvide.formObj.dataBaseIp"
        :rules="h_validator.dataBaseUrlVilidata()"
        required
        :disabled="formProvide.formObj.canNotEdit"
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>数据库地址：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="11" v-if="formProvide.formObj.interfaceType === 2">
      <v-autocomplete
        v-model="formProvide.formObj.databaseType"
        :disabled="formProvide.formObj.canNotEdit"
        :items="items2"
        dense
        solo
        :rules="h_validator.dataBaseTypeVilidata()"
        required
        single-line
        outlined
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>数据库类型：</label>
          </div>
        </template>
      </v-autocomplete>
    </v-col>
    <v-row v-if="formProvide.formObj.interfaceType === 3" no-gutters>
      <v-col cols="6">
        <v-text-field
          single-line
          outlined
          clearable
          solo
          dense
          :disabled="formProvide.formObj.canNotEdit"
          label="用户名"
          class="dialogInput"
          v-model="formProvide.formObj.AuthorizationObj.key"
        >
          <template v-slot:prepend>
            <div class="text-label">
              <label>Authorization：</label>
            </div>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="1" />
      <v-col cols="4">
        <v-text-field
          single-line
          outlined
          :disabled="formProvide.formObj.canNotEdit"
          clearable
          solo
          dense
          label="密码"
          class="dialogInput"
          v-model="formProvide.formObj.AuthorizationObj.value"
        >
        </v-text-field>
      </v-col>
      <v-col cols="1" class="mt-n1">
        <span style="font-size: 12px">填写后不可修改</span>
      </v-col>
    </v-row>
    <v-col cols="11" v-if="formProvide.formObj.interfaceType === 3">
      <v-text-field
        single-line
        outlined
        clearable
        dense
        solo
        :disabled="formProvide.formObj.canNotEdit"
        class="dialogInput"
        v-model="formProvide.formObj.url"
        :rules="h_validator.urlVilidata()"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>url：</label>
          </div>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="11" v-if="formProvide.formObj.interfaceType === 3">
      <v-autocomplete
        v-model="formProvide.formObj.type"
        :disabled="formProvide.formObj.canNotEdit"
        :items="items3"
        dense
        solo
        :rules="h_validator.typeVilidata()"
        required
        single-line
        outlined
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>请求类型：</label>
          </div>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col cols="11" v-if="formProvide.formObj.interfaceType === 3 && formProvide.formObj.type === 'post'">
      <v-textarea
        outlined
        v-model="formProvide.formObj.body"
        :disabled="formProvide.formObj.canNotEdit"
        :rules="h_validator.bodyVilidata()"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>body：</label>
          </div>
        </template>
      </v-textarea>
    </v-col>
    <div class="col-over-flow" v-if="formProvide.formObj.interfaceType === 3">
      <v-row v-for="(item, index) in formProvide.formObj.header" :key="index" no-gutters>
        <v-col cols="6">
          <v-text-field
            single-line
            outlined
            clearable
            dense
            solo
            label="键"
            :disabled="formProvide.formObj.canNotEdit"
            class="dialogInput"
            v-model="item.key"
            required
            v-if="item.key !== 'Authorization'"
          >
            <template v-slot:prepend>
              <div v-if="index === 0" class="text-label">
                <label v-if="item.key !== 'Authorization'">头信息：</label>
              </div>
              <div v-else class="text-label"></div>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="1" />
        <v-col cols="4">
          <v-text-field
            single-line
            outlined
            clearable
            dense
            label="值"
            :disabled="formProvide.formObj.canNotEdit"
            solo
            class="dialogInput"
            v-model="item.value"
            required
            v-if="item.key !== 'Authorization'"
          >
          </v-text-field>
        </v-col>
        <v-col cols="1" v-if="!formProvide.formObj.canNotEdit">
          <v-btn
            fab
            dark
            small
            color="indigo"
            class="add-btn"
            v-if="formProvide.formObj.header.length === index + 1"
            @click="add2()"
          >
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            small
            color="error"
            class="add-btn"
            v-if="(formProvide.formObj.header.length !== index + 1 || index !== 0) && item.key !== 'Authorization'"
            @click="minus2(index)"
          >
            <v-icon dark>mdi-minus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <v-col cols="11" v-if="formProvide.formObj.interfaceType === 1 || formProvide.formObj.interfaceType === 4">
      <v-radio-group
        v-model="formProvide.formObj.messageType"
        dense
        class="dialogInput"
        :disabled="formProvide.formObj.canNotEdit"
        row
        :rules="h_validator.messageTypeVilidata()"
        required
      >
        <template v-slot:prepend>
          <div class="text-label mt-1">
            <label><span class="require-span">*</span>消息类型：</label>
          </div>
        </template>
        <v-radio
          :disabled="formProvide.formObj.canNotEdit"
          v-for="n in types"
          :key="n.value"
          :label="`${n.text}`"
          :value="n.value"
        ></v-radio>
      </v-radio-group>
    </v-col>
    <v-col cols="11" v-if="formProvide.formObj.interfaceType === 1 || formProvide.formObj.interfaceType === 4">
      <v-radio-group
        v-model="formProvide.formObj.writeElasticsearch"
        dense
        class="dialogInput"
        :disabled="formProvide.formObj.canNotEdit"
        row
        required
      >
        <template v-slot:prepend>
          <div class="text-label mt-1">
            <label><span class="require-span">*</span>是否写入ES：</label>
          </div>
        </template>
        <v-radio
          :disabled="formProvide.formObj.canNotEdit"
          v-for="n in esList"
          :key="n.value"
          :label="`${n.text}`"
          :value="n.value"
        ></v-radio>
      </v-radio-group>
    </v-col>
    <v-col cols="11" v-if="onlineData">
      <v-slider
        v-model="formProvide.formObj.redisTimer"
        class="align-center"
        max="30"
        min="5"
        :disabled="formProvide.formObj.canNotEdit"
        hide-details
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label>内存过期时间：</label>
          </div>
        </template>
        <template v-slot:append>
          <v-text-field
            v-model="formProvide.formObj.redisTimer"
            class="mt-0 pt-0"
            disabled
            hide-details
            single-line
            style="width: 30px"
          ></v-text-field>
        </template>
      </v-slider>
    </v-col>
    <v-col cols="11" v-if="formProvide.formObj.interfaceType === 4">
      <v-textarea
        outlined
        v-model="formProvide.formObj.dataStructSchema"
        :rules="h_validator.dataStructVilidata()"
        required
      >
        <template v-slot:prepend>
          <div class="text-label">
            <label><span class="require-span">*</span>数据结构：</label>
          </div>
        </template>
      </v-textarea>
    </v-col>
    <div
      class="col-over-flow"
      v-if="
        formProvide.formObj.interfaceType === 1 ||
        formProvide.formObj.interfaceType === 2 ||
        formProvide.formObj.interfaceType === 3
      "
    >
      <v-row v-for="(item, index) in formProvide.formObj.topicList" :key="index" no-gutters>
        <v-col cols="5">
          <v-text-field
            single-line
            :disabled="item.disabled"
            outlined
            dense
            solo
            label="字段名"
            class="dialogInput"
            v-model.trim="item.key"
            :rules="[...h_validator.fieldKeyVilidata(formProvide.formObj.topicList)]"
            :error-messages="keyErrorMessages[index]"
            required
          >
            <template v-slot:prepend>
              <div class="text-label" v-if="index === 0">
                <label><span class="require-span">*</span>数据结构：</label>
              </div>
              <div class="text-label" v-else>
                <p></p>
                <label></label>
              </div>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            single-line
            outlined
            :disabled="item.disabled"
            dense
            solo
            class="dialogInput"
            label="描述"
            v-model="item.description"
            :rules="h_validator.fieldDescriptionValidator()"
            required
          >
          </v-text-field>
        </v-col>
        <v-col cols="3">
          <v-autocomplete
            v-model="item.type"
            :items="items"
            dense
            :disabled="item.disabled"
            :rules="h_validator.fieldTypeValidator()"
            required
            solo
            single-line
            outlined
            label="字段类型"
          ></v-autocomplete>
        </v-col>
        <v-col cols="1">
          <v-btn
            fab
            dark
            small
            color="error"
            class="add-btn"
            v-if="(formProvide.formObj.topicList.length !== index + 1 || index !== 0) && !item.disabled"
            @click="minus(index)"
          >
            <v-icon dark>mdi-minus</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            small
            color="indigo"
            class="add-btn"
            v-if="formProvide.formObj.topicList.length === index + 1"
            @click="add()"
          >
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <v-col cols="11" v-if="onlineData && formProvide.formObj.interfaceType === 4">
      <v-radio-group row>
        <template v-slot:prepend>
          <div class="text-label">
            <label>数据发送示例：</label>
          </div>
        </template>
        <v-btn solo @click.native="showConstruction = true">查看</v-btn>
      </v-radio-group>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue, Watch } from 'vue-property-decorator'
import http from '../../../../decorator/httpDecorator'
import validator from '../../../../decorator/validatorDecorator'
import { H_Vue } from '../../../../declaration/vue-prototype'

@Component
@http
@validator([
  'fieldKeyVilidata',
  'fieldDescriptionValidator',
  'fieldTypeValidator',
  'fieldNumVilidata',
  'topicNameVilidata',
  'dataBaseUrlVilidata',
  'dataBaseTypeVilidata',
  'urlVilidata',
  'headerKeyVilidata',
  'headerValueVilidata',
  'messageTypeVilidata',
  'writeEsVilidata',
  'dataStructVilidata',
  'typeVilidata',
  'bodyVilidata',
  'baseUrlVilidata',
  'hostVilidata',
  'portVilidata',
  'ftpNameVilidata',
  'ftpPasswordVilidata',
  'fileInputVilidata'
])
export default class CreateTopicDialog extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private topicName = ''
  //   拉取ftp 新增字段
  private port = ''
  private host = ''
  private baseUrl = ''
  private userName = ''
  private password = ''

  private messageType = 0
  private bool = false
  private showConstruction = false
  private topicBool = false
  private onlineData = !(
    this.formProvide.formObj.interfaceType === 2 ||
    this.formProvide.formObj.interfaceType === 3 ||
    this.formProvide.formObj.interfaceType === 5
  )
  private items: Array<any> = [
    { text: 'Int', value: 1 },
    { text: 'String', value: 'str' },
    { text: 'Date', value: 'Date' },
    { text: 'TimeStamp', value: 'TimeStamp' }
  ]
  private items2: Array<any> = ['Mysql', 'Oracle', 'Sql Server']
  private items3: Array<any> = ['get', 'post']
  private types: Array<any> = [
    { text: '数据量优先', value: 1 },
    { text: '顺序优先', value: 2 }
  ]
  private esList: Array<any> = [
    { text: '是', value: 1 },
    { text: '否', value: 0 }
  ]
  private arr: Array<any> = ['', '']
  private topicRepeat: Function[] = []
  private keyErrorMessages: Array<string> = []
  private keyRepeat: Array<any> = []

  private showonlineData(dataType: boolean) {
    if (dataType) {
      this.formProvide.formObj.interfaceType = 1
    } else {
      if (this.formProvide.formObj.interfaceType === 3) {
        this.formProvide.formObj.interfaceType = 3
      } else {
        this.formProvide.formObj.interfaceType = 2
      }
    }
    this.onlineData = dataType
  }
  private add() {
    // 增加数据结构
    ;(this.formProvide.formObj.topicList as Array<any>).push({
      key: undefined,
      type: '',
      description: '', // 描述
      disabled: false
    })
  }
  private minus(num: number) {
    // 删减数据结构
    ;(this.formProvide.formObj.topicList as Array<any>).splice(num, 1)
  }
  private add2() {
    // 增加数据结构
    ;(this.formProvide.formObj.header as Array<any>).push({
      key: '',
      value: ''
    })
  }
  private minus2(num: number) {
    // 删减数据结构
    ;(this.formProvide.formObj.header as Array<any>).splice(num, 1)
  }
  private clearMethod() {
    this.formProvide.formObj = {
      id: '', // 主题ID
      canNotEdit: false, // 添加数据
      interfaceType: 1,
      topicName: '', // 主题名称
      messageType: 0, // 消息类型
      dataBaseIp: '', // 数据库地址
      databaseType: '', // 数据库类型
      header: [{ key: '', value: '' }],
      redisTimer: '',
      dataStructSchema: '', //
      writeElasticsearch: 1, // 是否展示
      url: '',
      port: '', // ?拉取ftp 端口号
      host: '', // ?拉取ftp
      baseUrl: '', // ?拉取ftp 地址
      userName: '', // ?拉取ftp 用户名
      password: '', // ?拉取ftp 密码
      topicList: [
        {
          key: undefined,
          type: '',
          description: '', // 描述
          disabled: false
        }
      ],
      // AuthorizationObj: {
      //   key: '',
      //   value: ''
      // },
      type: '',
      body: ''
    }
  }

  private get msgSendExample() {
    const topicList = this.formProvide.formObj.topicList as any[]
    let msg: any = {}
    if (this.formProvide.formObj.interfaceType === 1) {
      // 通用rest接口
      topicList.forEach((element: any) => {
        msg[element.number] = element.key
      })
    } else if (this.formProvide.formObj.interfaceType === 4) {
      // 多级嵌套免校验
      msg = this.formProvide.formObj.dataStructSchema
    }
    return JSON.stringify(
      {
        requestid: new Date().getTime(),
        data: [msg]
      },
      null,
      '\t'
    )
  }

  public async inputEvent(v: string): Promise<void> {
    if (v) {
      const { success } = await this.h_request['httpGET']('GET_TOPICS_CHECKED', {
        topicName: v
      })
      if (success) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.topicRepeat = [(v: string) => '主题名称已被注册']
      } else {
        this.topicRepeat = []
      }
    } else {
      this.topicRepeat = []
    }
  }

  // 读取文件
  private readFile(e: File) {
    if (!e) {
      return
    }
    this.$emit('create-protobuf-file', e)
  }

  // "字段名" 用js修改v-model不会触发rules校验，如果手动emit触发input事件，会导致v-model归空，原因未知。所以这里改成了watch方法
  @Watch('formProvide.formObj.topicList', { deep: true })
  keyInputEvent(newVal: Array<any>): void {
    this.keyErrorMessages.length = newVal.length
    this.keyRepeat.length = 0
    newVal.forEach((item, index: number) => {
      if (item.key === '') {
        this.keyErrorMessages[index] = '字段名不能为空'
      } else if (item.key && this.keyRepeat.includes(item.key)) {
        this.keyErrorMessages[index] = '数据结构不能有重复的字段名'
      } else {
        this.keyErrorMessages[index] = ''
      }
      this.keyRepeat.push(item.key)
    })
  }
}
</script>

<style scoped>
.btn-line {
  padding-bottom: 20px;
}
/* .input-item {
  margin-right: 6px;
} */
.add-btn {
  width: 25px;
  height: 25px;
  margin-right: 2px;
  margin-top: 4px;
}
.col-over-flow {
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
}
.text-label-line {
  width: 130px;
  display: inline-block;
  box-sizing: border-box;
  font-size: 16px;
  text-align: right;
  color: #000;
}
.text-label-line label {
  font-size: 16px;
}
.dialogInput .v-input__slot {
  box-shadow: 2px 2px 10px #dddddd !important;
}
</style>
