<template>
  <v-radio-group :hide-details="true" v-model="cronProvide.month.cronEvery" column>
    <v-radio value="1">
      <div slot="label">每月</div>
    </v-radio>
    <v-radio value="2">
      <div slot="label" class="cronItem">
        每隔
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :disabled="cronProvide.month.cronEvery !== `2`"
          v-model="cronProvide.month.incrementIncrement"
          :min="1"
          :max="12"
          :height="30"
          type="number"
          class="cronInput"
        ></v-text-field>
        月执行，从
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :min="1"
          :max="12"
          :height="30"
          :disabled="cronProvide.month.cronEvery !== `2`"
          v-model="cronProvide.month.incrementStart"
          type="number"
          class="cronInput"
        ></v-text-field>
        月开始
      </div>
    </v-radio>
    <v-radio value="3">
      <div slot="label" class="cronItem" style="min-width: 400px">
        具体月数（可多选）
        <v-combobox
          dense
          outlined
          full-width
          :disabled="cronProvide.month.cronEvery !== `3`"
          v-model="cronProvide.month.specificSpecific"
          :items="specificSpecificItems"
          placeholder="具体月数"
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
          :disabled="cronProvide.month.cronEvery !== `4`"
          v-model="cronProvide.month.rangeStart"
          :min="1"
          :max="11"
          :height="30"
          type="number"
          class="cronInput"
        ></v-text-field>
        到
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :disabled="cronProvide.month.cronEvery !== `4`"
          v-model="cronProvide.month.rangeEnd"
          :min="Number(cronProvide.month.rangeStart) + 1"
          :max="12"
          :height="30"
          type="number"
          class="cronInput"
        ></v-text-field>
        月
      </div>
    </v-radio>
  </v-radio-group>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'

@Component
export default class CronMonth extends Vue {
  @Inject() private readonly cronProvide!: unknown

  private get specificSpecificItems() {
    let _arr = []
    for (let i = 0; i < 12; i++) {
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
