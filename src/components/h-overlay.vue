<template>
  <v-overlay :absolute="true" opacity="0.12" :value="loading">
    <v-progress-circular indeterminate size="50"></v-progress-circular>
  </v-overlay>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class HOverLay extends Vue {
  @Prop({ default: true }) private loading!: boolean
}
</script>
