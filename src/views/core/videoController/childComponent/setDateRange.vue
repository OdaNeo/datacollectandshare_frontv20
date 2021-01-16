<template>
  <v-row no-gutters>
    <!-- dateRange类型 -->
    <v-col cols="12" class="d-flex justify-space-around my-2">
      <label class="label"><span class="require-span">*</span>起始时间：</label>
      <v-menu
        v-model="menuStart"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        class="mx-4"
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="formProvide.formObj.startTime"
            prepend-icon="mdi-calendar"
            :rules="[...h_validator.noEmpty('起始时间'), ...startEndDateValidator]"
            readonly
            dense
            class="mx-4"
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
      <v-autocomplete
        v-model="formProvide.formObj.startHour"
        @change="dateChange"
        style="width: 50px"
        class="mx-4"
        dense
        :items="hours"
      ></v-autocomplete>
      <label class="label-end">时</label>
    </v-col>
    <v-col cols="12" class="d-flex justify-space-around my-2">
      <label class="label"><span class="require-span">*</span>截止时间：</label>
      <v-menu
        v-model="menuEnd"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        class="mx-4"
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="formProvide.formObj.endTime"
            :rules="[...h_validator.noEmpty('截止时间'), ...startEndDateValidator]"
            prepend-icon="mdi-calendar"
            readonly
            dense
            class="mx-4"
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
      <v-autocomplete
        v-model="formProvide.formObj.endHour"
        @change="dateChange"
        style="width: 50px"
        class="mx-4"
        dense
        :items="hours2"
      ></v-autocomplete>
      <label class="label-end">时</label>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import validator from '@/decorator/validatorDecorator'
import util from '@/decorator/utilsDecorator'

@Component
@util
@validator(['noEmpty'])
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
      this.startEndDateValidator = [(v: string) => !!v && '起始日期不能大于等于截止日期']
    } else {
      this.startEndDateValidator = []
    }
  }
}
</script>
<style scoped>
.label {
  width: 125px;
  display: flex;
  justify-content: flex-end;
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  line-height: 37px;
}

.label-end {
  width: 80px;
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  line-height: 37px;
}
</style>
