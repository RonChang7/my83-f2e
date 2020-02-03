<template>
  <label class="BaseCheckbox">
    <input
      :checked="checked"
      :disabled="disabled"
      @change="update"
      type="checkbox"
    />
    <span class="icon"></span>
    <span class="label">{{ label }}</span>
  </label>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

export default {
  props: {
    checked: {
      type: Boolean,
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
  },
  methods: {
    update(e) {
      this.$emit('update:checked', (e.target as HTMLInputElement).checked)
      this.$emit('update', (e.target as HTMLInputElement).checked)
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
  update: (e: Event) => void
}

export interface Computed {}

export interface Props {
  checked: boolean
  label: string
  disabled: Boolean
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.BaseCheckbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  width: fit-content;

  > input {
    position: absolute;
    height: 0;
    width: 0;
    opacity: 0;

    &:checked {
      + .icon {
        background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxMCIgdmlld0JveD0iMCAwIDE0IDEwIj4KICAgIDxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTUgMTBMMCA1LjIwMmwxLjQxLTEuMzU0TDUgNy4yODQgMTIuNTkgMCAxNCAxLjM2M3oiLz4KPC9zdmc+Cg==')
          no-repeat center center;
        border-color: $secondary-color;
        background-color: $secondary-color;
      }

      &:hover:not([disabled]) + .icon {
        border-color: $secondary-hover-color;
        background-color: $secondary-hover-color;
      }

      &:disabled + .icon {
        background-color: $input-field-disabled-bg;
      }
    }

    &:disabled {
      ~ .icon {
        border-color: $input-field-disabled-bg;
        cursor: not-allowed;
      }

      ~ .label {
        color: $gray-quaternary;
        cursor: not-allowed;
      }
    }
  }

  .icon {
    height: 18px;
    width: 18px;
    border: 2px solid $gray-secondary;
    border-radius: $border-radius;
    margin: 3px;
    transition: background-color 0.3s;
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
