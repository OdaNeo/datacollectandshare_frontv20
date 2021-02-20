<template>
  <!-- <div id="navbar"> -->
  <v-list id="navbar" dark class="pt-0" expand dense>
    <!-- <v-list-item link>
        <v-list-item-action>
          <v-icon>mdi-home</v-icon>
        </v-list-item-action> -->
    <!-- <v-list-item-avatar>
                    <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
                </v-list-item-avatar> -->
    <!-- <v-list-item-content>
          <v-list-item-title>天枢平台元数据配置管理中心</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->
    <!-- <div id="navContent"> -->
    <!-- <v-list-group
                    v-for="item in navMenu"
                    :key="item.id"
                    :prepend-icon="parentIcon(item.name)"
                    no-action
                    :value="$route.matched[0].name===item.name"
                > -->
    <v-list-group
      :value="$route.matched[0].name === item.name"
      v-for="item in navMenu"
      :key="item.id"
      append-icon="mdi-menu-up"
      :prepend-icon="parentIcon(item.url)"
      no-action
      color="white"
    >
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-item class="ml-n3" v-for="subItem in item.childrenList" :key="subItem.id" link :to="subItem.url">
        <!-- <v-list-item-action> -->
        <!-- <v-icon>{{ childIcon(subItem.name) }}</v-icon> -->
        <!-- </v-list-item-action> -->
        <v-list-item-content class="ml-0">
          <v-list-item-title v-text="subItem.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>
    <!-- </div> -->
  </v-list>
  <!-- </div> -->
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { rootStoreModule } from '../store/modules/root'
import { userRootType } from '@/type/vuex.type.ts'

@Component
export default class NavBar extends Vue {
  get navMenu(): userRootType[] {
    return rootStoreModule.navMenuList
  }

  public parentIcon(url: string): string {
    const $Route = this.$router.options.routes?.find(v => {
      return v.path === url
    })
    return $Route?.meta.icon
  }

  // public childIcon(routeName: string): string {
  //   // const $Router: any = this.$router
  //   let res!: string
  //   this.$router.options.routes?.forEach(route => {
  //     if (route.children) {
  //       route.children.forEach(route2 => {
  //         if (route2.name === routeName) {
  //           res = route2.meta.icon
  //         }
  //       })
  //     }
  //   })
  //   return res
  // }
}
</script>
<style scoped>
#navbar {
  overflow-x: hidden;
  overflow-y: auto;
}
#navbar >>> .v-icon.v-icon {
  font-size: 18px;
}
</style>
