<template>
  <div class="RelatedSection">
    <div class="RelatedSection__title">{{ title }}</div>
    <div class="RelatedSection__content">
      <GlobalLink
        v-for="(item, index) in filteredRelatedData"
        :key="index"
        :to="item.link.path"
      >
        <RelatedCard
          :index="index + 1"
          :title="item.title"
          :view-count="item.view_count"
          :answer-count="item.answer_count"
          :last="maxPost === index + 1"
        />
      </GlobalLink>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import RelatedCard from './RelatedCard.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { RelatedBlog, RelatedQuestion } from '@/api/question/question.type'

export default {
  components: {
    RelatedCard,
    GlobalLink,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    relatedData: {
      type: Array,
      required: true,
    },
    maxPost: {
      type: Number,
      required: true,
    },
  },
  computed: {
    filteredRelatedData() {
      return this.relatedData.length < this.maxPost
        ? this.relatedData
        : _.slice(this.relatedData, 0, this.maxPost)
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
  filteredRelatedData: Props['relatedData']
}

export interface Props {
  title: string
  relatedData: Array<RelatedBlog | RelatedQuestion>
  maxPost: number
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.RelatedSection {
  @include card-primary;

  margin-bottom: 20px;

  & > * {
    padding: 0 30px;
  }

  &__title {
    display: flex;
    align-items: center;
    color: $gray-primary;
    height: 50px;
    border-bottom: 1px solid $gray-quaternary;
  }

  @include max-media('xl') {
    @include card-secondary;

    margin-bottom: 10px;

    & > * {
      padding: 0 20px;
    }

    &__title {
      color: $gray-secondary;
      font-size: 0.875rem;
      height: 36px;
    }
  }
}
</style>
