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
          如何在 MY83 購買保險？
        </div>
      </div>
      <div class="ProductPromotionSection__action">
        <BaseButton
          :size="isMobile ? 'l-a' : 'xl'"
          :type="isMobile ? 'primary' : 'quaternary'"
          :to="consultLink.path"
          :is-full-width="isMobile"
        >
          免費找業務員
        </BaseButton>
        <div
          v-if="!isMobile"
          class="ProductPromotionSection__faq"
          @click="openModal"
        >
          如何在 MY83 購買保險？
        </div>
      </div>
    </div>
  </ProductPromotion>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import ProductPromotion from '../product/ProductPromotion.vue'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import { useDevice } from '@/mixins/device/device-mixins'
import { useStore } from '@/utils/composition-api'

export default defineComponent({
  components: {
    ProductPromotion,
    BaseButton,
  },
  setup() {
    const store = useStore<InsuranceProductVuexState>()
    const { isMobile } = useDevice()
    const fee = computed(() => store.state.insuranceProduct.fee)
    const consultLink = computed(
      () => store.state.insuranceProduct.product?.consult_link
    )

    return {
      isMobile,
      fee,
      consultLink,
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

  @include min-media('sm') {
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

  @include max-media('sm') {
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    background: #fff;
    width: 100vw;
    box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.15);
    z-index: 1;
    color: $gray-primary;
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

    @include max-media('sm') {
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

    @include max-media('sm') {
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

    @include max-media('sm') {
      margin: 0;
      font-size: 0.75rem;

      @include hover('_secondary');
    }
  }
}
</style>
