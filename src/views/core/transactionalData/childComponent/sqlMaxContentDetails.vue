<template>
  <div id="SqlMaxContentDetails">
    <v-container>
      {{ rowJson }}
    </v-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({})
export default class SqlMaxContentDetails extends Vue {
  @Prop() private rowJson!: unknown
}
</script>
