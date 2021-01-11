<template>
  <v-row justify="space-around" no-gutters>
    <v-col cols="3">
      <h-date-picker
        placeholder="选择起始日期"
        :begin="true"
        :anotherDate="afterDate"
        @pickerDate="time => (beginDate = time)"
      ></h-date-picker>
    </v-col>
    <v-col cols="2">
      <v-autocomplete :items="[1, 2, 3]" dense solo single-line outlined label="起始小时"></v-autocomplete>
    </v-col>
    <v-col cols="3">
      <h-date-picker
        placeholder="选择截止日期"
        :begin="false"
        :anotherDate="beginDate"
        @pickerDate="time => (afterDate = time)"
      ></h-date-picker>
    </v-col>
    <v-col cols="2">
      <v-autocomplete :items="[1, 2, 3]" dense solo single-line outlined label="截至小时"></v-autocomplete>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import HDatePicker from '@/components/h-date-picker.vue'

@Component({
  components: {
    HDatePicker
  }
})
export default class SetDateRange extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  private beginDate: string | null = null
  private afterDate: string | null = null
}
</script>
