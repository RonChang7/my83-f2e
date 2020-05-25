<template>
  <div class="BaseTagOptions">
    <BaseTag
      v-for="option in options"
      :key="option.value"
      class="tag"
      :class="{ active: isSelected(option.value) }"
      @click.native="clickTagHandler(option.value)"
    >
      {{ option.text }}
    </BaseTag>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Option } from '../input/BaseSelect.vue'
import BaseTag from './BaseTag.vue'

const options: ComponentOption = {
  components: {
    BaseTag,
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
    selected: {
      type: Array,
      required: true,
    },
  },
  methods: {
    isSelected(value) {
      return _.includes(this.selected, value)
    },
    clickTagHandler(value) {
      this.$emit('click-option', {
        isSelected: this.isSelected(value),
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

export interface Methods {
  isSelected(value: Option['value']): boolean
  clickTagHandler(value: Option['value']): void
}

export interface Computed {}

export interface Props {
  options: Option[]
  selected: (string | number)[]
}

export default options
</script>

<style lang="scss" scoped>
.BaseTagOptions {
  padding: 5px 0;

  .tag {
    margin-bottom: 8px;

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>
