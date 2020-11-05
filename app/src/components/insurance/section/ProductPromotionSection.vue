<template>
  <ProductPromotion
    v-slot="{ formattedFee, openModal }"
    @open-modal="$emit('open-modal')"
  >
    <div class="ProductPromotionSection">
      <div class="ProductPromotionSection__fee">{{ formattedFee(fee) }}</div>
      <div class="ProductPromotionSection__action">
        <BaseButton size="xl" type="quaternary" :to="consultLink.path">
          免費找業務員
        </BaseButton>
        <div class="ProductPromotionSection__faq" @click="openModal">
          如何在 MY83 購買保險？
        </div>
      </div>
    </div>
  </ProductPromotion>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ProductPromotion from '../product/ProductPromotion.vue'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'

@Component({
  components: {
    ProductPromotion,
    BaseButton,
  },
})
export default class ProductPromotionSection extends Vue {
  get isFieldValidated(): boolean {
    return this.$store.getters['insuranceProduct/isFieldValidated']
  }

  get fee() {
    return this.isFieldValidated
      ? (this.$store.state as InsuranceProductVuexState).insuranceProduct.fee
      : -1
  }

  get consultLink() {
    return (this.$store.state as InsuranceProductVuexState).insuranceProduct
      .product?.consult_link
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.ProductPromotionSection {
  display: flex;
  justify-content: center;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 0 16px;
  border-radius: 12px;
  background: url('#{$image-bucket-url}/front/insurance/product/bg-product-promotion.png')
    center center no-repeat;
  color: #fff;

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
  }

  &__action {
    margin-left: 40px;
    text-align: center;
  }

  &__faq {
    margin-top: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;

    @include hover('_white');
  }
}
</style>
