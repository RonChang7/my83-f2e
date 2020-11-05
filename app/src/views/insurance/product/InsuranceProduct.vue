<template>
  <div class="InsuranceProduct">
    <ProductHowToBuyModal :visible.sync="infoModalVisible" />

    <div class="InsuranceProduct__row thin">
      <ProductHeaderSection />
    </div>

    <div class="InsuranceProduct__row thin">
      <div class="column left">
        <ProductDescription />
      </div>
    </div>

    <div class="InsuranceProduct__row thin">
      <div class="column left">
        <ProductQuerySection @open-modal="openInfoModal" />
      </div>
    </div>

    <div class="InsuranceProduct__row withColumns">
      <div class="column left">
        <ProductCoverageSection />
        <ProductRuleSection />
        <ProductPromotionSection v-if="isDesktop" @open-modal="openInfoModal" />
      </div>
      <div class="column right">
        <ProductPromotionSalesSection />
        <PopularProductSection />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ProductHowToBuyModal from '@/components/insurance/modal/ProductHowToBuyModal.vue'
import ProductHeaderSection from '@/components/insurance/section/ProductHeaderSection.vue'
import ProductDescription from '@/components/insurance/section/ProductDescription.vue'
import ProductCoverageSection from '@/components/insurance/section/ProductCoverageSection.vue'
import ProductRuleSection from '@/components/insurance/section/ProductRuleSection.vue'
import ProductPromotionSection from '@/components/insurance/section/ProductPromotionSection.vue'
import ProductPromotionSalesSection from '@/components/insurance/section/ProductPromotionSalesSection.vue'
import PopularProductSection from '@/components/insurance/section/PopularProductSection.vue'
import ProductQuerySection from '@/components/insurance/section/ProductQuerySection.vue'
import DeviceMixin from '@/mixins/device/device-mixins'

@Component({
  mixins: [DeviceMixin],
  components: {
    ProductHowToBuyModal,
    ProductHeaderSection,
    ProductDescription,
    ProductCoverageSection,
    ProductRuleSection,
    ProductPromotionSection,
    ProductPromotionSalesSection,
    PopularProductSection,
    ProductQuerySection,
  },
})
export default class InsuranceProduct extends Vue {
  infoModalVisible: boolean = false

  openInfoModal() {
    this.infoModalVisible = true
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.InsuranceProduct {
  display: flex;
  flex-direction: column;
  padding-top: 24px;
  background: url('#{$image-bucket-url}/front/insurance/product/bg-cloud-desktop.png')
    center top no-repeat;
  background-color: $primary-bg;

  @include max-media('sm') {
    padding-top: 16px;
    background: url('#{$image-bucket-url}/front/insurance/product/bg-cloud-mobile.png')
      center top no-repeat;
    background-color: $primary-bg;
  }

  &__row {
    display: flex;
    width: 1120px;
    margin: 0 auto;
    margin-bottom: 32px;

    @include max-media('xl') {
      width: 100vw;
    }

    &.thin {
      margin-bottom: 20px;

      @include max-media('xl') {
        margin-bottom: 16px;
      }
    }

    &.withColumns {
      @include max-media('xl') {
        flex-direction: column;
      }
    }

    .column {
      &:not(:last-child) {
        margin-right: 20px;
      }

      > div:not(:last-child) {
        margin-bottom: 20px;
      }

      &.left {
        width: 836px;
      }

      &.right {
        width: 264px;
        margin-top: 49px;
      }

      @include max-media('xl') {
        &:not(:last-child) {
          margin-right: 0px;
        }

        > div:not(:last-child) {
          margin-bottom: 24px;
        }

        &.left,
        &.right {
          width: 100vw;
        }

        &.right {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
