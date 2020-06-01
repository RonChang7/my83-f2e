<template>
  <div class="AskingFormTextareaField">
    <AskingFormBaseField :title="title" :required="required">
      <BaseInputTextarea
        :value="value"
        :type="type"
        :placeholder="placeholder"
        :state="errMsg ? 'error' : state"
        :disabled="disabled"
        :auto-grow="autoGrow"
        :auto-grow-max-height="autoGrowMaxHeight"
        :height="height"
        @update="update"
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
import AskingFormBaseField, {
  Props as FieldProps,
} from './AskingFormBaseField.vue'
import BaseInputTextarea, {
  Props as BaseInputTextareaProps,
} from '@/components/my83-ui-kit/input/BaseInputTextarea.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'

const options: ComponentOption = {
  components: {
    AskingFormBaseField,
    BaseInputTextarea,
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
    // BaseInputTextarea
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
    update(value) {
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

export interface Methods {
  update(value: string): void
}

export interface Computed {}

export interface Props extends FieldProps, BaseInputTextareaProps {
  legend: string
  errMsg: string
}

export default options
</script>
