<template>
    <div id="topbar">
        <v-row
        align="center"
        no-gutters
        justify="center"
        >
            <v-col cols="12" align-self="center">
                <h1 style="color:#FFF;text-align:center" class="titleshadow">交控科技天枢平台元数据管理中心</h1>
                <div class="userMenu" v-show="userMenuState">
                    <v-menu
                offset-y
                transition="slide-x-transition"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                        small
                        retain-focus-on-click
                        color="teal darken-1"
                        v-bind="attrs"
                        v-on="on"
                        class="white--text ma-8"
                        >
                            {{username}}
                        </v-btn>
                    </template>
                    <v-list
                    subheader
                    >
                        <v-list-item
                        v-for="(item,index) in userMenu"
                        :key="index"
                        @click="item.clickMethod"
                        >
                            <v-list-item-title>{{item.title}}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {rootStoreModule} from "../store/modules/root"

@Component
export default class TopBar extends Vue{
    private titleState:boolean = false
    private userMenuState:boolean = false
    get username(){
        return "用户："+rootStoreModule.UserState.username
    }
    userMenu = [{title:"用户信息",clickMethod:"a"},{title:"注销",clickMethod:"b"}]

    created() {
        setTimeout(()=>{
            this.titleState = true
            this.userMenuState = true
        },1000)   
    }
}
</script>

<style scoped>
    #topbar{
        width:100%;
    }
    .userMenu{
        position: absolute;
        right:50px;
        top:-15px
    }
    .titleshadow{
        width: 100%;
        height: 50px;
        text-align: center;
        background: -webkit-gradient(linear, left top, right top, color-stop(0, #FFF), color-stop(.4, #FFF), color-stop(.5, rgb(255,172,20)), color-stop(.6, #FFF), color-stop(1, #FFF));             
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: animate 3s infinite;
    }
    @keyframes animate {
        from {background-position: -500px;}
        to {background-position: 500px;}
    }
</style>