<template>
  <div class="QuestionTags">
    <!-- @todo: 缺 icon -->
    <!-- eslint-disable-next-line vue/require-component-is -->
    <component v-if="iconType.length" :is="iconType" />
    <template v-for="tag in tags">
      <GlobalLink :key="tag.id" :to="tag.link.path">
        <QuestionTag :text="tag.name" />
      </GlobalLink>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import QuestionTag from './QuestionTag.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'

export default {
  components: {
    GlobalLink,
    QuestionTag,
  },
  props: {
    iconType: {
      type: String,
      default: '',
    },
    tags: {
      type: Array,
      required: true,
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
  iconType: 'tag' | 'company' | ''
  tags: string[]
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.QuestionTags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 8px;

  a::v-deep {
    &:not(:last-child):after {
      content: '|';
      display: inline-block;
      margin: 0 6px;
      color: $secondary-color;
      font-size: 0.875rem;
      font-weight: 500;
    }
  }
}
</style>
