<template>
  <div class="AskingFormTagSelectField">
    <AskingFormBaseField :title="title" :required="required">
      <BaseInputMessage v-if="legend && !errMsg" :msg="legend" type="legend" />
      <BaseTagSelect
        v-for="(tagOption, index) in options"
        :key="index"
        class="AskingFormTagSelectField__panel"
        :class="{ first: index === 0 }"
        :label="tagOption.label"
        :options="tagOption.options"
        :selected="value"
        :enable-fold="tagOption.enableFold"
        :is-expanded.sync="panelExpandState[index]"
        @update="update"
      />
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
  data() {
    return {
      panelExpandState: [],
    }
  },
  methods: {
    update(value) {
      this.$emit('update:value', value)
      this.$emit('input', value)
    },
  },
  watch: {
    options: {
      immediate: true,
      handler(val: Props['options']) {
        if (val.length) {
          this.panelExpandState = val.map((option) => option.isExpanded)
        }
      },
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

export interface Data {
  panelExpandState: boolean[]
}

export interface Methods {
  update(value: Props['value']): void
}

export interface Computed {}

export interface Props extends FieldProps {
  legend: string
  errMsg: string
  options: Omit<BaseTagSelectProps, 'selected'>[]
  value: (string | number)[]
}

export default options
</script>
<style lang="scss" scoped>
@import '@/sass/variables.scss';

.AskingFormTagSelectField {
  &__panel {
    border-bottom: 1px solid $gray-quaternary;

    &.first {
      border-top: 1px solid $gray-quaternary;
      margin-top: 12px;
    }
  }
}
</style>
