<template>
    <div id="navbar">
        <v-list>
            <v-list-item link>
                <v-list-item-action>
                    <v-icon>mdi-home</v-icon>
                </v-list-item-action>
                <!-- <v-list-item-avatar>
                    <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
                </v-list-item-avatar> -->
                <v-list-item-content>
                    <v-list-item-title>TCT管理系统</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-group
                v-for="item in navMenu"
                :key="item.id"
                :prepend-icon="parentIcon(item.name)"
                no-action
                color="orange"
                :value="$route.matched[0].name==item.name"
            >
                <template v-slot:activator>
                <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
                </template>

                <v-list-item
                v-for="subItem in item.childrenList"
                :key="subItem.id"
                link
                input-value=true
                color="rgb(167, 221, 1)"
                :to="subItem.url"
                >
                    <v-list-item-action>
                        <v-icon>{{childIcon(subItem.name)}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title v-text="subItem.name"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>
        </v-list>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {rootStoreModule} from "../store/modules/root"
import { Route } from 'vue-router';
@Component
export default class NavBar extends Vue{
    get navMenu(){
        return rootStoreModule.navMenuList
    }

    public parentIcon(routeName:string):string{
        const $Router:any = this.$router 
        const $Route = $Router["options"]["routes"].find((v:Route)=>{
            return v["name"]==routeName
        })
        return $Route["meta"]["icon"]
    }

    public childIcon(routeName:string):string{
        const $Router:any = this.$router
        let res!:any
        $Router["options"]["routes"].forEach((route:any)=>{
            if(route.children){
                route.children.forEach((route2:Route)=>{
                    if(route2["name"]==routeName){
                        res = route2["meta"]["icon"]
                    }
                })
            }
        })
        return res
    }
}
</script>