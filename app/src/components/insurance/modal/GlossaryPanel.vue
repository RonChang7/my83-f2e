<template>
  <div v-if="data" class="GlossaryPanel">
    <template v-if="terms">
      <div v-for="term in terms" :key="term.term" class="GlossaryPanel__row">
        <div class="GlossaryPanel__term">
          <div>{{ term.term }}</div>
        </div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="GlossaryPanel__definition" v-html="term.definition" />
      </div>
    </template>
    <div v-if="recommendBlogs" class="GlossaryPanel__row">
      <span>推薦閱讀：</span>
      <div>
        <div
          v-for="blog in recommendBlogs"
          :key="blog.title"
          class="GlossaryPanel__recommendBlog"
        >
          <GlobalLink :to="blog.link" target="_blank">
            {{ blog.title }}
          </GlobalLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Glossary } from '@/api/insurance/insurance.type'
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
    terms() {
      return this.data?.terms
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
  terms: Glossary['terms'] | undefined
  recommendBlogs: Glossary['recommend_blogs'] | undefined
}

export interface Props {
  data: Glossary | null
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/elements.scss';
@import '@/sass/rwd.scss';

.GlossaryPanel {
  width: 100%;
  padding: 40px 44px 0;

  @include max-media('xl') {
    padding: 20px 0 10px;
    font-size: 0.875rem;
  }

  ::v-deep em {
    @include emphasize;
  }

  &__row {
    display: flex;

    &:not(:last-child) {
      margin-bottom: 40px;
    }

    @include max-media('xl') {
      flex-direction: column;

      &:not(:last-child) {
        margin-bottom: 20px;
      }

      &:last-of-type {
        padding-top: 20px;
      }
    }
  }

  &__term {
    display: flex;
    justify-content: center;
    align-self: flex-start;
    flex: 0 0 160px;
    padding: 12px 15px;
    background: $secondary-bright-color;
    border-radius: 30px;
    margin-right: 30px;
    color: $secondary-color;
    font-weight: 500;
    font-size: 1rem;

    @include max-media('xl') {
      flex: 0 0 auto;
      width: 100%;
      margin-right: 0;
      margin-bottom: 16px;
    }

    > div {
      width: 100%;
      text-align: center;
    }

    &:after {
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 6px 0 6px 12px;
      border-color: transparent transparent transparent $secondary-bright-color;
      position: relative;
      margin-left: -12px;
      top: 6px;
      left: 25px;

      @include max-media('xl') {
        border-width: 12px 6px 0 6px;
        border-color: $secondary-bright-color transparent transparent
          transparent;
        left: calc((-100vw + 57px * 2 + 6px) / 2);
        top: 35px;
      }
    }
  }

  &__definition {
    display: inline-block;
    margin: auto 0;
  }

  &__recommendBlog {
    font-weight: 500;
  }
}
</style>
