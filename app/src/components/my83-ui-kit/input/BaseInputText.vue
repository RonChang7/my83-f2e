<template>
  <div class="BaseInputText">
    <input
      :value="value"
      :type="displayPassword ? 'text' : type"
      :placeholder="placeholder"
      :class="state"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
      :maxlength="maxlength || ''"
      class="BaseInputText__input"
      @input="input"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
      @keyup.enter="$emit('enter')"
    />
    <div
      v-if="type === 'password'"
      class="BaseInputText__showPasswordButton"
      :class="{ displayPassword }"
      @click="displayPassword = !displayPassword"
    >
      <BaseEyeOutline />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseEyeOutline from '@/assets/icon/24/BaseEyeOutline.svg'

export default {
  components: {
    BaseEyeOutline,
  },
  data() {
    return {
      displayPassword: false,
    }
  },
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
    autocomplete: {
      type: String as PropType<Props['autocomplete']>,
      default: 'on',
    },
    maxlength: {
      type: Number,
    },
  },
  methods: {
    input(e) {
      const el = e.target as HTMLInputElement
      this.$emit('update:value', el.value)
      this.$emit('update', el.value)
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
  displayPassword: boolean
}

export type Methods = {
  input(e: Event): void
}

export interface Computed {}

export interface Props {
  value: string
  type: string
  placeholder: string
  state: string
  disabled: boolean
  autofocus: boolean
  autocomplete: 'on' | 'off'
  maxlength: number
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.BaseInputText {
  $self: &;

  &__input {
    @include input;

    &:disabled {
      ~ #{$self}__showPasswordButton {
        display: none;
      }
    }
  }

  &__showPasswordButton {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: -40px;
    left: calc(100% - 40px);
    margin-bottom: -40px;
    width: 40px;
    height: 40px;
    cursor: pointer;

    @include hover('_gray-secondary-darker', $has-svg: true);

    &.displayPassword {
      &::v-deep svg > path {
        fill: $primary-color;
      }
    }
  }
}
</style>
