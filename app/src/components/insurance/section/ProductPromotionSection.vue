<template>
  <ProductPromotion
    v-slot="{ getFormattedFee, openModal }"
    @open-modal="$emit('open-modal')"
  >
    <div class="ProductPromotionSection">
      <div class="ProductPromotionSection__content">
        <div class="ProductPromotionSection__fee">
          {{ getFormattedFee(fee) }}
        </div>
        <div
          v-if="isMobile"
          class="ProductPromotionSection__faq"
          @click="openModal"
        >
          想獲得保險相關建議？
        </div>
      </div>
      <div class="ProductPromotionSection__action">
        <BaseButton
          :size="isMobile ? 'l-a' : 'xl'"
          type="quaternary"
          to="/insured"
          :is-full-width="isMobile"
          @click.native="tracking"
        >
          免費諮詢
        </BaseButton>
        <div
          v-if="!isMobile"
          class="ProductPromotionSection__faq"
          @click="openModal"
        >
          想獲得保險相關建議？
        </div>
      </div>
    </div>
  </ProductPromotion>
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import { useDevice } from '@/mixins/device/device-mixins'
import { useAnalytics } from '@/utils/composition-api'
import { EventTypes } from '@/analytics/event-listeners/event.type'
import ProductPromotion from '../product/ProductPromotion.vue'

export default defineComponent({
  components: {
    ProductPromotion,
    BaseButton,
  },
  setup() {
    const store = useStore<InsuranceProductVuexState>()
    const analytics = useAnalytics()
    const { isMobile } = useDevice()
    const fee = computed(() => store.state.insuranceProduct.fee)

    const tracking = () => {
      const insuranceType = computed(
        () => store.state.insuranceProduct.singleProduct?.basic?.categoryMain
      )

      analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: '商品頁CTA',
        action: 'click',
        label: insuranceType.value,
      })
    }

    return {
      isMobile,
      fee,
      tracking,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductPromotionSection {
  display: flex;

  @include min-media('xl') {
    justify-content: center;
    max-width: 680px;
    width: 100%;
    margin: 0 auto;
    padding: 24px 0 16px;
    border-radius: 12px;
    background: url('#{$image-bucket-url}/front/insurance/product/bg-product-promotion.png')
      center center no-repeat;
    color: #fff;
  }

  @include max-media('xl') {
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    background: #ef6e2e;
    width: 100vw;
    box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.15);
    z-index: 1;
    color: #fff;
    padding: 15px 20px;
  }

  &__fee {
    font-size: 1.75rem;
    font-weight: 700;

    &:before {
      content: '保費';
      display: block;
      font-size: 1.125rem;
      font-weight: 500;
      margin-bottom: -4px;
    }

    @include max-media('xl') {
      font-size: 1.125rem;
      font-weight: 500;

      &:before {
        display: inline-block;
        margin-right: 0.5em;
      }
    }
  }

  &__action {
    margin-left: 40px;
    text-align: center;

    @include max-media('xl') {
      margin: 0;
      width: 128px;
    }
  }

  &__faq {
    margin-top: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    @include hover('_white');

    @include max-media('xl') {
      margin: 0;
      font-size: 0.75rem;

      @include hover('_secondary');
      color: #fff;
    }
  }
}
</style>
