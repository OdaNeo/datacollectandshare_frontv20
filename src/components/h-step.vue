<template>
  <!-- 后退 -->
  <div class="step-container">
    <v-icon :disabled="step <= 1" size="22" color="primary" @click="$emit('prevStep')">{{ mdiChevronLeft }}</v-icon>
    <!-- stepTitle -->
    <span class="step-title">{{ stepTitle[step - 1] }}</span>
    <!-- 前进 -->
    <v-icon :disabled="step >= MAX" size="22" color="primary" @click="$emit('nextStep')">{{ mdiChevronRight }}</v-icon>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdiChevronRight, mdiChevronLeft } from '@mdi/js'

@Component({})
export default class HStep extends Vue {
  @Prop({ default: 1 }) private step!: number
  @Prop({ default: 1 }) private MAX!: number
  @Prop({ default: [`基本信息`] }) private stepTitle!: string[]
  private mdiChevronRight = mdiChevronRight
  private mdiChevronLeft = mdiChevronLeft
}
</script>
<style scoped>
.step-container {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.step-title {
  display: inline-block;
  width: 300px;
  text-align: center;
  font-size: 1rem;
  color: #1890ff;
}
</style>
