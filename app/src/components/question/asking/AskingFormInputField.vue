<template>
  <div class="AskingFormInputField">
    <AskingFormBaseField :title="title" :required="required">
      <BaseInputText
        :value="value"
        :type="type"
        :placeholder="placeholder"
        :state="errMsg ? 'error' : state"
        :disabled="disabled"
        :autofocus="autofocus"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
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
import BaseInputText, {
  Props as BaseInputTextProps,
} from '@/components/my83-ui-kit/input/BaseInputText.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'
import AskingFormBaseField, {
  Props as FieldProps,
} from './AskingFormBaseField.vue'

const options: ComponentOption = {
  components: {
    AskingFormBaseField,
    BaseInputText,
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
    // BaseInputText
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
      type: String as () => Props['autocomplete'],
      default: 'on',
    },
    maxlength: {
      type: Number,
      default: -1,
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

export type Methods = {
  update(value: string): void
}

export interface Computed {}

export interface Props extends FieldProps, BaseInputTextProps {
  legend: string
  errMsg: string
}

export default options
</script>
