<template>
  <div class="BaseDialog">
    <BaseDialog
      :visible="globalDialogVisible"
      :lockScroll="globalDialogContent.lockScroll"
      :title="globalDialogContent.title"
      :content="globalDialogContent.content"
      :leftButtonText="globalDialogContent.leftButtonText"
      :leftButtonType="globalDialogContent.leftButtonType"
      :rightButtonText="globalDialogContent.rightButtonText"
      :rightButtonType="globalDialogContent.rightButtonType"
      :defaultActionButton="globalDialogContent.defaultActionButton"
      @close="closeDialog"
      @left-confirm="leftConfirm"
      @right-confirm="rightConfirm"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseDialog from '@/components/my83-ui-kit/dialog/BaseDialog.vue'
import { GlobalDialogContent } from '@/store/global'
import * as types from '@/store/global/global.type'

export default {
  components: {
    BaseDialog,
  },
  computed: {
    ...mapState('global', ['globalDialogVisible', 'globalDialogContent']),
  },
  methods: {
    closeDialog() {
      this.$store.dispatch(`global/${types.CLOSE_GLOBAL_DIALOG}`)

      if (typeof this.globalDialogContent.closeFn === 'function') {
        this.globalDialogContent.closeFn()
      }
    },
    leftConfirm() {
      if (typeof this.globalDialogContent.leftConfirmFn === 'function') {
        this.globalDialogContent.leftConfirmFn()
      }

      this.closeDialog()
    },
    rightConfirm() {
      if (typeof this.globalDialogContent.rightConfirmFn === 'function') {
        this.globalDialogContent.rightConfirmFn()
      }

      this.closeDialog()
    },
  },
} as ComponentOption

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export type ComponentInstance = CombinedVueInstance<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export interface Instance extends Vue {}

export interface Data {}

export interface Methods {
  closeDialog: () => void
  leftConfirm: () => void
  rightConfirm: () => void
}

export interface Computed {
  globalDialogVisible: boolean
  globalDialogContent: GlobalDialogContent
}

export interface Props {}
</script>
