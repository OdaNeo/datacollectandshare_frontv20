<template>
  <v-radio-group
    :disabled="cronProvide.mutexDayAndWeek === 'week'"
    :hide-details="true"
    v-model="cronProvide.day.cronEvery"
    column
  >
    <v-radio value="5">
      <div slot="label">不设置（日和周只能设置其中之一）</div>
    </v-radio>
    <v-radio value="1">
      <div slot="label">每日</div>
    </v-radio>
    <v-radio value="2">
      <div slot="label" class="cronItem">
        从
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :min="1"
          :max="31"
          :height="30"
          :disabled="cronProvide.day.cronEvery !== `2`"
          v-model="cronProvide.day.incrementStart"
          type="number"
          class="cronInput"
        ></v-text-field>
        天开始，每隔
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :disabled="cronProvide.day.cronEvery !== `2`"
          v-model="cronProvide.day.incrementIncrement"
          :min="1"
          :max="31"
          :height="30"
          type="number"
          class="cronInput"
        ></v-text-field>
        天执行
      </div>
    </v-radio>
    <v-radio value="3">
      <div slot="label" class="cronItem" style="min-width: 450px">
        具体天数（可多选）
        <v-combobox
          dense
          outlined
          full-width
          :disabled="cronProvide.day.cronEvery !== `3`"
          v-model="cronProvide.day.specificSpecific"
          :items="specificSpecificItems"
          placeholder="具体天数"
          multiple
          :hide-details="true"
          height="30"
        ></v-combobox>
      </div>
    </v-radio>
    <v-radio value="4">
      <div slot="label" class="cronItem">
        周期：从
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :disabled="cronProvide.day.cronEvery !== `4`"
          v-model="cronProvide.day.rangeStart"
          :min="1"
          :max="30"
          :height="30"
          type="number"
          class="cronInput"
        ></v-text-field>
        到
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :disabled="cronProvide.day.cronEvery !== `4`"
          v-model="cronProvide.day.rangeEnd"
          :min="Number(cronProvide.day.rangeStart) + 1"
          :max="31"
          :height="30"
          type="number"
          class="cronInput"
        ></v-text-field>
        日
      </div>
    </v-radio>
  </v-radio-group>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'

@Component
export default class CronDay extends Vue {
  @Inject() private readonly cronProvide!: unknown

  private get specificSpecificItems() {
    let _arr = []
    for (let i = 0; i < 31; i++) {
      _arr[i] = i + 1
    }
    return _arr
  }
}
</script>
<style scoped>
#HCron >>> .v-input__append-inner {
  margin-top: 3px !important;
}
.cronItem {
  display: flex;
  justify-content: center;
  align-items: center;
}
.cronInput {
  margin: 0 10px;
  width: 68px;
}
</style>
