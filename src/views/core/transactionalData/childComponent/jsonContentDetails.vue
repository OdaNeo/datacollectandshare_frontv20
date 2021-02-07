<template>
  <div id="JsonContentDetails">
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
export default class JsonContentDetails extends Vue {
  @Prop() private rowJson!: unknown
}
</script>
