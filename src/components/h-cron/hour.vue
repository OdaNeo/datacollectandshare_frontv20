<template>
  <v-radio-group :hide-details="true" v-model="cronProvide.hour.cronEvery" column>
    <v-radio value="1">
      <div slot="label">每一小时</div>
    </v-radio>
    <v-radio value="2">
      <div slot="label" class="cronItem">
        从
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :min="0"
          :max="23"
          :height="30"
          :disabled="cronProvide.hour.cronEvery !== `2`"
          v-model="cronProvide.hour.incrementStart"
          type="number"
          class="cronInput"
        ></v-text-field>
        小时开始，每隔
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :disabled="cronProvide.hour.cronEvery !== `2`"
          v-model="cronProvide.hour.incrementIncrement"
          :min="0"
          :max="23"
          :height="30"
          type="number"
          class="cronInput"
        ></v-text-field>
        小时执行
      </div>
    </v-radio>
    <v-radio value="3">
      <div slot="label" class="cronItem" style="min-width: 450px">
        具体小时数（可多选）
        <v-combobox
          dense
          outlined
          full-width
          :disabled="cronProvide.hour.cronEvery !== `3`"
          v-model="cronProvide.hour.specificSpecific"
          :items="specificSpecificItems"
          placeholder="具体小时数"
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
          :disabled="cronProvide.hour.cronEvery !== `4`"
          v-model="cronProvide.hour.rangeStart"
          :min="0"
          :max="23"
          :height="30"
          type="number"
          class="cronInput"
        ></v-text-field>
        到
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :disabled="cronProvide.hour.cronEvery !== `4`"
          v-model="cronProvide.hour.rangeEnd"
          :min="Number(cronProvide.hour.rangeStart) + 1"
          :max="23"
          :height="30"
          type="number"
          class="cronInput"
        ></v-text-field>
        小时
      </div>
    </v-radio>
  </v-radio-group>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'

@Component
export default class CronHour extends Vue {
  @Inject() private readonly cronProvide!: unknown

  private get specificSpecificItems() {
    let _arr = []
    for (let i = 0; i < 24; i++) {
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
