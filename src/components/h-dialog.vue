<template>
  <v-dialog v-model="closeDialog" max-width="750px" persistent>
    <v-card>
      <v-card-title class="dialog-title">
        <p class="mb-0">{{ formProvide.title }}</p>
        <v-btn icon class="close-btn" @click="closeMethod($event)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <h-form ref="hform" @cancel="closeMethod" @validate="closeMethod">
            <slot name="dialog-content" slot="dialog-form-content"></slot>
          </h-form>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Model, Inject } from 'vue-property-decorator'
import HForm from './h-form.vue'
import { H_Vue } from '../declaration/vue-prototype'
@Component({
  components: {
    HForm
  }
})
export default class HDialog extends Vue {
  @Prop() private title!: string
  @Model('hdialog', { type: Boolean }) private checked!: boolean
  @Inject() private readonly formProvide!: H_Vue
  get closeDialog(): boolean {
    return this.checked
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set closeDialog(val: boolean) {}

  public closeMethod(): void {
    this.$emit('hdialog')
    const child = this.$refs.hform as HForm
    child.reset(false)
  }
}
</script>

<style scoped>
.dialog-title {
  text-align: center;
  display: block;
}
.close-btn {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
