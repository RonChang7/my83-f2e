<template>
  <div v-if="relatedBlogs.length" class="RelatedBlogSection">
    <RelatedSection
      :related-data="relatedBlogs"
      :max-post="maxPost"
      :title="title"
      @click-link="tracking"
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
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import RelatedSection from '@/components/base/related/RelatedSection.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseArrowRight from '@/assets/icon/18/BaseArrowRight.svg'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { useAnalytics } from '@/utils/composition-api'
import { EventTypes } from '@/analytics/event-listeners/event.type'

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
    const analytics = useAnalytics()
    const title = computed(
      () => `${store.state.insurance.staticData.abbr}相關文章`
    )
    const relatedBlogs = computed(
      () => store.state.insurance.relatedBlogs || []
    )
    const insuranceAbbr = computed(() => store.state.insurance.staticData.abbr)
    const tracking = (index: number) => {
      analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: '點擊文章區塊',
        action: relatedBlogs.value[index].link.path,
        label: insuranceAbbr.value,
      })
    }

    return {
      title,
      relatedBlogs,
      tracking,
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
