<template>
  <label v-if="type === 'radio'" class="BaseRadio">
    <input
      :value="value"
      :checked="value === currentSelectedValue"
      :disabled="disabled"
      type="radio"
      @change="change"
    />
    <span class="icon"></span>
    <span class="label">{{ label }}</span>
  </label>
  <BaseButton
    v-else-if="type === 'button'"
    type="secondary"
    size="l-a"
    :is-full-width="true"
    :class="{ active: value === currentSelectedValue }"
    :disabled="disabled"
    @click.native="change(value)"
  >
    {{ label }}
  </BaseButton>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'

export default {
  components: {
    BaseButton,
  },
  props: {
    currentSelectedValue: {
      type: [String, Number],
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'radio',
    },
  },
  methods: {
    change(e) {
      const value =
        this.type === 'radio' ? (e.target as HTMLInputElement).value : e
      this.$emit('update:currentSelectedValue', value)
      this.$emit('update', value)
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
  change(e: Event): void
}

export interface Computed {}

export interface Props {
  currentSelectedValue: string | number
  value: string | number
  label: string
  disabled: Boolean
  type: 'radio' | 'button'
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.BaseRadio {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  width: fit-content;
  user-select: none;

  > input {
    position: absolute;
    height: 0;
    width: 0;
    opacity: 0;

    &:checked + .icon {
      border-color: $secondary-color;

      &:after {
        content: '';
        display: block;
        position: relative;
        left: 3px;
        top: 3px;
        width: 12px;
        height: 12px;
        border-radius: 6px;
        background-color: $secondary-color;
      }
    }

    &:checked:hover:not([disabled]) + .icon {
      border-color: $secondary-hover-color;

      &:after {
        background-color: $secondary-hover-color;
      }
    }

    &:disabled {
      ~ .icon {
        border-color: $input-field-disabled-bg;
        cursor: not-allowed;

        &:after {
          background-color: $input-field-disabled-bg;
        }
      }

      ~ .label {
        color: $gray-quaternary;
        cursor: not-allowed;
      }
    }
  }

  .icon {
    height: 20px;
    width: 20px;
    border: 1px solid $gray-secondary;
    border-radius: 10px;
    margin: 2px;
    transition-duration: 0.3s;
    background-color: transparent;
  }

  .label {
    padding-left: 0.5rem;
    font-size: 0.875rem;
  }

  &:hover input:not([disabled]) {
    ~ .icon {
      border-color: $gray-primary;
    }
  }
}
</style>
