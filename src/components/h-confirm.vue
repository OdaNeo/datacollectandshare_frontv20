<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">确定删除么？</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" text @click="$emit('hcancel')">取消</v-btn>
          <v-btn color="green darken-1" text @click="$emit('hconfirm')">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class HConfirm extends Vue {
  private dialog = true
}
</script>
