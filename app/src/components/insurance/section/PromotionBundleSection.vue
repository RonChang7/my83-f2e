<template>
  <div class="PromotionBundleSection">
    <h2 class="PromotionBundleSection__title">熱門罐頭保單</h2>
    <div class="PromotionBundleSection__description">
      MY83
      的最強罐頭保單都幫你把最優惠的組合整理好了！融合各家優勢商品，推薦最適合的方案！
    </div>
    <BaseHorizontalList
      class="PromotionBundleSection__list"
      :offset="isDesktop ? 20 : 0"
    >
      <DesktopRecommendProductCard
        v-for="(recommendProduct, index) in recommendProducts"
        :key="index"
        class="product"
        :recommend-product="recommendProduct"
      />
    </BaseHorizontalList>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseHorizontalList from '@/components/my83-ui-kit/list/BaseHorizontalList.vue'
import DesktopRecommendProductCard from '@/components/my83-ui-kit/card/RecommendProductCard/DesktopRecommendProductCard.vue'
import { useDevice } from '@/mixins/device/device-mixins'

export default defineComponent({
  components: {
    BaseHorizontalList,
    DesktopRecommendProductCard,
  },
  setup() {
    const { isDesktop } = useDevice()
    const recommendProducts = [
      {
        header: '小資族群首選',
        btn: {
          text: '立即試算',
          link: {
            path: '/bundle/2',
          },
        },
        image_url: '/images/landing/img-adult@2x.png',
        title: '2025成人罐頭保單',
        description: '高CP值的保險組合',
      },
      {
        header: '爸比媽咪首選',
        btn: {
          text: '立即試算',
          link: {
            path: '/bundle/1',
          },
        },
        image_url: '/images/landing/img-newborn@2x.png',
        title: '2025新生兒罐頭保單',
        description: '想給寶貝最好的保障',
      },
    ]

    return {
      isDesktop,
      recommendProducts,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.PromotionBundleSection {
  margin-top: 80px;
  width: 100%;

  &__title,
  &__description {
    color: $gray-primary;
  }

  &__title {
    margin: 0 0 8px 0;
    font-size: 1.25rem;
    font-weight: 500;
  }

  &__description {
    margin-bottom: 12px;
    color: $gray-secondary;
  }

  .product {
    width: 340px;

    &.enabled {
      cursor: pointer;
    }

    &:not(:last-of-type) {
      margin-right: 16px;
    }
  }

  @include max-media('xl') {
    width: 100%;
    padding: 0 20px;
    overflow: hidden;

    &__title {
      font-size: 1.375rem;
    }

    &__description {
      font-size: 0.875rem;
      margin: 0 10px 12px 0;
    }

    .product {
      width: 274px;
      flex: 0 0 auto;
      margin-bottom: 0;

      &:not(:last-of-type) {
        margin-right: 7px;
      }
    }
  }
}
</style>
