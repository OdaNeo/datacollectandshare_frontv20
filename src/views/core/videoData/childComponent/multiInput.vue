<template>
  <v-col cols="12" class="HMultiInput d-flex">
    <label class="label mr-2"><span v-if="required" class="require-span">*</span>{{ description }}</label>
    <div class="ml-4 mr-13 d-flex justify-space-between">
      <v-row v-for="item in formProvide.formObj.videoKeyword" :key="item.id" no-gutters>
        <v-col class="mr-2">
          <v-text-field v-model="item.keyword" dense outlined height="35"></v-text-field>
        </v-col>
      </v-row>
    </div>
  </v-col>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator'
import { H_Vue } from '@/declaration/vue-prototype'
import { mdiCloseCircleOutline } from '@mdi/js'

@Component({})
export default class HMultiInput extends Vue {
  @Inject() private readonly formProvide!: H_Vue
  @Prop() private description!: string
  @Prop({ default: true }) private required!: boolean

  private mdiCloseCircleOutline = mdiCloseCircleOutline
}
</script>
