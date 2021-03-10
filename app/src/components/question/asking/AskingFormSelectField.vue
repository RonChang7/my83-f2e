<template>
  <div class="AskingFormSelectField">
    <AskingFormBaseField :title="title" :required="required">
      <BaseSelect
        :value="value"
        :options="options"
        :placeholder="placeholder"
        :state="errMsg ? 'error' : state"
        :disabled="disabled"
        @input="input"
      />
      <BaseInputMessage v-if="legend" :msg="legend" type="legend" />
      <BaseInputMessage v-if="errMsg" :msg="errMsg" />
    </AskingFormBaseField>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseSelect, {
  Props as BaseSelectProps,
} from '@/components/my83-ui-kit/input/BaseSelect.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'
import AskingFormBaseField, {
  Props as FieldProps,
} from './AskingFormBaseField.vue'

const options: ComponentOption = {
  components: {
    AskingFormBaseField,
    BaseSelect,
    BaseInputMessage,
  },
  props: {
    legend: {
      type: String,
      default: '',
    },
    errMsg: {
      type: String,
      default: '',
    },
    // AskingFormBaseField
    title: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    // BaseSelect
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
    hideIcon: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    input(value) {
      this.$emit('update:value', value)
      this.$emit('input', value)
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

export interface Instance extends Vue {}

export interface Data {}

export type Methods = {
  input(value: string): void
}

export interface Computed {}

export interface Props extends FieldProps, BaseSelectProps {
  legend: string
  errMsg: string
}

export default options
</script>
