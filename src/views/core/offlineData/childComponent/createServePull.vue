<template>
  <v-row no-gutters>
    <!-- 主题 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>主题名称</label>
      <v-text-field
        v-model="formProvide.formObj['topicName']"
        :disabled="formProvide.formObj.canNotEdit"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter(), ...noRepeat]"
        v-topicNameNoRepeat="{
          set: n => {
            noRepeat = [...n]
          }
        }"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>
    <!--AuthorizationObj  -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2">Authorization</label>
      <div class="ml-4 flex-grow-1">
        <v-row
          v-for="item in formProvide.formObj.AuthorizationObj"
          :key="item.id"
          class="d-flex justify-space-between mr-15"
          no-gutters
        >
          <v-col class="mr-2">
            <v-text-field
              v-model="item[AuthorizationObj[0].value]"
              dense
              outlined
              :disabled="formProvide.formObj.canNotEdit"
              :label="AuthorizationObj[0].text"
              height="34"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="item[AuthorizationObj[1].value]"
              dense
              :disabled="formProvide.formObj.canNotEdit"
              outlined
              :label="AuthorizationObj[1].text"
              height="34"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <!-- url -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>URL</label>
      <v-text-field
        v-model="formProvide.formObj['url']"
        :disabled="formProvide.formObj.canNotEdit"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('URL')]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>
    <!--请求类型-->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>请求类型</label>
      <v-select
        v-model="formProvide.formObj['type']"
        outlined
        dense
        clearable
        :disabled="formProvide.formObj.canNotEdit"
        height="34"
        label="请选择请求类型"
        :rules="[...h_validator.noEmpty('请求类型')]"
        :items="typeItem"
        class="ml-4 my-0 mr-15"
      ></v-select>
    </v-col>
    <!-- body  -->
    <v-col v-if="formProvide.formObj['type'] === 'post'" cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>body</label>
      <v-textarea
        v-model="formProvide.formObj['body']"
        outlined
        auto-grow
        rows="3"
        :disabled="formProvide.formObj.canNotEdit"
        :rules="[...h_validator.noEmpty('body'), ...h_validator.isJSON()]"
        class="ml-4 mr-15"
      ></v-textarea>
    </v-col>
    <!-- 头信息 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2">头信息</label>
      <div class="ml-4 flex-grow-1">
        <v-row
          v-for="(item, index) in formProvide.formObj.header"
          :key="item.id"
          class="d-flex justify-space-between"
          no-gutters
        >
          <v-col class="mr-2">
            <v-text-field
              v-model="item[header[0].value]"
              dense
              outlined
              :disabled="formProvide.formObj.canNotEdit"
              :label="header[0].text"
              height="34"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="item[header[1].value]"
              dense
              :disabled="formProvide.formObj.canNotEdit"
              outlined
              :label="header[1].text"
              height="34"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex justify-space-around flex-grow-0" style="min-width: 60px">
            <v-btn
              v-if="formProvide.formObj.header.length === index + 1"
              :disabled="formProvide.formObj.canNotEdit"
              fab
              dark
              depressed
              max-width="24"
              max-height="24"
              color="primary"
              style="margin-top: 5px"
              @click.stop="add2"
            >
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              v-if="formProvide.formObj.header.length > 1"
              :disabled="formProvide.formObj.canNotEdit"
              fab
              dark
              depressed
              max-width="24"
              max-height="24"
              color="primary"
              style="margin-top: 5px"
              @click.stop="minus2(index)"
            >
              <v-icon dark>mdi-minus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-col>

    <!-- 数据结构 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>数据结构</label>
      <div class="ml-4">
        <v-row
          class="d-flex justify-space-between"
          no-gutters
          v-for="(item, index) in formProvide.formObj['topicList']"
          :key="item.id"
        >
          <v-col class="mr-2">
            <v-text-field
              v-model="item.key"
              dense
              outlined
              :disabled="item.disabled"
              label="字段名"
              :rules="[...h_validator.noEmpty('字段名'), ...noRepeatKey]"
              height="34"
            ></v-text-field>
          </v-col>
          <v-col class="mr-2">
            <v-text-field
              v-model="item.description"
              dense
              :disabled="item.disabled"
              outlined
              label="描述"
              :rules="[...h_validator.noEmpty('描述')]"
              height="34"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-model="item.type"
              dense
              outlined
              :disabled="item.disabled"
              label="字段类型"
              :rules="[...h_validator.noEmpty('字段类型')]"
              height="34"
              :items="items2"
            ></v-select>
          </v-col>
          <!-- 按钮 -->
          <v-col class="d-flex justify-space-around flex-grow-0" style="min-width: 60px">
            <v-btn
              v-if="formProvide.formObj['topicList'].length === index + 1"
              fab
              dark
              depressed
              max-width="24"
              max-height="24"
              color="primary"
              style="margin-top: 5px"
              @click.stop="add"
            >
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              v-if="!item.disabled && formProvide.formObj['topicList'].length > 1"
              fab
              dark
              depressed
              max-width="24"
              max-height="24"
              color="primary"
              style="margin-top: 5px"
              @click.stop="minus(index, item.disabled)"
            >
              <v-icon dark>mdi-minus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue, Watch } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'

@Component
@Validator(['noEmpty', 'isJSON', 'topicNameFormatter'])
export default class CreateServePull extends Vue {
  @Inject() private readonly formProvide!: H_Vue

  private noRepeat: string[] = []
  private noRepeatKey: string[] = []
  private items2 = [
    { text: 'Int', value: 1 },
    { text: 'String', value: 'str' },
    { text: 'Date', value: 'Date' },
    { text: 'TimeStamp', value: 'TimeStamp' }
  ]

  private typeItem = ['get', 'post']

  private AuthorizationObj = [
    { text: '用户名', value: 'key' },
    { text: '密码', value: 'value' }
  ]

  private header = [
    { text: '键', value: 'key' },
    { text: '值', value: 'value' }
  ]

  // add
  private add() {
    this.formProvide.formObj['topicList'].push({
      ['key']: '',
      ['description']: '',
      ['type']: '',
      disabled: false
    })
  }
  // minus
  private minus(index: number, bo: boolean) {
    if (bo) {
      // disable 不能修改
      return
    } else {
      this.formProvide.formObj['topicList'].splice(index, 1)
    }
  }

  // 头信息
  private add2() {
    this.formProvide.formObj['header'].push({
      key: '',
      value: ''
    })
  }

  // 头信息
  private minus2(index: number) {
    this.formProvide.formObj['header'].splice(index, 1)
  }

  // validation topicList no-repeat-key
  @Watch('formProvide.formObj.topicList', { deep: true })
  private handleKeyNoRepeat(val: Array<any>) {
    let _L: Array<string> = []
    let _l: Array<string> = []
    val.forEach(item => {
      if (item.key && !_l.includes(item.key)) {
        _l.push(item.key)
      }
      if (item.key) {
        _L.push(item.key)
      }
    })
    if (_L.length > _l.length) {
      this.noRepeatKey = ['字段名不能重复']
    } else {
      this.noRepeatKey = []
    }
  }
}
</script>
