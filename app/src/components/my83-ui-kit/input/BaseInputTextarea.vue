<template>
  <div class="BaseInputTextarea">
    <textarea
      ref="textarea"
      :value="value"
      :placeholder="placeholder"
      :class="state"
      :disabled="disabled"
      :autofocus="autofocus"
      :style="{ height: height ? height : '' }"
      class="BaseInputTextarea__input"
      @input="input"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
      @keyup.enter="$emit('enter')"
      @keydown="autoGrowHandler"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    autoGrow: {
      type: Boolean,
      default: false,
    },
    autoGrowMaxHeight: {
      type: Number,
      default: null,
    },
    height: {
      type: String,
      default: null,
    },
  },
  methods: {
    input(e) {
      this.$emit('update:value', (e.target as HTMLInputElement).value)
      this.$emit('update', (e.target as HTMLInputElement).value)
      this.autoGrowHandler()
    },
    autoGrowHandler() {
      if (!this.autoGrow) return

      const el = this.$refs.textarea
      this.$nextTick(() => {
        el.style.cssText = 'height:auto;'
        const textareaHeight =
          this.autoGrowMaxHeight !== null &&
          el.scrollHeight < this.autoGrowMaxHeight
            ? el.scrollHeight
            : this.autoGrowMaxHeight
        el.style.height = textareaHeight + 'px'
      })
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
    textarea: HTMLTextAreaElement
  }
}

export interface Data {}

export interface Methods {
  input(e: Event): void
  autoGrowHandler(): void
}

export interface Computed {}

export interface Props {
  value: string
  type: string
  placeholder: string
  state: string
  disabled: boolean
  autofocus: boolean
  autoGrow: boolean
  autoGrowMaxHeight: number
  height: string
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixins.scss';

.BaseInputTextarea {
  &__input {
    @include input;
    resize: none;
  }
}
</style>
