<template>
  <div class="PrinciplePanel">
    <div v-for="rule in rules" :key="rule.title" class="PrinciplePanel__row">
      <div class="PrinciplePanel__title">
        {{ rule.title }}
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="PrinciplePanel__content" v-html="rule.content" />
    </div>
    <div v-if="recommendBlogs" class="PrinciplePanel__row blog">
      <span>推薦閱讀：</span>
      <div>
        <div
          v-for="blog in recommendBlogs"
          :key="blog.title"
          class="PrinciplePanel__recommendBlog"
        >
          <GlobalLink :to="blog.link">{{ blog.title }}</GlobalLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Principle } from '@/api/insurance/insurance.type'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'

const options: ComponentOption = {
  components: {
    GlobalLink,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    rules() {
      return this.data?.rules
    },
    recommendBlogs() {
      return this.data?.recommend_blogs
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

export type Methods = {}

export interface Computed {
  rules: Principle['rules'] | undefined
  recommendBlogs: Principle['recommend_blogs'] | undefined
}

export interface Props {
  data: Principle | null
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/elements.scss';
@import '@/sass/rwd.scss';

.PrinciplePanel {
  width: 100%;
  padding: 40px 44px 0;
  @include counter-list-type-reset;

  @include max-media('xl') {
    padding: 20px 0;
    font-size: 0.875rem;
  }

  ::v-deep em {
    @include emphasize;
  }

  &__row {
    &:not(:last-child) {
      margin-bottom: 40px;
    }

    @include max-media('xl') {
      &:not(:last-child) {
        margin-bottom: 24px;
      }

      &:last-of-type {
        padding-top: 20px;
      }
    }

    &.blog {
      display: flex;

      @include max-media('xl') {
        flex-direction: column;
      }
    }
  }

  &__title {
    display: flex;
    align-items: center;
    font-size: 1.375rem;
    font-weight: 500;

    @include max-media('xl') {
      font-size: 1.125rem;
    }

    &:before {
      @include counter-list-type($prefix: '原則 ');
      font-size: 1rem;
      margin-right: 10px;

      @include max-media('xl') {
        font-size: 0.875rem;
        margin-right: 8px;
      }
    }
  }

  &__content {
    padding: 16px 0 0 16px;

    @include max-media('xl') {
      padding: 6px 0 0 6px;
    }
  }

  &__recommendBlog {
    font-weight: 500;
  }
}
</style>
