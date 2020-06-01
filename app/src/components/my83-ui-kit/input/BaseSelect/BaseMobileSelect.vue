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
      <option value="" disabled :selected="isPlaceholder" hidden>
        {{ placeholder }}
      </option>
      <template v-if="options.length">
        <option
          v-for="(option, index) in options"
          :key="index"
          :value="option.value"
          :selected="value === option.value"
        >
          {{ option.text }}
        </option>
      </template>
    </select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Props as BaseSelectProps } from '../BaseSelect.vue'

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
      const value =
        this.valueType === 'number'
          ? parseInt((e.target as HTMLInputElement).value)
          : (e.target as HTMLInputElement).value
      this.$emit('update:value', value)
      this.$emit('input', value)
    },
  },
  mounted() {
    this.valueType = typeof this.value
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
  valueType: string
}

export interface Data {}

export interface Methods {
  input(e: Event): void
}

export interface Computed {
  isPlaceholder: boolean
}

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
