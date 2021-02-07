<template>
  <div id="SqlMaxContentDetails">
    <v-card-text>
      <v-container>
        {{ rowJson }}
      </v-container>
    </v-card-text>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({})
export default class SqlMaxContentDetails extends Vue {
  @Prop() private rowJson!: unknown
}
</script>
