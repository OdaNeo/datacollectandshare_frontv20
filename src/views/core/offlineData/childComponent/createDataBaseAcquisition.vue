<template>
  <v-row no-gutters>
    <!-- <h-input v-for="item in formTypeObj" :key="item.id" :formTypeItem="item" /> -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>主题名称</label>
      <v-text-field
        v-model="formProvide.formObj['topicName']"
        :disabled="formProvide.formObj.canNotEdit"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('主题名称'), ...noRepeat]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>数据库地址</label>
      <v-text-field
        v-model="formProvide.formObj['dataBaseIp']"
        :disabled="formProvide.formObj.canNotEdit"
        outlined
        dense
        clearable
        height="34"
        :rules="[...h_validator.noEmpty('数据库地址')]"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col>
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>数据库类型</label>
      <v-select
        v-model="formProvide.formObj['dataBaseType']"
        outlined
        dense
        clearable
        :disabled="formProvide.formObj.canNotEdit"
        height="34"
        label="请选择数据库类型"
        :rules="[...h_validator.noEmpty('数据库类型')]"
        :items="items"
        class="ml-4 my-0 mr-15"
      ></v-select>
    </v-col>
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
          <v-col class="d-flex justify-space-around label-end-polyfill flex-grow-0">
            <v-btn
              v-if="formProvide.formObj['topicList'].length === index + 1"
              fab
              dark
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
import http from '@/decorator/httpDecorator'
import { H_Vue } from '@/declaration/vue-prototype'
// import { InputType } from '@/type/dialog-form.type'
import HInput from '@/components/h-input.vue'
import Validator from '@/decorator/validatorDecorator'

@Component({
  components: {
    HInput
  }
})
@http
@Validator(['topicNameFormatter', 'noEmpty'])
export default class CreateDataBaseAcquisition extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private noRepeat: string[] = []
  private noRepeatKey: string[] = []
  private items = ['Mysql', 'Oracle', 'Sql Server']
  private items2 = [
    { text: 'Int', value: 1 },
    { text: 'String', value: 'str' },
    { text: 'Date', value: 'Date' },
    { text: 'TimeStamp', value: 'TimeStamp' }
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

  // private formTypeObj: Array<InputType> = [
  //   {
  //     label: '主题名称',
  //     valueName: 'topicName',
  //     type: 'input',
  //     require: true,
  //     disabled: !!this.formProvide.formObj.topicName,
  //     otherRules: []
  //   },
  //   {
  //     label: '数据库地址',
  //     valueName: 'dataBaseIp',
  //     type: 'input',
  //     disabled: !!this.formProvide.formObj.topicName,
  //     require: true
  //   },
  //   {
  //     label: '数据库类型',
  //     valueName: 'dataBaseType',
  //     type: 'select',
  //     multiple: false,
  //     items: ['Mysql', 'Oracle', 'Sql Server'],
  //     disabled: !!this.formProvide.formObj.topicName,
  //     require: true
  //   },
  //   {
  //     label: '数据结构',
  //     valueName: 'topicList',
  //     type: 'tripleInput',
  //     items: [
  //       { text: 'Int', value: 1 },
  //       { text: 'String', value: 'str' },
  //       { text: 'Date', value: 'Date' },
  //       { text: 'TimeStamp', value: 'TimeStamp' }
  //     ],
  //     itemLabels: [
  //       { text: '字段名', value: 'key' },
  //       { text: '描述', value: 'description' },
  //       { text: '字段类型', value: 'type' }
  //     ],
  //     otherRules_0: [],
  //     require: true
  //   }
  // ]

  // topicName validation
  @Watch('formProvide.formObj.topicName')
  private async nameNoRepeat(val: string) {
    if (!val) {
      return
    }
    const { success } = await this.h_request['httpGET']('GET_TOPICS_CHECKED', {
      topicName: val
    })
    if (success) {
      this.noRepeat = ['主题名称已被注册']
    } else {
      this.noRepeat = []
    }
    // this.formTypeObj[0].otherRules = [...this.h_validator.topicNameFormatter(), ...this.noRepeat]
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
<style scoped>
.label-end-polyfill {
  min-width: 60px;
}
</style>
