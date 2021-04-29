<template>
  <v-radio-group :hide-details="true" v-model="cronProvide.minute.cronEvery" column>
    <v-radio value="1">
      <div slot="label">每一分钟</div>
    </v-radio>
    <v-radio value="2">
      <div slot="label" class="cronItem">
        从
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :min="0"
          :max="59"
          :height="30"
          :disabled="cronProvide.minute.cronEvery !== `2`"
          v-model="cronProvide.minute.incrementStart"
          type="number"
          class="cronInput"
        ></v-text-field>
        分开始，每隔
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :disabled="cronProvide.minute.cronEvery !== `2`"
          v-model="cronProvide.minute.incrementIncrement"
          :min="1"
          :max="60"
          :height="30"
          type="number"
          class="cronInput"
        ></v-text-field>
        分执行
      </div>
    </v-radio>
    <v-radio value="3">
      <div slot="label" class="cronItem" style="min-width: 450px">
        具体分钟数（可多选）
        <v-combobox
          dense
          outlined
          full-width
          :disabled="cronProvide.minute.cronEvery !== `3`"
          v-model="cronProvide.minute.specificSpecific"
          :items="specificSpecificItems"
          placeholder="具体分钟数"
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
          :disabled="cronProvide.minute.cronEvery !== `4`"
          v-model="cronProvide.minute.rangeStart"
          :min="0"
          :max="58"
          :height="30"
          type="number"
          class="cronInput"
        ></v-text-field>
        到
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :disabled="cronProvide.minute.cronEvery !== `4`"
          v-model="cronProvide.minute.rangeEnd"
          :min="Number(cronProvide.minute.rangeStart) + 1"
          :max="59"
          :height="30"
          type="number"
          class="cronInput"
        ></v-text-field>
        分
      </div>
    </v-radio>
  </v-radio-group>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'

@Component
export default class CronMinute extends Vue {
  @Inject() private readonly cronProvide!: unknown

  private get specificSpecificItems() {
    let _arr = []
    for (let i = 0; i < 60; i++) {
      _arr[i] = i
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
