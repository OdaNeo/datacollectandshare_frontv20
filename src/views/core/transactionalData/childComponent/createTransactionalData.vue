<template>
  <v-window id="CreateTransactionalData" show-arrows @change="changeTitle" v-model="step">
    <template v-slot:prev="{ on, attrs }">
      <v-btn depressed fab dark small color="transparent" v-bind="attrs" v-on="on"
        ><v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </template>
    <template v-slot:next="{ on, attrs }">
      <v-btn depressed fab dark small color="transparent" v-bind="attrs" v-on="on"
        ><v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </template>
    <v-window-item :value="1" class="ml-6" eager>
      <!-- 主题名称 -->
      <v-row no-gutters>
        <!-- 1 -->
        <v-col cols="12" class="d-flex mt-6">
          <label class="label mr-2"><span class="require-span">*</span>主题名称</label>
          <v-text-field
            v-model="formProvide.formObj['topicName']"
            :disabled="formProvide.formObj.canNotEdit"
            outlined
            dense
            height="34"
            :rules="[...h_validator.noEmpty('主题名称'), ...noRepeat]"
            class="ml-4 mr-15"
            v-topicNameNoRepeat="{
              set: n => {
                noRepeat = [...n]
              }
            }"
          ></v-text-field>
        </v-col>
        <!-- cron -->
        <v-col cols="12" class="d-flex">
          <label class="label mr-2"><span class="require-span">*</span>每日运行周期</label>
          <v-select
            v-model="formProvide.formObj['cron']"
            :items="cronItems"
            outlined
            dense
            height="34"
            :rules="[...h_validator.noEmpty('运行周期')]"
            class="ml-4 mr-15"
          ></v-select>
        </v-col>
        <v-col cols="12" class="d-flex">
          <label class="label mr-2"><span class="require-span">*</span>源数据库类型</label>
          <v-select
            :items="readerDatabaseItems"
            outlined
            dense
            height="34"
            label="源数据库类型"
            :rules="[...h_validator.noEmpty('源数据库类型')]"
            v-model="formProvide.formObj['reader_database']"
            class="ml-4 mr-15"
          ></v-select>
        </v-col>
        <v-col cols="12" class="d-flex">
          <label class="label mr-2" style="font-size: 14px"><span class="require-span">*</span>目标数据库类型</label>
          <v-select
            :items="writerDatabaseItems"
            outlined
            dense
            height="34"
            label="数据库类型"
            :rules="[...h_validator.noEmpty('数据库类型')]"
            v-model="formProvide.formObj['writer_database']"
            class="ml-4 mr-15"
          ></v-select>
        </v-col>
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
            height="34"
            label="自增属性字段名"
            v-model="formProvide.formObj['increment']"
            class="ml-4"
          ></v-text-field>
          <v-text-field
            outlined
            dense
            height="34"
            label="自增属性最大值"
            v-model="formProvide.formObj['maxValue']"
            class="ml-2 mr-15"
          ></v-text-field>
        </v-col>
        <!-- 读要求 -->
        <!-- mysql-->
        <v-col cols="12" class="d-flex">
          <label class="label mr-2"><span class="require-span">*</span>数据库url</label>
          <v-text-field
            outlined
            dense
            height="34"
            label="数据库url"
            :rules="[...h_validator.noEmpty('数据库url')]"
            v-model="formProvide.formObj['reader_jdbcUrl']"
            class="ml-4 mr-15"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="d-flex">
          <label class="label mr-2"><span class="require-span">*</span>数据库信息</label>
          <v-text-field
            outlined
            dense
            height="34"
            label="用户名"
            :rules="[...h_validator.noEmpty('用户名')]"
            v-model="formProvide.formObj['reader_username']"
            class="ml-4"
          ></v-text-field>
          <v-text-field
            outlined
            dense
            height="34"
            label="密码"
            :rules="[...h_validator.noEmpty('密码')]"
            v-model="formProvide.formObj['reader_password']"
            class="ml-2"
          ></v-text-field>
          <v-text-field
            outlined
            dense
            height="34"
            label="表名"
            :rules="[...h_validator.noEmpty('表名')]"
            v-model="formProvide.formObj['reader_table']"
            class="ml-2 mr-15"
          ></v-text-field>
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
                      <v-col class="mr-2">
                        <v-text-field
                          v-model="item.field"
                          dense
                          outlined
                          label="字段名"
                          :rules="[...h_validator.noEmpty('字段名'), ...noRepeatKey]"
                          height="34"
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
                          height="34"
                        ></v-select>
                      </v-col>
                      <v-col>
                        <v-select
                          v-model="item.iskey"
                          dense
                          outlined
                          label="是否为key"
                          :rules="[...h_validator.noEmpty('是否为key')]"
                          height="34"
                          :items="iskeyItems"
                        ></v-select>
                      </v-col>
                      <v-col class="d-flex justify-space-around flex-grow-0" style="min-width: 60px">
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
                          <v-icon dark>mdi-plus</v-icon>
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
                          <v-icon dark>mdi-minus</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <!-- 表字段 -->
      </v-row>
    </v-window-item>

    <v-window-item :value="3" class="ml-6" eager>
      <v-row no-gutters>
        <!-- 3 -->
        <!-- 写要求  -->
        <v-col cols="12" class="d-flex mt-6">
          <label class="label mr-2" style="font-size: 14px"><span class="require-span">*</span>zookeeper地址</label>
          <v-text-field
            outlined
            dense
            height="34"
            label="zookeeper地址"
            :rules="[...h_validator.noEmpty('zookeeper地址')]"
            v-model="formProvide.formObj['writer_zookeeper_url']"
            class="ml-4 mr-15"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="d-flex">
          <label class="label mr-2"><span class="require-span">*</span>表名</label>
          <v-text-field
            outlined
            dense
            height="34"
            label="表名"
            :rules="[...h_validator.noEmpty('表名')]"
            v-model="formProvide.formObj['writer_table']"
            class="ml-4 mr-15"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-window-item>
  </v-window>
</template>
<script lang="ts">
import { Component, Vue, Inject, Watch } from 'vue-property-decorator'
import http from '@/decorator/httpDecorator'
import { H_Vue } from '@/declaration/vue-prototype'
import Validator from '@/decorator/validatorDecorator'

@http
@Component({})
@Validator(['noEmpty'])
export default class CreateTransactionalData extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private noRepeat: Array<string> = []
  private noRepeatKey: string[] = []
  private typeItems = ['boolean', 'short', 'int', 'long', 'float', 'double', 'string']
  private iskeyItems = ['true', 'false']
  private readerDatabaseItems = ['mysql']
  private writerDatabaseItems = ['hbase']

  private step = 1
  // 控制打开面板
  private openPanels = 0

  // private showCron = false
  // private showSql = false
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

  private changeTitle(n: number) {
    switch (n) {
      case 1:
        this.formProvide.title = '创建事务主题：基本信息'
        return
      case 2:
        this.formProvide.title = '创建事务主题：源数据库信息'
        return
      case 3:
        this.formProvide.title = '创建事务主题：目标数据库信息'
        return
      default:
        this.formProvide.title = '创建事务主题'
        return
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

  // private cronDemo = '1 * * * * * ?'
  //   private sqlDemo = `{
  //     "type":"mysql",
  //     "column":"id",
  //     "sql":"select max(id) as id from video_stream_info"
  // }`
}
</script>
<style scoped>
#CreateTransactionalData >>> .v-window__next {
  right: -10px !important;
}
#CreateTransactionalData >>> .v-window__prev {
  left: -10px !important;
}
#CreateTransactionalData >>> .v-expansion-panel--active > .v-expansion-panel-header {
  min-height: 30px;
}
#CreateTransactionalData >>> .v-expansion-panel-content__wrap {
  padding-bottom: 0px !important;
}
.label-icon {
  height: 34px;
  font-size: 32px;
  padding-right: 15px;
}
.panels-label {
  width: 110px;
  color: rgba(0, 0, 0, 0.87);
  font-size: 15px;
  line-height: 34px;
  padding-left: 30px;
}
</style>
