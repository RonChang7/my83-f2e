<template>
  <div class="BaseTagSelect">
    <div
      class="BaseTagSelect__header"
      :class="{ enableFold }"
      @click="clickHeaderHandler"
    >
      <div v-if="label" class="BaseTagSelect__label">
        {{ label }}
      </div>
      <div v-if="enableFold" class="BaseTagSelect__expandIndicator">
        <BaseArrowUp v-if="isExpanded" />
        <BaseArrowDown v-else />
      </div>
    </div>
    <div v-if="shouldDisplayOptions" class="BaseTagSelect__options">
      <template v-for="option in options">
        <BaseTagOption
          v-if="option.text"
          :key="option.value"
          :option="option"
          :selected="isSelected(option.value)"
          @click-option="clickOptionHandler"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseTagOption from '../tag/BaseTagOption.vue'
import { Option } from './BaseSelect.vue'
const BaseArrowDown = () =>
  import('@/components/base/icon/18/BaseArrowDown.vue')
const BaseArrowUp = () => import('@/components/base/icon/18/BaseArrowUp.vue')

const options: ComponentOption = {
  components: {
    BaseTagOption,
    BaseArrowDown,
    BaseArrowUp,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      required: true,
    },
    selected: {
      type: Array,
      required: true,
    },
    enableFold: {
      type: Boolean,
      required: true,
    },
    isExpanded: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    isSelected(value) {
      return _.includes(this.selected, value)
    },
    clickOptionHandler({ isSelected, value }) {
      const selected = isSelected
        ? _.without(this.selected, value)
        : this.selected.concat(value)

      this.$emit('update:selected', selected)
      this.$emit('update', selected)
    },
    clickHeaderHandler() {
      if (!this.enableFold) return
      this.$emit('update:isExpanded', !this.isExpanded)
      this.$emit('update-expand', !this.isExpanded)
    },
  },
  computed: {
    shouldDisplayOptions() {
      return !this.enableFold || (this.enableFold && this.isExpanded)
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
  clickOptionHandler(payload: {
    isSelected: boolean
    value: Option['value']
  }): void
  clickHeaderHandler(): void
}

export interface Computed {
  shouldDisplayOptions: boolean
}

export interface Props {
  label: string
  options: Option[]
  selected: (string | number)[]
  enableFold: boolean
  isExpanded: boolean
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.BaseTagSelect {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.enableFold {
      user-select: none;
      cursor: pointer;
    }
  }

  &__label {
    color: $gray-primary;
    margin: 8px 0;
  }

  &__options {
    padding: 5px 0;
  }
}
</style>
