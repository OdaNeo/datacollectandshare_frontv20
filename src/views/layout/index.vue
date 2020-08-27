<template>
    <v-app id="tct">
        <v-navigation-drawer 
        app
        width="200"
        color="rgb(0,21,41)"
        v-show="navBar"
        style="overflow-x:visible;overflow-y:visible;animation-duration:1s;animation-delay:1.5s"
        class="animated bounceInLeft"
        >
            <transition name="navbar">
                <NavBar1 v-show="navBar"></NavBar1>
            </transition>
        </v-navigation-drawer>
        <v-app-bar 
        app 
        height="57"
        color="rgb(0,21,41)"
        class="animated bounceInDown"
        >
                <TopBar></TopBar>
        </v-app-bar>
        <v-main style="background:rgb(246,248,251);">
            <v-container fluid style="height:100%">
                <transition name="fade">
                    <v-breadcrumbs :items="items" v-show="bread"></v-breadcrumbs>
                </transition>
                <transition name="out">
                    <router-view v-show="bread"></router-view>
                </transition>
            </v-container>
        </v-main>
    </v-app>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {rootStoreModule} from "../../store/modules/root"
import NavBar from '../../components/navbar.vue';
import TopBar from '../../components/topbar.vue';
import NavBar1 from '../../components/navbar1.vue'
@Component({
    components:{
        NavBar,
        TopBar,
        NavBar1
    }
})
export default class Login extends Vue{
    get items(){
        return this.$route.matched[0].meta.title=="tct"?[
            {
                text: '首页',
                disabled: false
            },
            {
                text:this.$route.meta.title,
                disabled: false
            }
        ]:[
            {
                text: '首页',
                disabled: false,
                link:true,
                to:'/statePage/welcome'
            },
            {
                text:this.$route.matched[0].meta.title,
                disabled: false
            },
            {
                text:this.$route.meta.title,
                disabled: false
            }
        ]
    }
    navBar:boolean = false
    bread:boolean = false
    content:boolean = false
    created() {
        setTimeout(()=>{
            this.bread = true
            this.navBar = true
        },0)
         setTimeout(()=>{
            this.content = true
        },1000)      
    }
}
</script>

<style>
.out-leave-to{
    opacity:0;
    transform: translate3d(-1000px,0,0);
}
.out-enter{
    transform: translate3d(2000px,0,0);
}
.out-leave-active{
    transition: 1s all ease;
}
.out-enter-active{
    transition: 1s all ease;
}
.fade-leave-to{
    opacity:0;
    transform: translate3d(300px,0,0);
}
.fade-enter{
    transform: translate3d(-1000px,0,0);
}
.fade-leave-active{
    transition: 1s all ease;
}
.fade-enter-active{
    transition: 1s all ease;
}

.bread-leave-to{
    opacity:0;
    transform: translate3d(0,300px,0);
}
.bread-enter{
    transform: translate3d(0,-300px,0);
}
.bread-leave-active{
    transition: 1s all ease;
}
.bread-enter-active{
    transition: 1s all ease;
}

.navbar-leave-to{
    opacity:0;
    transform: translate3d(300px,0,0);
}
.navbar-enter{
    transform: translate3d(-300px,0,0);
}
.navbar-leave-active{
    transition: .5s all ease;
}
.navbar-enter-active{
    transition: .5s all ease;
}
</style>