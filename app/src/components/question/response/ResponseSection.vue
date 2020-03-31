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
        :user-role="userRole"
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
import BaseMeta from '../base/BaseMeta.vue'
import BaseAuthorInfo from '../base/BaseAuthorInfo.vue'
import BaseContent from '../base/BaseContent.vue'
import BaseHeaderFunction from '../base/BaseHeaderFunction.vue'
import { ResponseData } from '@/api/question/question.type'
import { textToUrl, br2nl } from '@/utils/text-parser'
import { UserRole } from '@/services/user/user'

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
    userRole: {
      type: String,
      required: true,
    },
  },
  computed: {
    content() {
      // TODO: 之後 response 後端移除 HTML tag 之後要另外處理
      return textToUrl(br2nl(this.response.content))
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
  content: string
}

export interface Props {
  response: ResponseData
  index: number
  userRole: UserRole
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.ResponseSection {
  padding: 20px 0;

  &.border {
    border-top: 1px solid $gray-quaternary;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;

    @include max-media('xs') {
      flex-direction: column;
    }
  }
}
</style>
