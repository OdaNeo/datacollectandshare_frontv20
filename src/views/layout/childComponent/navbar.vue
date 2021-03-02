<template>
  <v-list id="navbar" dark class="pt-0" expand dense>
    <v-list-group
      :value="$route.matched[0].name === item.name"
      v-for="item in navMenu"
      :key="item.id"
      append-icon="mdi-menu-up"
      :prepend-icon="item.meta.icon"
      no-action
      color="white"
    >
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-item class="ml-n3" v-for="subItem in item.childrenNavList" :key="subItem.id" link :to="subItem.meta.url">
        <v-list-item-content class="ml-0">
          <v-list-item-title v-text="subItem.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { rootStoreModule } from '@/store/modules/root'

@Component
export default class NavBar extends Vue {
  get navMenu(): unknown {
    return rootStoreModule.navMenuList
  }
}
</script>
<style scoped>
#navbar >>> .v-icon.v-icon {
  font-size: 18px;
}
</style>
