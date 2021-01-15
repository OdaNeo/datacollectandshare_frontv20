<template>
  <div>
    <v-row justify="space-around" no-gutters>
      <v-col cols="2">
        <label class="dateRangeLabel"><span class="require-span">*</span>起始时间：</label>
      </v-col>
      <v-col cols="5">
        <v-menu
          v-model="menuStart"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="formProvide.formObj.startTime"
              :rules="[...h_validator.videoStartTimeValidate(), ...startEndDateValidator]"
              label="选择起始日期（年-月-日）"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="formProvide.formObj.startTime"
            @change="dateChange"
            @input="menuStart = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" style="margin-top: 6px">
        <v-autocomplete
          v-model="formProvide.formObj.startHour"
          height="40"
          @change="dateChange"
          label="起始时间（时）"
          :items="hours"
          dense
        ></v-autocomplete>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>
    <v-row justify="space-around" no-gutters>
      <v-col cols="2">
        <label class="dateRangeLabel"><span class="require-span">*</span>截止时间：</label>
      </v-col>
      <v-col cols="5">
        <v-menu
          v-model="menuEnd"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="formProvide.formObj.endTime"
              label="选择截止日期（年-月-日）"
              :rules="[...h_validator.videoEndTimeValidate(), ...startEndDateValidator]"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="formProvide.formObj.endTime"
            @change="dateChange"
            @input="menuEnd = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" style="margin-top: 6px">
        <v-autocomplete
          v-model="formProvide.formObj.endHour"
          height="40"
          @change="dateChange"
          label="截止时间（时）"
          :items="hours2"
          dense
        ></v-autocomplete>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import validator from '@/decorator/validatorDecorator'
import util from '@/decorator/utilsDecorator'

@validator(['videoStartTimeValidate', 'videoEndTimeValidate'])
@Component
@util
export default class SetDateRange extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private menuStart = false
  private menuEnd = false
  private hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  private hours2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
  private startEndDateValidator: Function[] = []
  private dateChange() {
    if (!this.formProvide.formObj.startTime || !this.formProvide.formObj.endTime) {
      return
    }
    const beginTime =
      this.h_utils.timeutil.timeToStamp(this.formProvide.formObj.startTime, '-') +
      Number(this.formProvide.formObj.startHour) * 60 * 60 * 1000
    const afterTime =
      this.h_utils.timeutil.timeToStamp(this.formProvide.formObj.endTime, '-') +
      Number(this.formProvide.formObj.endHour) * 60 * 60 * 1000

    if (beginTime >= afterTime) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.startEndDateValidator = [(v: string) => '起始日期大于截止日期']
    } else {
      this.startEndDateValidator = []
    }
  }
}
</script>
<style scoped>
.dateRangeLabel {
  font-size: 16px;
  line-height: 3rem;
  display: flex;
  justify-content: flex-end;
}
</style>
