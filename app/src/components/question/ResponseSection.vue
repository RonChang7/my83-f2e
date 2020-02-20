<template>
  <div
    :id="`response-${response.response_id}`"
    :class="{ border: index > 0 }"
    class="ResponseSection"
  >
    <div class="ResponseSection__header">
      <BaseAuthorInfo :author-info="response.author_info" />
      <BaseHeaderFunction
        section-type="response"
        :section-id="response.response_id"
        :author-info="response.author_info"
      />
    </div>
    <BaseContent :content="content" />
    <BaseMeta :created-at="response.created_at" meta-type="response" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseMeta from './base/BaseMeta.vue'
import BaseAuthorInfo from './base/BaseAuthorInfo.vue'
import BaseContent from './base/BaseContent.vue'
import BaseHeaderFunction from './base/BaseHeaderFunction.vue'
import { ResponseData } from '@/api/question/question.type'
import { textToUrl } from '@/utils/text-parser'

export default {
  components: {
    BaseMeta,
    BaseAuthorInfo,
    BaseContent,
    BaseHeaderFunction,
  },
  props: {
    response: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    content() {
      return textToUrl(this.response.content)
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

export interface Computed {}

export interface Props {
  response: ResponseData
  index: number
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.ResponseSection {
  padding: 12px 0;

  &.border {
    border-top: 1px solid $gray-quaternary;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }
}
</style>
