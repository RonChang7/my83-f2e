<template>
  <div class="BaseInputText">
    <input
      :value="value"
      :type="displayPassword ? 'text' : type"
      :placeholder="placeholder"
      :class="state"
      :disabled="disabled"
      :autocomplete="autocomplete"
      class="BaseInputText__input"
      @input="update"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
      @keyup.enter="$emit('enter')"
    />
    <div
      v-if="type === 'password'"
      class="BaseInputText__showPasswordButton"
      @click="displayPassword = !displayPassword"
    >
      <BaseEyeFill v-if="displayPassword" />
      <BaseEyeOutline v-else />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseEyeOutline from '@/components/base/icon/24/BaseEyeOutline.vue'
import BaseEyeFill from '@/components/base/icon/24/BaseEyeFill.vue'

export default {
  components: {
    BaseEyeOutline,
    BaseEyeFill,
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
    autocomplete: {
      type: String,
      default: 'on',
    },
  },
  methods: {
    update(e) {
      this.$emit('update:value', (e.target as HTMLInputElement).value)
      this.$emit('update', (e.target as HTMLInputElement).value)
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

export interface Methods {
  update: (e: Event) => void
}

export interface Computed {}

export interface Props {
  value: string
  type: string
  placeholder: string
  state: string
  disabled: boolean
  autocomplete: 'on' | 'off'
}
</script>

<style lang="scss" scoped>
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
    justify-content: flex-end;
    margin-top: -32px;
    padding: 0 12px 8px 0;
    cursor: pointer;
  }

  &__message {
    margin-top: 8px;
    color: $error-color;
    font-size: 0.875rem;
    font-weight: 400;
  }
}
</style>
