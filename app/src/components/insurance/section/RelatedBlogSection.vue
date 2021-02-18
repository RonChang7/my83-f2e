<template>
  <div v-if="relatedBlogs.length" class="RelatedBlogSection">
    <RelatedSection
      :related-data="relatedBlogs"
      :max-post="maxPost"
      :title="title"
      @click-link="(index) => $emit('tracking', relatedBlogs[index].link.path)"
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
import { computed, defineComponent } from '@nuxtjs/composition-api'
import RelatedSection from '@/components/base/related/RelatedSection.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseArrowRight from '@/assets/icon/18/BaseArrowRight.svg'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { useStore } from '@/utils/composition-api'

export default defineComponent({
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
  setup() {
    const store = useStore<InsuranceVuexState>()
    const title = computed(
      () => `${store.state.insurance.staticData.abbr}相關文章`
    )
    const relatedBlogs = computed(
      () => store.state.insurance.relatedBlogs || []
    )

    return {
      title,
      relatedBlogs,
    }
  },
})
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
