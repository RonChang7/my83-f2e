<template>
  <BaseModal :visible="visible" :lock-scroll="lockScroll" @close="closePanel">
    <div
      ref="dialog"
      tabindex="0"
      class="BaseDialog"
      :class="{
        singleButton: !rightButtonText,
        doubleButton: rightButtonText,
      }"
      @keyup.esc="closePanel"
      @keyup.enter="enterToConfirm"
    >
      <BaseClose class="BaseDialog__close" @click.native="closePanel" />
      <div v-if="title" class="BaseDialog__title">{{ title }}</div>
      <div v-if="content" class="BaseDialog__content">{{ content }}</div>
      <div class="BaseDialog__action">
        <BaseButton
          :is-full-width="true"
          :type="leftButtonType"
          size="l-a"
          @click.native="$emit('left-confirm')"
        >
          {{ leftButtonText }}
        </BaseButton>
        <BaseButton
          v-if="rightButtonText"
          :is-full-width="true"
          :type="rightButtonType"
          size="l-a"
          @click.native="$emit('right-confirm')"
        >
          {{ rightButtonText }}
        </BaseButton>
      </div>
      <BaseInputMessage :msg="errMsg" text-align="center" />
    </div>
  </BaseModal>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseModal from '@/components/base/modal/BaseModal.vue'
import BaseClose from '@/components/base/icon/24/BaseClose.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'

export default {
  components: {
    BaseModal,
    BaseClose,
    BaseButton,
    BaseInputMessage,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    lockScroll: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    leftButtonText: {
      type: String,
      required: true,
    },
    leftButtonType: {
      type: String,
      default: 'secondary',
    },
    rightButtonText: {
      type: String,
      default: '',
    },
    rightButtonType: {
      type: String,
      default: 'primary',
    },
    defaultActionButton: {
      type: String,
      default: 'right',
    },
    errMsg: {
      type: String,
      default: '',
    },
  },
  methods: {
    closePanel() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    enterToConfirm() {
      switch (this.defaultActionButton) {
        case 'left':
          this.$emit('left-confirm')
          break
        case 'right':
          this.$emit('right-confirm')
          break
        default:
          break
      }
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.dialog.focus()
          })
        }
      },
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

export interface Instance extends Vue {
  $refs: {
    dialog: HTMLElement
  }
}

export interface Data {}

export interface Methods {
  closePanel(): void
  enterToConfirm(): void
}

export interface Computed {}

export interface Props {
  visible: boolean
  lockScroll: boolean
  title: string
  content: string
  leftButtonText: string
  leftButtonType: string
  rightButtonText: string
  rightButtonType: string
  defaultActionButton: 'left' | 'right' | ''
  errMsg: string
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';
@import '@/sass/mixins.scss';

.BaseDialog {
  @include card-primary;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 40px 40px 30px;
  color: $gray-primary;
  outline: 0;
  overflow: auto;

  &.singleButton {
    width: 410px;
  }

  &.doubleButton {
    width: 480px;
  }

  @include max-media('lg') {
    &.singleButton,
    &.doubleButton {
      width: calc(100vw - 24px);
      padding: 45px 30px 30px;
    }
  }

  &__close {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
  }

  &__title {
    font-size: 1.375rem;
    font-weight: 500;
    line-height: 1.36;
    text-align: center;
  }

  &__content {
    font-weight: 400;
    margin-top: 20px;
    text-align: center;
  }

  &__action {
    display: flex;
    width: 100%;
    margin-top: 30px;

    &::v-deep > [type='button']:not(:first-child) {
      margin-left: 15px;
    }
  }
}
</style>
