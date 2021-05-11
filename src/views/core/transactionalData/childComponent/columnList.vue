<template>
  <v-col cols="12" class="columnList d-flex">
    <label class="label mr-2"><span v-if="required" class="require-span">*</span>{{ description }}</label>
    <div class="ml-4">
      <v-row
        class="d-flex justify-space-between"
        no-gutters
        v-for="(item, index) in formProvide.formObj['column']"
        :key="item.id"
      >
        <!-- 字段名  -->
        <v-col class="mr-2">
          <v-text-field
            v-model="item.field"
            dense
            outlined
            :disabled="item.disabled"
            label="字段名"
            :rules="[...h_validator.noEmpty('字段名'), ...noRepeatKey]"
            height="35"
          ></v-text-field>
        </v-col>
        <!-- 描述 -->
        <v-col class="mr-2">
          <v-text-field
            v-model="item.description"
            dense
            outlined
            :disabled="item.disabled"
            label="描述"
            height="35"
          ></v-text-field>
        </v-col>
        <!-- 字段类型 -->
        <v-col class="mr-2">
          <v-select
            v-model="item.type"
            :items="typeItems"
            dense
            outlined
            :disabled="item.disabled"
            label="字段类型"
            :rules="[...h_validator.noEmpty('字段类型')]"
            height="35"
          ></v-select>
        </v-col>
        <!-- 是否为key -->
        <v-col>
          <v-select
            v-model="item.iskey"
            dense
            outlined
            label="是否为key"
            :disabled="item.disabled"
            :rules="[...h_validator.noEmpty('是否为key')]"
            height="35"
            :items="iskeyItems"
          ></v-select>
        </v-col>
        <!-- 按钮 -->
        <v-col class="d-flex justify-space-around flex-grow-0" style="min-width: 60px">
          <!-- 加 -->
          <v-btn
            v-if="!item.disabled && formProvide.formObj['column'].length === index + 1"
            fab
            dark
            depressed
            max-width="22"
            max-height="22"
            color="primary"
            style="margin-top: 7px"
            @click.stop="add"
          >
            <v-icon dark>{{ mdiPlus }}</v-icon>
          </v-btn>
          <!-- 减 -->
          <v-btn
            v-if="!item.disabled && formProvide.formObj['column'].length > 1"
            fab
            dark
            depressed
            max-width="22"
            max-height="22"
            color="primary"
            style="margin-top: 7px"
            @click.stop="minus(index, item.disabled)"
          >
            <v-icon dark>{{ mdiMinus }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-col>
</template>
<script lang="ts">
import Validator from '@/decorator/validatorDecorator'
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import { mdiPlus, mdiMinus } from '@mdi/js'
// required 会在 description 前添加 * 标识
@Component({})
@Validator(['noEmpty', 'topicNameFormatter'])
export default class ColumnList extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  @Prop({ default: true }) private required!: boolean
  @Prop() private description!: string

  private typeItems = ['boolean', 'short', 'int', 'long', 'float', 'double', 'string']
  private iskeyItems = ['true', 'false']

  private mdiPlus = mdiPlus
  private mdiMinus = mdiMinus
  private noRepeatKey: string[] = []

  private items = [
    { text: 'Int', value: 1 },
    { text: 'String', value: 'str' },
    { text: 'Date', value: 'Date' },
    { text: 'TimeStamp', value: 'TimeStamp' }
  ]
  // add
  private add() {
    this.formProvide.formObj['column'].push({
      field: '',
      type: 'string',
      iskey: 'false',
      description: '',
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
  private handleKeyNoRepeat(val: Array<{ field: string }>) {
    let _L: Array<string> = [] // 全部
    let _l: Array<string> = [] // 不重复
    let _r: Array<string> = [] // 重复项

    val.forEach(item => {
      if (item.field) {
        _L.push(item.field)
        _l.includes(item.field) ? _r.push(item.field) : _l.push(item.field)
      }
    })

    if (_L.length > _l.length) {
      // _r去重
      this.noRepeatKey = [`字段名"${Array.from(new Set(_r)).join(',')}"不能重复`]
    } else {
      this.noRepeatKey = []
    }
  }
}
</script>
