<template>
  <div id="cmdInformationDialog">
    {{ rowDescription }}
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({})
export default class CmdInformationDialog extends Vue {
  @Prop() private rowDescription!: string
}
</script>
