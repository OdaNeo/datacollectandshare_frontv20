<template>
  <v-app id="app">
    <router-view></router-view>
    <h-message></h-message>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HMessage from './components/h-message/h-messageComponent.vue'

@Component({
  components: {
    HMessage
  }
})
export default class App extends Vue {}
</script>
