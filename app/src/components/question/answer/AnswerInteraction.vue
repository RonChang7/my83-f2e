<template>
  <div class="AnswerInteraction">
    <AnswerInteractionButton
      v-for="(buttonType, index) in buttonTypes"
      :key="index"
      :type="buttonType"
      :is-selected="likeStatusType === buttonType"
      :count="count(buttonType)"
      @action="actionHandler"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import AnswerInteractionButton, { Type } from './AnswerInteractionButton.vue'
import { LikeStatus } from '@/api/question/question.type'

export default {
  components: {
    AnswerInteractionButton,
  },
  props: {
    likeCount: {
      type: Number,
      default: 0,
    },
    dislikeCount: {
      type: Number,
      default: 0,
    },
    responseCount: {
      type: Number,
      default: 0,
    },
    likeStatus: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      buttonTypes: ['like', 'dislike', 'response'],
    }
  },
  methods: {
    actionHandler(type) {
      this.$emit('action', type)
    },
    count(type) {
      return this[`${type}Count`] || 0
    },
  },
  computed: {
    likeStatusType() {
      switch (this.likeStatus) {
        case 1:
          return 'like'
        case -1:
          return 'dislike'
        case 0:
          return ''
      }
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

export type Methods = {
  actionHandler(type: Type): void
  count(type: Type): number
}

export interface Computed {
  likeStatusType: 'like' | 'dislike' | ''
}

export interface Props {
  likeCount: number
  dislikeCount: number
  responseCount: number
  likeStatus: LikeStatus
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.AnswerInteraction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  margin-top: 16px;
  padding: 0 160px;
  border-top: 1px solid $gray-quaternary;

  @include max-media('xl') {
    height: 40px;
    padding: 0 45px;
    margin-top: 12px;
  }
}
</style>
