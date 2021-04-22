<template>
  <div id="CreateTransactionalData">
    <!-- 步骤条 -->
    <HStep :step="step" :stepTitle="stepTitle" :MAX="4" @nextStep="nextStep" @prevStep="prevStep" />

    <v-window v-model="step">
      <!-- 1 -->
      <v-window-item :value="1" class="ml-6" eager>
        <!-- 主题名称 -->
        <v-row no-gutters>
          <!-- 选择主题ID -->
          <HSelect
            class="mt-6"
            v-model="formProvide.formObj.id"
            :description="`选择主题ID`"
            :items="formProvide.formObj.activeTopicIDs"
            @input="changeTopic"
          />

          <HSimpleInput
            v-model="formProvide.formObj['topicName']"
            :disabled="formProvide.formObj.canNotEdit"
            :description="`主题名称`"
            :rules="[...h_validator.noEmpty('主题名称')]"
          />

          <ColumnList :description="`主题结构数据`" />
        </v-row>
      </v-window-item>

      <!-- 2 -->
      <v-window-item :value="2" class="ml-6" eager>
        <v-row no-gutters>
          <!-- cron -->
          <HSlider
            class="mt-6"
            :description="`每日运行周期`"
            :polyfill="`时`"
            :polyfillWidth="35"
            min="0"
            max="23"
            v-model="formProvide.formObj['cron']"
          />
        </v-row>
      </v-window-item>

      <!-- 3 -->
      <v-window-item :value="3" class="ml-6" eager>
        <v-row no-gutters>
          <HSelect
            class="mt-6"
            :description="`源数据库类型`"
            v-model="formProvide.formObj['reader_database']"
            :rules="[...h_validator.noEmpty('源数据库类型')]"
            :items="readerDatabaseItems"
          />

          <!-- 自增属性查询脚本 -->
          <v-col cols="12" class="d-flex">
            <label class="label mr-2">自增属性</label>
            <v-text-field
              outlined
              dense
              height="35"
              label="自增属性字段名"
              v-model="formProvide.formObj['increment']"
              class="ml-4"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              height="35"
              label="自增属性最大值"
              v-model="formProvide.formObj['maxValue']"
              v-only-num
              class="ml-2 mr-15"
            ></v-text-field>
          </v-col>
          <!-- 读要求 -->
          <!-- mysql-->
          <HSimpleInput
            v-model="formProvide.formObj['reader_jdbcUrl']"
            :description="`数据库url`"
            :rules="[...h_validator.noEmpty('数据库url')]"
          />

          <v-col cols="12" class="d-flex">
            <label class="label mr-2"><span class="require-span">*</span>数据库信息</label>
            <v-text-field
              outlined
              dense
              height="35"
              label="用户名"
              :rules="[...h_validator.noEmpty('用户名')]"
              v-model="formProvide.formObj['reader_username']"
              class="ml-4"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              height="35"
              label="密码"
              :rules="[...h_validator.noEmpty('密码')]"
              v-model="formProvide.formObj['reader_password']"
              class="ml-2"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              height="35"
              label="表名"
              :rules="[...h_validator.noEmpty('表名')]"
              v-model="formProvide.formObj['reader_table']"
              class="ml-2 mr-15"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item :value="4" class="ml-6" eager>
        <v-row no-gutters>
          <!-- 4 -->
          <!-- 写要求  -->
          <HSelect
            class="mt-6"
            :description="`目标数据库类型`"
            v-model="formProvide.formObj['writer_database']"
            :rules="[...h_validator.noEmpty('目标数据库类型')]"
            :items="writerDatabaseItems"
          />

          <HSimpleInput
            v-model="formProvide.formObj['writer_zookeeper_url']"
            :description="`zookeeper地址`"
            :rules="[...h_validator.noEmpty('zookeeper地址')]"
          />

          <HSimpleInput
            v-model="formProvide.formObj['writer_table']"
            :description="`表名`"
            :rules="[...h_validator.noEmpty('表名')]"
          />
        </v-row>
      </v-window-item>
    </v-window>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import HStep from '@/components/h-step.vue'
import HSimpleInput from '@/components/h-simple-input.vue'
import HSelect from '@/components/h-select.vue'
import HSlider from '@/components/h-slider.vue'
import ColumnList from './columnList.vue'
@Component({
  components: {
    HSimpleInput,
    HSelect,
    HSlider,
    ColumnList,
    HStep
  }
})
@Validator(['noEmpty'])
export default class CreateTransactionalData extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  // 新建主题
  // 选择主题
  // 新建任务  主题 + 任务自己添加
  private readerDatabaseItems = ['mysql']
  private writerDatabaseItems = ['hbase']

  private step = 1
  private stepTitle = [
    '主题结构数据信息',
    '任务属性信息——运行周期',
    '任务属性信息——源数据库',
    '任务属性信息——目标数据库'
  ]
  // 控制打开面板

  private prevStep() {
    if (this.step < 1) {
      this.step = 1
      return
    } else {
      this.step--
    }
  }

  private nextStep() {
    if (this.step > 4) {
      this.step = 4
      return
    } else {
      this.step++
    }
  }

  // 选择主题回显
  private changeTopic(val: string | null) {
    // 非新建 , 不需要验重
    if (val && val !== this.formProvide.formObj.activeTopicIDs[0].value) {
      const item = this.formProvide.formObj.activeTopicIDs
      let obj1: any

      item.forEach((item: { value: string | null; dataStruct: string }) => {
        if (item.value === val) {
          obj1 = JSON.parse(item.dataStruct)
        }
      })
      this.formProvide.formObj.id = val
      this.formProvide.formObj.topicName = val
      this.formProvide.formObj.canNotEdit = true
      this.formProvide.formObj.column = obj1.map((item: {}) => ({ ...item, disabled: true }))
    } else {
      // 新建 需要验重
      this.formProvide.formObj.id = val
      this.formProvide.formObj.topicName = ''
      this.formProvide.formObj.canNotEdit = false
      this.formProvide.formObj.column = [
        {
          field: '',
          type: 'string',
          iskey: 'false',
          disabled: false
        }
      ]
    }
  }
}
</script>
