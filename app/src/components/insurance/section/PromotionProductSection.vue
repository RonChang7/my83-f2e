<template>
  <div class="PromotionProductSection">
    <div class="PromotionProductSection__header">
      <h2 class="PromotionProductSection__title">{{ title }}</h2>
      <GlobalLink
        v-if="isSearchPage"
        to="/product/leaderboard"
        @click.native="clickMoreProduct"
      >
        <span>看更多熱門商品</span>
        <BaseArrowRight />
      </GlobalLink>
    </div>
    <div v-if="description" class="PromotionProductSection__description">
      {{ description }}
    </div>
    <BaseHorizontalList
      class="PromotionProductSection__list"
      :offset="isDesktop ? 20 : 0"
    >
      <PromotionProductCard
        v-for="product in promotionProducts"
        :key="product.id"
        class="product"
        :class="{ enabled: isEnabled(product) }"
        :product="product"
        :enabled="isEnabled(product)"
        @click-button="
          isEnabled(product)
            ? clickPromotionProductButton(`${product.company}${product.name}`)
            : null
        "
        @click.native="isEnabled(product) ? clickProductCard(product) : null"
      />
      <PromotionSection
        v-if="shouldShowPromotionAd"
        class="promotionSales"
        :page-type="pageType"
      />
    </BaseHorizontalList>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useRoute,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import { useAnalytics } from '@/utils/composition-api'
import BaseHorizontalList from '@/components/my83-ui-kit/list/BaseHorizontalList.vue'
import PromotionSection from '@/components/insurance/section/PromotionSection.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseArrowRight from '@/assets/icon/18/BaseArrowRight.svg'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { PromotionInsuranceProduct } from '@/api/insurance/insurance.type'
import { EventTypes } from '@/analytics/event-listeners/event.type'
import { useDevice } from '@/mixins/device/device-mixins'
import { InsuranceListType } from '@/routes/insurance'
import { scrollToPosition } from '@/utils/scroll'
import PromotionProductCard from '../product/PromotionProductCard.vue'

export default defineComponent({
  components: {
    BaseHorizontalList,
    PromotionProductCard,
    PromotionSection,
    GlobalLink,
    BaseArrowRight,
  },
  props: {
    shouldShowPromotionAd: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore<InsuranceVuexState>()
    const route = useRoute()
    const router = useRouter()
    const analytics = useAnalytics()
    const { isDesktop } = useDevice()

    const isSearchPage = computed(
      () => route.value.name === InsuranceListType.SEARCH
    )
    const title = computed(() => (isSearchPage.value ? '熱門商品' : '推薦商品'))
    const description = computed(() => {
      return isSearchPage.value
        ? ''
        : store.state.insurance.staticData.isExternal
        ? store.state.insurance.staticData.promotionWording
        : 'MY83 嚴選的高保障的保單，讓你挑選保險商品不再耗時傷神！'
    })
    const promotionProducts = computed(
      () => store.state.insurance.promotionProducts
    )
    const pageType = computed(() => store.state.insurance.staticData.abbr)

    const isEnabled = (product: PromotionInsuranceProduct) => {
      return product.fee !== null
    }
    const clickProductCard = (product: PromotionInsuranceProduct) => {
      const isExternal = isSearchPage.value
        ? false
        : store.state.insurance.staticData.isExternal
      if (isExternal) {
        window.location.href = product.btn.link.url
      } else {
        router.push(product.btn.link.path)
      }
    }
    const clickPromotionProductButton = (productName: string) => {
      const insuranceType = isSearchPage.value
        ? '商品搜尋頁'
        : store.state.insurance.staticData.abbr

      analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: '險種頁商品CTA',
        action: '推薦商品',
        label: `${insuranceType} ${productName}`,
      })
    }

    const clickMoreProduct = () => {
      // @TODO: 之後調整 排行榜頁面 scroll to top issue
      const removeHookCb = router.afterEach(() => {
        scrollToPosition({
          to: 0,
          container: window,
          vertical: true,
        })
        removeHookCb()
      })
    }

    return {
      isDesktop,
      isSearchPage,
      title,
      description,
      promotionProducts,
      pageType,
      isEnabled,
      clickProductCard,
      clickPromotionProductButton,
      clickMoreProduct,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.PromotionProductSection {
  width: 1120px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > a {
      display: flex;
      align-items: center;
      font-size: 0.875rem;

      @include hover('_gray-secondary-darker', $has-svg: true);

      > span {
        margin-right: 4px;
      }
    }
  }

  &__title,
  &__description {
    color: $gray-primary;
  }

  &__title {
    margin: 0 0 8px 0;
    font-size: 1.75rem;
    font-weight: 500;
  }

  &__description {
    margin-bottom: 0;
  }

  .product {
    &.enabled {
      cursor: pointer;
    }

    &:not(:last-of-type) {
      margin-right: 16px;
    }
  }

  .promotionSales {
    width: 240px;
    margin-top: 20px;
  }

  @include max-media('xl') {
    width: 100%;
    padding: 0 20px;

    &__title {
      font-size: 1.375rem;
    }

    &__description {
      font-size: 0.875rem;
      margin: 0 10px 12px 0;
    }

    .product:not(:last-of-type) {
      margin-right: 10px;
    }
  }
}
</style>
