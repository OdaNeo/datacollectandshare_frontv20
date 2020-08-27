<template>
    <div id="navbar1">
        <div class="navTitle">
            <div style="background:rgb(32,34,42);display:flex;align-items:center;height:55px;">
                <h3 class="titleshadow">天枢平台 V_2.0</h3>
            </div>
            <div class="subtitle">
                <p class="loginuser">{{username}}</p>
                <div style="display:flex;align-items:center;justify-content:center">
                    <v-icon color="#FFF" style="font-size:16px">mdi-clock-time-eight-outline</v-icon>
                    <p style="color:#FFF;margin-bottom:0;font-size:14px;margin-left:5px">{{tiemString}}</p>
                </div>
            </div>
        </div>
        <ul class="navUl">
            <li 
            v-for="(item,index) in navMenu" 
            :key="index" 
            class="navLi" 
            @click="showChildUl($event,index)" 
            :class="`${childUlShow==index?'navLiActive':''} ${lastChildUlShow2==index?'lastNavLi':''}`"
            >
                <v-icon color="#FFF" style="font-size:16px;margin-left:8px;margin-right:10px">mdi-shield-lock</v-icon>
                <p>{{item.name}}</p>
                <v-icon color="#FFF" style="font-size:16px;margin-left:80px;" :style="childUlShow==index?'transform:rotate(180deg)':''">mdi-chevron-left</v-icon>
                <ul class="childUl animated flipInX" v-show="childUlShow==index" style="animation-duration:1s">
                    <router-link 
                    tag="li"
                    :to="childItem.url" 
                    v-for="(childItem,index2) in item.childrenList" 
                    :key="index2"
                    @mouseenter.native="childUlMouseEnterMethod(index2)"
                    @mouseleave.native="childUlMouseLeave(index2)"
                    >
                        <p :class="index2==enter&&leave?'enter':''">{{childItem.name}}</p>
                    </router-link>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Moment from "moment"
import {rootStoreModule} from "../store/modules/root"
import { userRootType } from '../type/vuex.type';
import { set } from 'vue/types/umd';
@Component
export default class NavBar1 extends Vue{
    private childUlShow:number = -1
    private lastChildUlShow:number = -1
    private lastChildUlShow2:number = -1
    private flag:boolean = false
    private enter:number = -1
    private leave:boolean = false
    private tiemString:string = ""
    get navMenu():userRootType[]{
        return rootStoreModule.navMenuList
    }
    get username():string{
        return `您好！${rootStoreModule.UserState.username}，欢迎登录`
    }
    private showChildUl(e:Event,index:number):void{
        e.stopPropagation()
        if(this.flag){
            this.flag = false
            this.lastChildUlShow2 = -1
        }
        if(index==this.lastChildUlShow){
            this.childUlShow = -1
            this.lastChildUlShow = -1
        }else{
            this.lastChildUlShow2 = this.lastChildUlShow
            this.childUlShow = index
            this.lastChildUlShow = index
        }
    }
    private childUlMouseEnterMethod(index:number):void{
        this.enter = index
        this.leave = true
    }
    private childUlMouseLeave(index:number):void{
        this.leave = false
    }

    private timer(){
        setInterval(()=>{
            this.tiemString = Moment().format("YYYY-MM-DD HH:mm:ss")
        },1000)
    }

    created() {
        const _this = this
        this.timer()
        document.addEventListener("click",():void=>{
            this.childUlShow = -1
            this.lastChildUlShow2 = this.lastChildUlShow
            this.lastChildUlShow = -1
            this.flag = true
        })   
    }
}
</script>

<style scoped>
.navTitle{
    width:100%;
    height:130px;
    background:rgb(0,21,41);
    border-bottom:1px solid rgb(32,34,42);
}
.navUl{
    padding:0 !important
}
.navLi{
    width:100%;
    height:55px;
    display: flex;
    align-items:center;
    position:relative;
    cursor: pointer;
}
.navLi:hover{
    background:rgb(32, 99, 170)
}
.navLi p{
    font-size:16px;
    color: #FFF;
    margin-bottom:0;
}
.navLi .childUl{
    width:180px;
    background:rgb(0,21,41);
    position: absolute;
    right:-180px;
    top:0;
    padding:0 !important;
}
.navLi .childUl li{
    width:100%;
    height:55px;
    display: flex;
    align-items:center;
    position:relative;
    cursor: pointer;
    transform-style: preserve-3d;
    perspective:400px;
}
.navLi .childUl li p{
    margin-left:15px;
    transition: .5s all ease;
}
.navLiActive{
    background:rgb(32, 99, 170)
}
.enter{
    transform: translateX(10px)
}
.lastNavLi{
    animation: twinkling .3s infinite ease-in-out;
    animation-iteration-count:1 
}
@keyframes twinkling{ 
0%{ 
background:none
}
50%{
background:rgb(204, 201, 201)
} 
100%{ 
background:none; 
} 
}
.titleshadow{
    width: 100%;
    text-align: center;
    background: -webkit-gradient(linear, left top, right top, color-stop(0, #FFF), color-stop(.4, #FFF), color-stop(.5, rgb(255,172,20)), color-stop(.6, #FFF), color-stop(1, #FFF));             
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: animate 3s infinite;
    color:#FFF;
}
@keyframes animate {
    from {background-position: -100px;}
    to {background-position: 100px;}
}
.loginuser{
    color:#FFF;
    text-align: center;
    font-size:12px;
    margin-top:15px;
}
</style>