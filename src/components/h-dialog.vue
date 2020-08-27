<template>
    <div>
        <v-dialog
        v-model="closeDialog"
        max-width="600px"
        persistent
        content-class="roleDialog"
        >
            <v-card>
                <v-card-title class="dialog-title">
                    <p style="margin-bottom:0">{{formProvide.title}}</p>
                    <v-btn
                    icon
                    class="close-btn"
                    @click="closeMethod($event)"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <h-form>
                            <slot name="dialog-content" slot="dialog-form-content"></slot>
                        </h-form>
                    </v-container>
                </v-card-text>
            </v-card>

        </v-dialog>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop ,Model,Inject} from "vue-property-decorator";
import HForm from "../components/h-form.vue"
import { H_Vue } from '../declaration/vue-prototype';
@Component({
    components:{
        HForm
    }
})
export default class HDialog extends Vue{
    @Prop() private title!:string 
    @Model("hdialog",{type:Boolean}) private checked!:boolean
    @Inject() private readonly formProvide!:H_Vue
    get closeDialog(){
        return this.checked
    }
    set closeDialog(newValue){}
    public closeMethod(e:any){
        this.$emit('hdialog',e.target.closeDialog)
        const child = this.$children[0].$children[0].$children[0].$children[1] as any
        child.reset()
    }
}
</script>

<style scoped>
.dialog-title{
    text-align: center;
    display: block;
}
.close-btn{
    position: absolute;
    right:10px;
    top:10px;
}
</style>