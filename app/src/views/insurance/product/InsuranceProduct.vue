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
          @tracking="tracking('consultSales', title)"
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
          @tracking="tracking('consultSales', title)"
        />
      </div>
      <div class="column right">
        <ProductPromotionSalesSection
          v-if="isDesktop"
          @tracking="(action) => tracking('findSales', action)"
        />
        <PromotionSection
          v-else
          @tracking="(action) => tracking('findSales', action)"
        />
        <PopularProductSection
          @tracking="
            (action) => tracking('popularProduct', `${insuranceType} ${action}`)
          "
        />
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
import { InsuranceProductVuexState } from './Index.vue'
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
import { EventTypes } from '@/analytics/event-listeners/event.type'

type trackingType = 'findSales' | 'popularProduct' | 'consultSales'

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

  get insuranceType() {
    return (
      (this.$store.state as InsuranceProductVuexState).pageMeta.pageMeta
        ?.breadcrumbs?.[0].name || ''
    )
  }

  get title() {
    const state = this.$store.state as InsuranceProductVuexState
    return `${state.insuranceProduct.product?.product.company} ${state.insuranceProduct.product?.product.name}`
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

  tracking(type: trackingType, action: string) {
    const options: Record<trackingType, { category: string; label: string }> = {
      findSales: {
        category: '業務員廣告版位CTA',
        label: '商品頁',
      },
      popularProduct: {
        category: '點擊險種熱門排行榜',
        label: '',
      },
      consultSales: {
        category: '商品頁CTA',
        label: this.insuranceType,
      },
    }

    if (options[type]) {
      this.$analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: options[type].category,
        action,
        label: options[type].label,
      })
    }
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
