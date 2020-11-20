<template>
  <BaseTag
    class="BaseTagOption"
    :class="{ active: selected }"
    @click.native="clickTagHandler(option.value)"
  >
    {{ option.text }}
  </BaseTag>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Option } from '../input/type'
import BaseTag from './BaseTag.vue'

const options: ComponentOption = {
  components: {
    BaseTag,
  },
  props: {
    option: {
      type: Object as PropType<Props['option']>,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    clickTagHandler(value) {
      this.$emit('click-option', {
        isSelected: this.selected,
        value,
      })
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
  clickTagHandler(value: Option['value']): void
}

export interface Computed {}

export interface Props {
  option: Option
  selected: Boolean
}

export default options
</script>

<style lang="scss" scoped>
.BaseTagOption {
  margin-bottom: 8px;

  &:not(:last-child) {
    margin-right: 10px;
  }
}
</style>
