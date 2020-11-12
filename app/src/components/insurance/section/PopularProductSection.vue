<template>
  <div v-if="hotProducts.length" class="PopularProductSection">
    <RelatedSection :title="title" :related-data="hotProducts" :max-post="5" />
    <div class="PopularProductSection__footer">
      <GlobalLink :to="moreLink">
        更多
        <BaseArrowRight />
      </GlobalLink>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'
import RelatedSection from '@/components/base/related/RelatedSection.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseArrowRight from '@/components/base/icon/18/BaseArrowRight.vue'

@Component({
  components: {
    RelatedSection,
    GlobalLink,
    BaseArrowRight,
  },
})
export default class PopularProductSection extends Vue {
  get title() {
    return (
      (this.$store.state as InsuranceProductVuexState).insuranceProduct.product
        ?.hot_products.title || ''
    )
  }

  get hotProducts() {
    return (
      (this.$store.state as InsuranceProductVuexState).insuranceProduct.product
        ?.hot_products.data || []
    )
  }

  get moreLink() {
    const insuranceType = (this.$store.state as InsuranceProductVuexState)
      .insuranceProduct.product?.product.insurance_type
    return `/insurance/${insuranceType}`
  }
}
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
}
</style>
