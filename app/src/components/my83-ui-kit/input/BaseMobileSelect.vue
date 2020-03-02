<template>
  <div class="BaseMobileSelect">
    <select
      :class="{
        state,
        placeholder: isPlaceholder,
      }"
      :disabled="disabled"
      @input="input"
    >
      <option value="" disabled selected hidden>{{ placeholder }}</option>
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
        :select="value === option.value"
      >
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import {
  Props as BaseSelectProps,
  Methods as BaseSelectMethods,
} from './BaseSelect.vue'

export default {
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: '請選擇',
    },
    state: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isPlaceholder() {
      return !this.options.find((option) => option.value === this.value)
    },
  },
  methods: {
    input(e) {
      this.$emit('update:value', (e.target as HTMLInputElement).value)
      this.$emit('input', (e.target as HTMLInputElement).value)
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

export interface Methods extends BaseSelectMethods {}

export interface Computed {}

export interface Props extends BaseSelectProps {}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.BaseMobileSelect {
  select {
    @include select;
    appearance: none;

    &::-ms-expand {
      display: none; /* Hide the default arrow in Internet Explorer 10 and Internet Explorer 11 */
    }
  }
}
</style>
