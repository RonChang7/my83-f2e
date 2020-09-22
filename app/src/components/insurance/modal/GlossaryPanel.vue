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
@import '@/sass/mixins.scss';

.GlossaryPanel {
  width: 100%;
  padding: 40px 44px 0;

  ::v-deep em {
    @include emphasize;
  }

  &__row {
    display: flex;

    &:not(:last-child) {
      margin-bottom: 40px;
    }
  }

  &__term {
    display: flex;
    justify-content: center;
    align-self: flex-start;
    flex: 0 0 160px;
    padding: 12px 44px;
    background: $secondary-bright-color;
    border-radius: 30px;
    margin-right: 30px;
    color: $secondary-color;
    font-weight: 500;

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
      left: 54px;
    }
  }

  &__definition {
  }

  &__recommendBlog {
    font-weight: 500;
  }
}
</style>
