<template>
  <div
    v-if="options.length"
    class="QuestionDropdownPanel"
    tabindex="-1"
    @blur="$emit('blur')"
  >
    <BaseDropdownOption
      v-for="(option, index) in options"
      :key="index"
      :text="option.title"
      @click="option.action"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseDropdownOption from '../base/BaseDropdownOption.vue'
import { State, DropdownMenu } from '@/store/question/index'

export default {
  components: {
    BaseDropdownOption,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    options() {
      const { dropdownMenu } = this.$store.state.question as State
      return dropdownMenu.options ? dropdownMenu.options : []
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        if (val) {
          if (process.server) return

          this.$nextTick(() => {
            ;(this.$el as HTMLElement).focus()
          })
        }
      },
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

export interface Data {}

export interface Methods {}

export interface Computed {
  options: Pick<DropdownMenu, 'options'>
}

export interface Props {
  visible: boolean
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.QuestionDropdownPanel {
  @include card-primary;

  position: absolute;
  width: 140px;
  padding: 12px 0;

  &:focus {
    outline: 0;
  }
}
</style>
