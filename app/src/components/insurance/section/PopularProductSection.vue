<template>
  <div v-if="hotProducts.length" class="PopularProductSection">
    <RelatedSection
      :title="title"
      :related-data="hotProducts"
      :max-post="5"
      @click-link="tracking"
    />
    <div class="PopularProductSection__footer">
      <GlobalLink :to="moreLink">
        更多
        <BaseArrowRight />
      </GlobalLink>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'
import RelatedSection from '@/components/base/related/RelatedSection.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseArrowRight from '@/assets/icon/18/BaseArrowRight.svg'
import { useAnalytics, useStore } from '@/utils/composition-api'
import { EventTypes } from '@/analytics/event-listeners/event.type'

export default defineComponent({
  components: {
    RelatedSection,
    GlobalLink,
    BaseArrowRight,
  },
  setup() {
    const store = useStore<InsuranceProductVuexState>()
    const analytics = useAnalytics()

    const title = computed(
      () => store.state.insuranceProduct.product?.hot_products.title || ''
    )
    const hotProducts = computed(
      () => store.state.insuranceProduct.product?.hot_products.data || []
    )
    const moreLink = computed(() => {
      const insuranceType = store.state.insuranceProduct.product!.product
        .insurance_type
      return `/insurance/${insuranceType}`
    })

    const tracking = (index: number) =>
      analytics?.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: '點擊險種熱門排行榜',
        action: hotProducts.value[index].title,
        label: '',
      })

    return {
      title,
      hotProducts,
      moreLink,
      tracking,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.PopularProductSection {
  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 0.875rem;
    margin: 0 0px 20px;
    margin-top: -8px;

    @include max-media('xl') {
      margin: 0;
      margin-right: 20px;
    }

    > a {
      @include hover('_gray-secondary-darker', $has-svg: true);
    }
  }

  @include min-media('xl') {
    &::v-deep .RelatedCard__index {
      padding-right: 10px;
    }
  }
}
</style>
