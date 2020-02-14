<template>
  <div class="AnswerInteraction">
    <AnswerInteractionButton
      v-for="(buttonType, index) in buttonTypes"
      :key="index"
      :type="buttonType"
      @action="actionHandler"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import AnswerInteractionButton, { Type } from './AnswerInteractionButton.vue'

export default {
  components: {
    AnswerInteractionButton,
  },
  data() {
    return {
      buttonTypes: ['like', 'unlike', 'response'],
    }
  },
  methods: {
    actionHandler(type) {
      this.$emit('action', type)
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
  buttonTypes: Type[]
}

export interface Methods {
  actionHandler: (type: Type) => void
}

export interface Computed {}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.AnswerInteraction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  margin-top: 16px;
  padding: 0 160px;
  border-top: 1px solid $gray-quaternary;
}
</style>
