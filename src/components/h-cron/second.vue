<template>
  <v-radio-group :hide-details="true" v-model="cronProvide.second.cronEvery" column>
    <v-radio value="1">
      <div slot="label">每秒钟</div>
    </v-radio>
    <v-radio value="2">
      <div slot="label" class="cronItem">
        每隔
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :disabled="cronProvide.second.cronEvery !== `2`"
          v-model="cronProvide.second.incrementIncrement"
          :min="1"
          :max="60"
          :height="30"
          type="number"
          class="cronInput"
        ></v-text-field>
        秒执行，从
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :min="0"
          :max="59"
          :height="30"
          :disabled="cronProvide.second.cronEvery !== `2`"
          v-model="cronProvide.second.incrementStart"
          type="number"
          class="cronInput"
        ></v-text-field>
        秒开始
      </div>
    </v-radio>
    <v-radio value="3">
      <div slot="label" class="cronItem" style="min-width: 400px">
        具体秒数（可多选）
        <v-combobox
          dense
          outlined
          full-width
          :disabled="cronProvide.second.cronEvery !== `3`"
          v-model="cronProvide.second.specificSpecific"
          :items="specificSpecificItems"
          placeholder="具体秒数"
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
          :disabled="cronProvide.second.cronEvery !== `4`"
          v-model="cronProvide.second.rangeStart"
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
          :disabled="cronProvide.second.cronEvery !== `4`"
          v-model="cronProvide.second.rangeEnd"
          :min="Number(cronProvide.second.rangeStart) + 1"
          :max="59"
          :height="30"
          type="number"
          class="cronInput"
        ></v-text-field>
        秒
      </div>
    </v-radio>
  </v-radio-group>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'

@Component
export default class CronSecond extends Vue {
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
