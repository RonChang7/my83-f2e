<template>
  <div class="BaseDialog">
    <BaseDialog
      :visible="globalDialogVisible"
      :lock-scroll="globalDialogContent.lockScroll"
      :title="globalDialogContent.title"
      :content="globalDialogContent.content"
      :left-button-text="globalDialogContent.leftButtonText"
      :left-button-type="globalDialogContent.leftButtonType"
      :right-button-text="globalDialogContent.rightButtonText"
      :right-button-type="globalDialogContent.rightButtonType"
      :default-action-button="globalDialogContent.defaultActionButton"
      :check-before-action="globalDialogContent.checkBeforeAction"
      :check-before-action-text="globalDialogContent.checkBeforeActionText"
      :check-before-action-err-msg="globalDialogContent.checkBeforeActionErrMsg"
      :err-msg="globalDialogContent.errMsg"
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

      if (
        typeof this.globalDialogContent.leftButtonCloseDialogAfterClick ===
          'undefined' ||
        this.globalDialogContent.leftButtonCloseDialogAfterClick === true
      ) {
        this.closeDialog()
      }
    },
    rightConfirm() {
      if (typeof this.globalDialogContent.rightConfirmFn === 'function') {
        this.globalDialogContent.rightConfirmFn()
      }

      if (
        typeof this.globalDialogContent.rightButtonCloseDialogAfterClick ===
          'undefined' ||
        this.globalDialogContent.rightButtonCloseDialogAfterClick === true
      ) {
        this.closeDialog()
      }
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

export type Methods = {
  closeDialog(): void
  leftConfirm(): void
  rightConfirm(): void
}

export interface Computed {
  globalDialogVisible: boolean
  globalDialogContent: GlobalDialogContent
}

export interface Props {}
</script>
