<template>
  <v-row no-gutters>
    <!-- 主题名称 -->
    <HSimpleInput
      v-model="formProvide.formObj['topicName']"
      :description="`主题名称`"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('主题名称'), ...h_validator.topicNameFormatter(), ...noRepeat]"
      v-topicNameNoRepeat="{
        set: n => {
          noRepeat = [...n]
        }
      }"
    />
    <!-- 数据库地址 -->
    <HSimpleInput
      v-model="formProvide.formObj['dataBaseIp']"
      :description="`数据库地址`"
      :disabled="formProvide.formObj.canNotEdit"
      :rules="[...h_validator.noEmpty('数据库地址')]"
    />

    <!-- 数据库类型 -->
    <HSelect
      :description="`数据库类型`"
      placeholder="请选择数据库类型"
      v-model="formProvide.formObj['dataBaseType']"
      :rules="[...h_validator.noEmpty('数据库类型')]"
      :items="items"
    />

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
              placeholder="字段名"
              :rules="[...h_validator.noEmpty('字段名'), ...noRepeatKey]"
              height="35"
            ></v-text-field>
          </v-col>
          <v-col class="mr-2">
            <v-text-field
              v-model="item.description"
              dense
              :disabled="item.disabled"
              outlined
              placeholder="描述"
              :rules="[...h_validator.noEmpty('描述')]"
              height="35"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-model="item.type"
              dense
              outlined
              :disabled="item.disabled"
              placeholder="字段类型"
              :rules="[...h_validator.noEmpty('字段类型')]"
              height="35"
              :items="items2"
            ></v-select>
          </v-col>
          <!-- 按钮 -->
          <v-col class="d-flex justify-space-around label-end-polyfill flex-grow-0">
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
              <v-icon dark>{{ mdiPlus }}</v-icon>
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
              <v-icon dark>{{ mdiMinus }}</v-icon>
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
import { mdiPlus, mdiMinus } from '@mdi/js'
import HSimpleInput from '@/components/h-simple-input.vue'
import HSelect from '@/components/h-select.vue'

@Component({
  components: {
    HSimpleInput,
    HSelect
  }
})
@Validator(['topicNameFormatter', 'noEmpty'])
export default class CreateDataBaseAcquisition extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private mdiPlus = mdiPlus
  private mdiMinus = mdiMinus
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
