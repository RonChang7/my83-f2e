<template>
  <BaseModal :visible="visible" :lock-scroll="lockScroll" @close="closePanel">
    <div ref="info" class="BaseInfoModal" tabindex="0" @keyup.esc="closePanel">
      <div class="BaseInfoModal__close">
        <BaseClose @click.native="closePanel" />
      </div>
      <slot></slot>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseModal from '@/components/base/modal/BaseModal.vue'
import BaseClose from '@/assets/icon/24/BaseClose.svg'

const options: ComponentOption = {
  components: {
    BaseModal,
    BaseClose,
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
  },
  methods: {
    closePanel() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.info.focus()
          })
        }
      },
    },
  },
}

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
    info: HTMLElement
  }
}

export interface Data {}

export type Methods = {
  closePanel(): void
}

export interface Computed {}

export interface Props {
  visible: boolean
  lockScroll: boolean
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';
@import '@/sass/mixins.scss';

.BaseInfoModal {
  @include card-primary;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 39px 15px 15px;
  color: $gray-primary;
  outline: 0;
  overflow: auto;

  @include min-media('lg') {
    max-height: 90vh;
  }

  @include max-media('lg') {
    width: calc(100% - 24px);
    height: calc(100% - 20px);
    overflow: hidden;
  }

  &__close {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
    z-index: 1;

    @include hover('_gray-secondary-darker', $has-svg: true);
  }
}
</style>
