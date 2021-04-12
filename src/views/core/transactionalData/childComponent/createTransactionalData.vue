<template>
  <div id="CreateTransactionalData">
    <!-- 后退 -->
    <div class="step-container">
      <v-icon :disabled="step <= 1" class="step-icon" color="primary" @click="prevStep">{{ mdiChevronLeft }}</v-icon>
      <!-- stepTitle -->
      <span class="step-title">{{ stepTitle }}</span>
      <!-- 前进 -->
      <v-icon :disabled="step >= 3" class="step-icon" color="primary" @click="nextStep">{{ mdiChevronRight }}</v-icon>
    </div>

    <v-window v-model="step">
      <v-window-item :value="1" class="ml-6" eager>
        <!-- 主题名称 -->
        <v-row no-gutters>
          <!-- 1 -->

          <HSimpleInput
            class="mt-5"
            v-model="formProvide.formObj['topicName']"
            :disabled="formProvide.formObj.canNotEdit"
            :description="`主题名称`"
            :rules="[...h_validator.noEmpty('主题名称')]"
          />
          <!-- cron -->
          <HSelect
            :description="`每日运行周期`"
            v-model="formProvide.formObj['cron']"
            :rules="[...h_validator.noEmpty('运行周期')]"
            :items="cronItems"
          />

          <HSelect
            :description="`源数据库类型`"
            placeholder="源数据库类型"
            v-model="formProvide.formObj['reader_database']"
            :rules="[...h_validator.noEmpty('源数据库类型')]"
            :items="readerDatabaseItems"
          />

          <HSelect
            :description="`目标数据库类型`"
            placeholder="目标数据库类型"
            :fontSize="14"
            v-model="formProvide.formObj['writer_database']"
            :rules="[...h_validator.noEmpty('目标数据库类型')]"
            :items="writerDatabaseItems"
          />
        </v-row>
      </v-window-item>

      <v-window-item :value="2" class="ml-6" eager>
        <v-row no-gutters>
          <!-- 2 -->
          <!-- 自增属性查询脚本 -->
          <v-col cols="12" class="d-flex mt-6">
            <label class="label mr-2">自增属性</label>
            <v-text-field
              outlined
              dense
              height="35"
              placeholder="自增属性字段名"
              v-model="formProvide.formObj['increment']"
              class="ml-4"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              height="35"
              placeholder="自增属性最大值"
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
              placeholder="用户名"
              :rules="[...h_validator.noEmpty('用户名')]"
              v-model="formProvide.formObj['reader_username']"
              class="ml-4"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              height="35"
              placeholder="密码"
              :rules="[...h_validator.noEmpty('密码')]"
              v-model="formProvide.formObj['reader_password']"
              class="ml-2"
            ></v-text-field>
            <v-text-field
              outlined
              dense
              height="35"
              placeholder="表名"
              :rules="[...h_validator.noEmpty('表名')]"
              v-model="formProvide.formObj['reader_table']"
              class="ml-2 mr-15"
            ></v-text-field>
          </v-col>
          <!-- action panel -->
          <v-col cols="12" class="d-flex mb-5">
            <label class="panels-label" @click="openPanels === 0 ? (openPanels = -1) : (openPanels = 0)">
              <span class="require-span">*</span>
              <span>表字段</span>
              <v-icon
                color="primary"
                class="panels-icon"
                style="transition: all 0.5s"
                :class="openPanels === 0 ? `panels-icon-action` : ''"
              >
                {{ mdiChevronUp }}
              </v-icon>
            </label>
          </v-col>
          <v-expansion-panels accordion flat :value="openPanels">
            <v-expansion-panel>
              <!-- <v-expansion-panel-header hide-actions class="panel-header py-0"
              ><label class="panels-label mr-2"><span class="require-span">*</span>表字段</label>
              <v-spacer></v-spacer>
            </v-expansion-panel-header> -->
              <v-expansion-panel-content eager>
                <v-row no-gutters>
                  <v-col cols="12" class="d-flex">
                    <div class="ml-4">
                      <v-row
                        class="d-flex justify-space-between"
                        no-gutters
                        v-for="(item, index) in formProvide.formObj['column']"
                        :key="item.id"
                      >
                        <v-col class="d-flex justify-space-around flex-grow-0 ml-5 mr-4" style="min-width: 80px">
                          <v-btn
                            v-if="formProvide.formObj['column'].length === index + 1"
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
                            v-if="formProvide.formObj['column'].length > 1"
                            fab
                            dark
                            depressed
                            max-width="24"
                            max-height="24"
                            color="primary"
                            style="margin-top: 5px"
                            @click.stop="minus(index)"
                          >
                            <v-icon dark>{{ mdiMinus }}</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col class="mr-2">
                          <v-text-field
                            v-model="item.field"
                            dense
                            outlined
                            label="字段名"
                            :rules="[...h_validator.noEmpty('字段名'), ...noRepeatKey]"
                            height="35"
                          ></v-text-field>
                        </v-col>
                        <v-col class="mr-2">
                          <v-select
                            v-model="item.type"
                            :items="typeItems"
                            dense
                            outlined
                            label="类型"
                            :rules="[...h_validator.noEmpty('类型')]"
                            height="35"
                          ></v-select>
                        </v-col>
                        <v-col class="mr-15">
                          <v-select
                            v-model="item.iskey"
                            dense
                            outlined
                            label="是否为key"
                            :rules="[...h_validator.noEmpty('是否为key')]"
                            height="35"
                            :items="iskeyItems"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </v-window-item>

      <v-window-item :value="3" class="ml-6" eager>
        <v-row no-gutters>
          <!-- 3 -->
          <!-- 写要求  -->
          <HSimpleInput
            class="mt-6"
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
import { Component, Vue, Inject, Watch } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'
import { mdiChevronRight, mdiChevronLeft, mdiPlus, mdiMinus, mdiChevronUp } from '@mdi/js'
import HSimpleInput from '@/components/h-simple-input.vue'
import HSelect from '@/components/h-select.vue'

@Component({
  components: {
    HSimpleInput,
    HSelect
  }
})
@Validator(['noEmpty'])
export default class CreateTransactionalData extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private mdiChevronRight = mdiChevronRight
  private mdiChevronLeft = mdiChevronLeft
  private mdiPlus = mdiPlus
  private mdiMinus = mdiMinus
  private mdiChevronUp = mdiChevronUp

  private noRepeatKey: string[] = []
  private typeItems = ['boolean', 'short', 'int', 'long', 'float', 'double', 'string']
  private iskeyItems = ['true', 'false']
  private readerDatabaseItems = ['mysql']
  private writerDatabaseItems = ['hbase']

  private step = 1
  private stepTitle = ''
  // 控制打开面板
  private openPanels = -1

  private get cronItems() {
    const _arr = []
    for (let i = 0; i < 24; i++) {
      _arr.push(`${i} 时`)
    }
    return _arr
  }

  // add
  private add() {
    this.formProvide.formObj['column'].push({
      ['field']: '',
      ['type']: 'string',
      ['iskey']: 'false'
    })
  }
  // minus
  private minus(index: number) {
    // if (bo) {
    //   // disable 不能修改
    //   return
    // } else {
    this.formProvide.formObj['column'].splice(index, 1)
    // }
  }

  private prevStep() {
    if (this.step < 1) {
      this.step = 1
      return
    } else {
      this.step--
    }
  }

  private nextStep() {
    if (this.step > 3) {
      this.step = 3
      return
    } else {
      this.step++
    }
  }

  // validation topicList no-repeat-key
  @Watch('formProvide.formObj.column', { deep: true })
  private handleKeyNoRepeat(val: Array<any>) {
    let _L: Array<string> = []
    let _l: Array<string> = []
    val.forEach(item => {
      if (item.field && !_l.includes(item.field)) {
        _l.push(item.field)
      }
      if (item.field) {
        _L.push(item.field)
      }
    })
    if (_L.length > _l.length) {
      this.noRepeatKey = ['字段名不能重复']
    } else {
      this.noRepeatKey = []
    }
  }

  @Watch('step', { immediate: true })
  private changeTitle(n: number) {
    switch (n) {
      case 1:
        this.stepTitle = '1/3 基本信息'
        return
      case 2:
        this.stepTitle = '2/3 源数据库信息'
        return
      case 3:
        this.stepTitle = '3/3 目标数据库信息'
        return
      default:
        this.stepTitle = '基本信息'
        return
    }
  }
}
</script>
<style scoped>
#CreateTransactionalData >>> .v-expansion-panel--active > .v-expansion-panel-header {
  min-height: 30px;
}
#CreateTransactionalData >>> .v-expansion-panel-content__wrap {
  padding: 0px !important;
}
.panels-icon {
  height: 32px;
  width: 60px;
}
.panels-icon-action {
  transform: rotate(180deg);
}
.panels-label {
  min-width: 170px;
  display: flex;
  justify-content: flex-end;
  color: rgba(0, 0, 0, 0.87);
  font-size: 0.9rem;
  line-height: 35px;
  cursor: pointer;
}
.step-container {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.step-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.step-title {
  display: inline-block;
  width: 250px;
  text-align: center;
  font-size: 16px;
}
</style>
