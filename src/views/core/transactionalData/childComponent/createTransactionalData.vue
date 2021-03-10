<template>
  <v-row no-gutters>
    <!-- 主题名称 -->
    <v-col cols="12" class="d-flex">
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

    <!-- 运行周期 示例 -->
    <!-- <v-col cols="12" class="d-flex mb-6">
      <label class="label mr-2">运行周期示例</label>
      <v-btn color="grey" class="ml-4" outlined @click="showCron = true">查看</v-btn>
    </v-col> -->

    <!-- 运行周期 弹框 -->
    <!-- <v-dialog v-model="showCron" width="450">
      <v-card>
        <v-card-title style="font-size: 18px">运行周期示例</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-5">
          <p style="white-space: pre-wrap">{{ cronDemo }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showCron = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <!-- 自增属性查询脚本 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>自增属性</label>
      <v-text-field
        outlined
        dense
        height="34"
        label="自增属性字段名"
        :rules="[...h_validator.noEmpty('自增属性字段名')]"
        v-model="formProvide.formObj['increment']"
        class="ml-4"
      ></v-text-field>
      <v-text-field
        outlined
        dense
        height="34"
        label="自增属性最大值"
        :rules="[...h_validator.noEmpty('自增属性最大值')]"
        v-model="formProvide.formObj['maxValue']"
        class="ml-2 mr-15"
      ></v-text-field>
    </v-col>

    <!-- 自增属性查询 示例 -->
    <!-- <v-col cols="12" class="d-flex mb-6">
      <label class="label mr-2">查询脚本示例</label>
      <v-btn color="grey" class="ml-4" outlined @click="showSql = true">查看</v-btn>
    </v-col> -->
    <!-- 自增属性查询 弹框 -->
    <!-- <v-dialog v-model="showSql" width="450">
      <v-card>
        <v-card-title style="font-size: 18px">查询脚本示例</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-5">
          <p style="white-space: pre-wrap">{{ sqlDemo }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showSql = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <!-- 自增属性最大值 -->
    <!-- <v-col cols="12" class="d-flex">
      <label class="label mr-2">自增属性最大值</label>
      <v-text-field
        v-model="formProvide.formObj['maxValue']"
        outlined
        dense
        
        height="34"
        class="ml-4 mr-15"
      ></v-text-field>
    </v-col> -->

    <!-- DataX脚本 -->
    <!-- <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>column</label>
      <v-textarea
        v-model="formProvide.formObj['jsonContent']"
        auto-grow
        rows="3"
        outlined
        :rules="[...h_validator.noEmpty('DataX脚本')]"
        class="ml-4 mr-15"
      ></v-textarea>
    </v-col> -->

    <!-- 读要求 -->
    <!-- 数据库类型  mysql-->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>源数据库</label>
      <v-select
        :items="readerDatabaseItems"
        outlined
        dense
        height="34"
        label="数据库类型"
        :rules="[...h_validator.noEmpty('数据库类型')]"
        v-model="formProvide.formObj['reader_database']"
        class="ml-4 mr-15"
      ></v-select>
    </v-col>
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"></label>
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
      <label class="label mr-2"></label>
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

    <!-- 写要求  -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>目标数据库</label>
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
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"></label>
      <v-text-field
        outlined
        dense
        height="34"
        label="zookeeper地址"
        :rules="[...h_validator.noEmpty('zookeeper地址')]"
        v-model="formProvide.formObj['writer_zookeeper_url']"
        class="ml-4"
      ></v-text-field>
      <v-text-field
        outlined
        dense
        height="34"
        label="表名"
        :rules="[...h_validator.noEmpty('表名')]"
        v-model="formProvide.formObj['writer_table']"
        class="ml-2 mr-15"
      ></v-text-field>
    </v-col>

    <!-- 表字段 -->
    <v-col cols="12" class="d-flex">
      <label class="label mr-2"><span class="require-span">*</span>表字段</label>
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
              :disabled="item.disabled"
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
              :disabled="item.disabled"
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
              :disabled="item.disabled"
              label="是否为key"
              :rules="[...h_validator.noEmpty('是否为key')]"
              height="34"
              :items="iskeyItems"
            ></v-select>
          </v-col>
          <!-- 按钮 -->
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
              v-if="!item.disabled && formProvide.formObj['column'].length > 1"
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
  private typeItems = ['BOOLEAN', 'SHORT', 'INT', 'LONG', 'FLOAT', 'DOUBLE', 'STRING']
  private iskeyItems = ['true', 'false']
  private readerDatabaseItems = ['mysql']
  private writerDatabaseItems = ['hbase']
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
      ['type']: 'STRING',
      ['iskey']: 'false',
      disabled: false
    })
  }
  // minus
  private minus(index: number, bo: boolean) {
    if (bo) {
      // disable 不能修改
      return
    } else {
      this.formProvide.formObj['column'].splice(index, 1)
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
