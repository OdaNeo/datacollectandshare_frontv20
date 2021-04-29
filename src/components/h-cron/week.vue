<template>
  <v-radio-group
    :disabled="cronProvide.mutexDayAndWeek === 'day'"
    :hide-details="true"
    v-model="cronProvide.week.cronEvery"
    column
  >
    <v-radio value="5">
      <div slot="label">不设置（日和周只能设置其中之一）</div>
    </v-radio>
    <v-radio value="2">
      <div slot="label" class="cronItem">
        从
        <v-select
          :hide-details="true"
          dense
          outlined
          :height="30"
          :disabled="cronProvide.week.cronEvery !== `2`"
          v-model="cronProvide.week.incrementStart"
          :items="specificSpecificItems"
          class="cronSelect"
        ></v-select>
        开始，每隔
        <v-text-field
          :hide-details="true"
          dense
          outlined
          :disabled="cronProvide.week.cronEvery !== `2`"
          v-model="cronProvide.week.incrementIncrement"
          :min="1"
          :max="6"
          :height="30"
          type="number"
          class="cronInput"
        ></v-text-field>
        周执行
      </div>
    </v-radio>
    <v-radio value="3">
      <div slot="label" class="cronItem" style="min-width: 450px">
        具体周几（可多选）
        <v-combobox
          dense
          outlined
          :disabled="cronProvide.week.cronEvery !== `3`"
          v-model="cronProvide.week.specificSpecific"
          :items="specificSpecificItems"
          placeholder="具体周几"
          multiple
          :hide-details="true"
          height="30"
        ></v-combobox>
      </div>
    </v-radio>
    <v-radio value="4">
      <div slot="label" class="cronItem">
        周期：从
        <v-select
          :hide-details="true"
          dense
          outlined
          :height="30"
          :disabled="cronProvide.week.cronEvery !== `4`"
          v-model="cronProvide.week.rangeStart"
          :items="specificSpecificItems"
          class="cronSelect"
        ></v-select>
        到
        <v-select
          :hide-details="true"
          dense
          outlined
          :height="30"
          :disabled="cronProvide.week.cronEvery !== `4`"
          v-model="cronProvide.week.rangeEnd"
          :items="specificSpecificItems"
          class="cronSelect"
        ></v-select>
      </div>
    </v-radio>
  </v-radio-group>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'

@Component
export default class CronWeek extends Vue {
  @Inject() private readonly cronProvide!: unknown

  private specificSpecificItems = [`0`, `1`, `2`, `3`, `4`, `5`, `6`]
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
.cronSelect {
  margin: 0 10px;
  width: 100px;
}
</style>
