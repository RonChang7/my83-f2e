<template>
  <div class="InsuranceProduct">
    <ProductHowToBuyModal :visible.sync="infoModalVisible" />

    <div class="InsuranceProduct__row thin">
      <ProductHeaderSection />
    </div>

    <div class="InsuranceProduct__row">
      <div class="column left">
        <ProductQuerySection
          ref="productQuerySection"
          @open-modal="openInfoModal"
        />
      </div>
    </div>

    <div class="InsuranceProduct__row withColumns">
      <div class="column w-100">
        <ProductCoverageSection />
        <ProductPromotionSection @open-modal="openInfoModal" />
        <ProductFQASection />
        <div class="InsuranceProduct__hint">
          本網站商品資訊僅供參考，實際內容以保險公司公開資訊為準。
        </div>
      </div>
    </div>

    <BaseScrollToTopButton
      v-if="isMobile && shouldShowScrollToTop"
      class="scrollToTop"
      @click="scrollToTop"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ProductHowToBuyModal from '@/components/insurance/modal/ProductHowToBuyModal.vue'
import ProductHeaderSection from '@/components/insurance/section/ProductHeaderSection.vue'
import ProductCoverageSection from '@/components/insurance/section/ProductCoverageSection.vue'
import ProductPromotionSection from '@/components/insurance/section/ProductPromotionSection.vue'
import ProductQuerySection from '@/components/insurance/section/ProductQuerySection.vue'
import ProductFQASection from '@/components/insurance/section/ProductFQASection.vue'
import BaseScrollToTopButton from '@/components/my83-ui-kit/button/BaseScrollToTopButton.vue'
import DeviceMixin from '@/mixins/device/device-mixins'
import { scrollToElement } from '@/utils/scroll'
import { InsuranceProductVuexState } from './Index.vue'

@Component({
  mixins: [DeviceMixin],
  components: {
    ProductHowToBuyModal,
    ProductHeaderSection,
    ProductCoverageSection,
    ProductPromotionSection,
    ProductQuerySection,
    BaseScrollToTopButton,
    ProductFQASection,
  },
})
export default class InsuranceProduct extends DeviceMixin {
  infoModalVisible: boolean = false

  scrollToTopObserver: IntersectionObserver | null = null

  shouldShowScrollToTop: boolean = false

  $refs: {
    productQuerySection: Vue
  }

  get insuranceType() {
    return (
      (this.$store.state as InsuranceProductVuexState).insuranceProduct
        .singleProduct?.basic?.categoryMain || ''
    )
  }

  get title() {
    const state = this.$store.state as InsuranceProductVuexState
    return `${state.insuranceProduct.product?.product.company} ${state.insuranceProduct.product?.product.name}`
  }

  get singleProduct() {
    return (this.$store.state as InsuranceProductVuexState).insuranceProduct
      .singleProduct
  }

  scrollToTop() {
    const body = document.querySelector('body')
    scrollToElement({
      el: body!,
      vertical: true,
    })
  }

  createScrollToTopIntersectionObserver() {
    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.shouldShowScrollToTop = entry.boundingClientRect.bottom < 0
      })
    })
  }

  openInfoModal() {
    this.infoModalVisible = true
  }

  mounted() {
    if (this.$refs.productQuerySection) {
      this.scrollToTopObserver = this.createScrollToTopIntersectionObserver()
      this.scrollToTopObserver.observe(this.$refs.productQuerySection.$el)
    }
  }

  beforeDestroy() {
    if (this.scrollToTopObserver) {
      this.scrollToTopObserver.disconnect()
      this.scrollToTopObserver = null
    }
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

    &:last-of-type {
      margin-bottom: 100px;
    }

    @include max-media('xl') {
      width: 100vw;
      margin-bottom: 24px;
    }

    &.thin {
      margin-bottom: 20px;

      @include max-media('xl') {
        margin-bottom: 10px;
      }
    }

    .w-100 {
      width: 100%;
    }

    &.withColumns {
      @include max-media('xl') {
        flex-direction: column;

        .left {
          > div:first-child {
            margin-bottom: 24px;
          }
        }
      }
    }

    .column {
      &:not(:last-child) {
        margin-right: 20px;
      }

      > div:not(:last-child) {
        margin-bottom: 32px;
      }

      &.left {
        width: 836px;
      }

      &.right {
        width: 264px;
        margin-top: 43px;

        > div:not(:last-child) {
          margin-bottom: 20px;
        }
      }

      @include max-media('xl') {
        &:not(:last-child) {
          margin-right: 0px;
        }

        > div:not(:last-child) {
          margin-bottom: 0;
        }

        &.left,
        &.right {
          width: 100vw;
        }

        &.right {
          margin-top: 0;

          > div:not(:last-child) {
            margin-bottom: 0;
          }
        }
      }
    }
  }

  &__report {
    margin: 36px auto;
    width: 264px;
    padding: 0;
  }

  &__hint {
    text-align: center;
    margin: 36px 16px 72px;
    @include max-media('sm') {
      text-align: left;
    }
  }
}

::v-deep .scrollToTop {
  position: fixed;
  bottom: 90px;
  right: 20px;
}
</style>
