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

    <div class="InsuranceProduct__row">
      <div class="column left">
        <ProductQuerySection
          ref="productQuerySection"
          @open-modal="openInfoModal"
        />
      </div>
    </div>

    <div class="InsuranceProduct__row withColumns">
      <div class="column left">
        <ProductCoverageSection />
        <ProductRuleSection />
        <ProductPromotionSection
          v-if="shouldShowProductPromotionSection"
          @open-modal="openInfoModal"
        />
      </div>
      <div class="column right">
        <ProductPromotionSalesSection
          v-if="isDesktop"
          :active-sales-count="activeSalesCount"
        />
        <PromotionSection v-else :active-sales-count="activeSalesCount" />
        <PopularProductSection />
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
import ProductDescription from '@/components/insurance/section/ProductDescription.vue'
import ProductCoverageSection from '@/components/insurance/section/ProductCoverageSection.vue'
import ProductRuleSection from '@/components/insurance/section/ProductRuleSection.vue'
import ProductPromotionSection from '@/components/insurance/section/ProductPromotionSection.vue'
import ProductPromotionSalesSection from '@/components/insurance/section/ProductPromotionSalesSection.vue'
import PromotionSection from '@/components/insurance/section/PromotionSection.vue'
import PopularProductSection from '@/components/insurance/section/PopularProductSection.vue'
import ProductQuerySection from '@/components/insurance/section/ProductQuerySection.vue'
import BaseScrollToTopButton from '@/components/my83-ui-kit/button/BaseScrollToTopButton.vue'
import DeviceMixin from '@/mixins/device/device-mixins'
import { scrollToElement } from '@/utils/scroll'

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
    PromotionSection,
    PopularProductSection,
    ProductQuerySection,
    BaseScrollToTopButton,
  },
})
export default class InsuranceProduct extends DeviceMixin {
  infoModalVisible: boolean = false

  scrollToTopObserver: IntersectionObserver | null = null

  shouldShowScrollToTop: boolean = false

  $refs: {
    productQuerySection: Vue
  }

  get shouldShowProductPromotionSection() {
    return !(this.isMobile && !this.shouldShowScrollToTop)
  }

  get activeSalesCount() {
    return this.$store.state.meta.activeSalesCount
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
}

::v-deep .scrollToTop {
  position: fixed;
  bottom: 90px;
  right: 20px;
}
</style>
