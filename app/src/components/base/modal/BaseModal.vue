<template>
  <transition
    :name="transitionName"
    appear
    @after-enter="$emit('opened')"
    @after-leave="$emit('closed')"
  >
    <div v-show="visible" class="BaseModal" @click.self="handleWrapperClick">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import PopupMixin from '@/mixins/popup/popup-mixin'

export default {
  mixins: [PopupMixin],
  props: {
    transitionName: {
      type: String,
      default: 'BaseModal__fade',
    },
    closeOnClickModal: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      closed: false,
    }
  },
  methods: {
    handleWrapperClick() {
      if (!this.closeOnClickModal) return

      this.$emit('update:visible', false)
      this.$emit('close')
      this.closed = true
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.closed = false
        this.$emit('open')
      } else if (!this.closed) {
        this.$emit('close')
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

export interface Data {
  closed: boolean
}

export type Methods = {
  handleWrapperClick(): void
}

export interface Computed {}

export interface Props {
  transitionName: string
  closeOnClickModal: boolean
}
</script>

<style lang="scss" scoped>
.BaseModal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
}

.BaseModal__fade-enter-active {
  animation: modal-fade 0.3s;
}

.BaseModal__fade-leave-active {
  animation: modal-fade 0.3s reverse;
}

@keyframes modal-fade {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }

  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
</style>
