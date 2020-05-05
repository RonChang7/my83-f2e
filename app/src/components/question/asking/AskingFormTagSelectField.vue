<template>
  <div class="AskingFormSelectField">
    <AskingFormBaseField :title="title" :required="required">
      <BaseTagSelect
        v-for="(tagOption, index) in options"
        :key="index"
        :label="tagOption.label"
        :options="tagOption.options"
        :selected="value"
        :is-expanded="tagOption.isExpanded"
        @update="update"
      />
      <BaseInputMessage v-if="errMsg" :msg="errMsg" />
      <BaseInputMessage v-if="legend && !errMsg" :msg="legend" type="legend" />
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
import BaseTagSelect, {
  Props as BaseTagSelectProps,
} from '@/components/my83-ui-kit/input/BaseTagSelect.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'

const options: ComponentOption = {
  components: {
    AskingFormBaseField,
    BaseTagSelect,
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
    // BaseTagSelect
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
  },
  methods: {
    update(value) {
      this.$emit('update:value', value)
      this.$emit('update', value)
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
  update(value: Props['value']): void
}

export interface Computed {}

export interface Props extends FieldProps {
  legend: string
  errMsg: string
  options: BaseTagSelectProps[]
  value: (string | number)[]
}

export default options
</script>
