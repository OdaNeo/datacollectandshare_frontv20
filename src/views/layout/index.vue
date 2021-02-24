<template>
  <v-app id="tct">
    <!-- <v-navigation-drawer
      app
      width="240"
      :color="PROJECT_BASE_COLOR"
      v-show="navBar"
      style="overflow-x: visible; overflow-y: visible; animation-duration: 1s; animation-delay: 1.5s"
      class="animated bounceInLeft"
    > -->

    <v-app-bar app height="57" width="100%" style="left: 0px" :color="PROJECT_BASE_COLOR">
      <top-bar />
    </v-app-bar>
    <v-navigation-drawer class="mt-14" width="210px" height="100%" app :color="PROJECT_BASE_COLOR">
      <!-- <transition name="navbar"> -->
      <!-- <NavBar1 ></NavBar1> -->
      <nav-bar></nav-bar>
      <!-- </transition> -->
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
import NavBar from '@/components/navbar.vue'
import TopBar from '@/components/topbar.vue'
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

  // navBar = false
  // bread = false
  // content = false

  created(): void {
    // setTimeout(() => {
    // this.bread = true
    // this.navBar = true
    // // }, 0)
    // // setTimeout(() => {
    // this.content = true
    // }, 1000)
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

/* .out-leave-to {
  opacity: 0;
  transform: translate3d(-1000px, 0, 0);
}
.out-enter {
  transform: translate3d(2000px, 0, 0);
}
.out-leave-active {
  transition: 1s all ease;
}
.out-enter-active {
  transition: 1s all ease;
}

.bread-leave-to {
  opacity: 0;
  transform: translate3d(0, 300px, 0);
}
.bread-enter {
  transform: translate3d(0, -300px, 0);
}
.bread-leave-active {
  transition: 1s all ease;
}
.bread-enter-active {
  transition: 1s all ease;
}

.navbar-leave-to {
  opacity: 0;
  transform: translate3d(300px, 0, 0);
}
.navbar-enter {
  transform: translate3d(-300px, 0, 0);
}
.navbar-leave-active {
  transition: 0.5s all ease;
}
.navbar-enter-active {
  transition: 0.5s all ease;
} */
</style>
