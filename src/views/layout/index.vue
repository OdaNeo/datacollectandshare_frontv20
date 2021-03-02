<template>
  <v-app id="tct">
    <v-app-bar app height="57" width="100%" style="left: 0px; z-index: 10" :color="PROJECT_BASE_COLOR">
      <TopBar />
    </v-app-bar>
    <v-navigation-drawer style="padding-top: 57px; z-index: 9" width="210px" app :color="PROJECT_BASE_COLOR">
      <NavBar />
    </v-navigation-drawer>

    <v-main style="background: rgb(246, 248, 251); width: 100%; height: 100%">
      <v-container fluid class="main-container">
        <v-breadcrumbs :items="items"></v-breadcrumbs>
        <transition name="fade-transform" mode="out-in">
          <router-view class="main-container-inner"></router-view>
        </transition>
      </v-container>
    </v-main>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavBar from './childComponent/navbar.vue'
import TopBar from './childComponent/topbar.vue'
import { PROJECT_BASE_COLOR } from '@/config'

@Component({
  components: {
    NavBar,
    TopBar
  }
})
export default class Login extends Vue {
  private PROJECT_BASE_COLOR = PROJECT_BASE_COLOR

  get items(): Array<{ text: string; disabled?: boolean; link?: boolean; to?: string }> {
    if (this.$route.matched[0].meta.title === 'tct') {
      return [
        { text: '首页', disabled: false },
        { text: this.$route.meta.title, disabled: true }
      ]
    } else {
      return [
        { text: '首页', disabled: false },
        { text: this.$route.matched[0].meta.title, disabled: false },
        { text: this.$route.meta.title, disabled: true }
      ]
    }
  }
}
</script>

<style>
#tct {
  width: 100%;
  height: auto;
}
.main-container {
  height: auto;
  width: 100%;
}
.main-container-inner {
  width: 97%;
  margin: 0 auto;
}
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
