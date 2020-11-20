<template>
  <div v-if="relatedBlogs.length" class="RelatedBlogSection">
    <RelatedSection
      :related-data="relatedBlogs"
      :max-post="maxPost"
      :title="title"
    />
    <div class="RelatedBlogSection__footer">
      <GlobalLink to="/blogs">
        看更多專欄文章
        <BaseArrowRight />
      </GlobalLink>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import RelatedSection from '@/components/base/related/RelatedSection.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseArrowRight from '@/components/base/icon/18/BaseArrowRight.vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { RelatedBlog } from '@/api/type'

const options: ComponentOption = {
  components: {
    RelatedSection,
    GlobalLink,
    BaseArrowRight,
  },
  props: {
    maxPost: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    title() {
      return `${this.$store.state.insurance.staticData.abbr}相關文章`
    },
    relatedBlogs() {
      return this.$store.state.insurance.relatedBlogs || []
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

export interface Instance extends Vue {
  $store: Store<InsuranceVuexState>
}

export interface Data {}

export type Methods = {}

export interface Computed {
  title: string
  relatedBlogs: RelatedBlog[]
}

export interface Props {
  maxPost: number
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.RelatedBlogSection {
  @include max-media('xl') {
    margin-top: 20px;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 0.875rem;
    margin: 0 0px 20px;
    margin-top: -10px;

    @include max-media('xl') {
      margin: 0 16px 20px 0;
    }

    > a {
      margin-right: 4px;

      @include hover('_gray-secondary-darker', $has-svg: true);
    }
  }
}
</style>
