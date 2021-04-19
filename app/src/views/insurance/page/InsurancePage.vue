<template>
  <div class="InsurancePage">
    <InsuranceTipModal
      v-if="!isFeatureTagPage"
      :visible.sync="infoModal.visible"
      :active-tab.sync="infoModal.activeTab"
      @update-active-tab="updateInfoModalActiveTab"
    />

    <div class="InsurancePage__row">
      <HeaderSection
        :is-feature-tag-page="isFeatureTagPage"
        @update-active-tab="updateInfoModalActiveTab"
        @open-modal="openInfoModal"
      />
    </div>

    <div
      v-if="!isFeatureTagPage && shouldShowPromotionProduct"
      class="InsurancePage__row promotion"
    >
      <PromotionProductSection
        :show-promotion-ad="isDesktop && !shouldShowDesktopPromotionAd"
      />
    </div>

    <div class="InsurancePage__row mb-0">
      <ProductListTitleSection
        :is-feature-tag-page="isFeatureTagPage"
        :product-list-description="productListDescription"
        @scrollToFAQ="scrollToFAQ"
      />
    </div>

    <div class="InsurancePage__rowWithTowColumns">
      <div class="column thin">
        <ProductListDesktopFilterSection
          v-if="!isMobile && shouldShowProductListFilter"
          @loading="setLoadingStatus"
        />
        <PromotionSection
          v-if="isDesktop && shouldShowDesktopPromotionAd"
          :page-type="$store.state.insurance.staticData.abbr"
        />
        <template v-if="!isFeatureTagPage">
          <FaqSection v-if="isMobile" id="faq" class="faq" />
          <RelatedBlogSection :max-post="isMobile ? 5 : 10" :thin="true" />
          <RelatedQuestionSection :max-post="isMobile ? 5 : 10" :thin="true" />
        </template>
      </div>
      <div class="column wider">
        <ProductListSection ref="ProductListSection" :is-loading="isLoading">
          <ProductListMobileFilterSection
            v-if="isMobile && shouldShowProductListFilter"
            :product-list-description="productListDescription"
            @submit="scrollToProductListSection"
          />
          <template #ad>
            <PromotionSection
              v-if="isMobile"
              :page-type="$store.state.insurance.staticData.abbr"
            />
          </template>
        </ProductListSection>
        <div v-if="shouldShowPagination" class="pagination">
          <BasePagination
            :pagination="pagination"
            @to-page="(index) => $emit('to-page', index)"
          />
        </div>
      </div>
    </div>

    <div
      v-if="!isMobile && !isFeatureTagPage"
      id="faq"
      class="InsurancePage__row faq"
    >
      <FaqSection />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import HeaderSection from '@/components/insurance/section/HeaderSection.vue'
import ProductListTitleSection from '@/components/insurance/section/ProductListTitleSection.vue'
import ProductListSection from '@/components/insurance/section/ProductListSection.vue'
import PromotionProductSection from '@/components/insurance/section/PromotionProductSection.vue'
import PromotionSection from '@/components/insurance/section/PromotionSection.vue'
import FaqSection from '@/components/insurance/section/FaqSection.vue'
import RelatedBlogSection from '@/components/insurance/section/RelatedBlogSection.vue'
import RelatedQuestionSection from '@/components/insurance/section/RelatedQuestionSection.vue'
import ProductListDesktopFilterSection from '@/components/insurance/section/product-list-filter/DesktopFilterSection.vue'
import ProductListMobileFilterSection from '@/components/insurance/section/product-list-filter/MobileFilterSection.vue'
import BasePagination from '@/components/my83-ui-kit/pagination/BasePagination.vue'
import { Pagination } from '@/api/type'
import InsuranceTipModal, {
  Props as InsuranceTipModalProps,
} from '@/components/insurance/modal/InsuranceTipModal.vue'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'
import { scrollToElement } from '@/utils/scroll'
import { InsuranceListType } from '@/routes/insurance'
import { InsuranceVuexState } from './Index.vue'

const options: ComponentOption = {
  mixins: [DeviceMixin],
  components: {
    HeaderSection,
    ProductListTitleSection,
    ProductListSection,
    PromotionProductSection,
    PromotionSection,
    InsuranceTipModal,
    FaqSection,
    RelatedBlogSection,
    RelatedQuestionSection,
    ProductListDesktopFilterSection,
    ProductListMobileFilterSection,
    BasePagination,
  },
  data() {
    return {
      infoModal: {
        visible: false,
        activeTab: '',
      },
      isLoading: false,
    }
  },
  computed: {
    pagination() {
      const { meta } = this.$store.state.insurance
      return meta ? meta.pagination : null
    },
    shouldShowPromotionProduct() {
      return !!this.$store.state.insurance.promotionProducts?.length
    },
    shouldShowDesktopPromotionAd() {
      return (
        !this.$store.state.insurance.promotionProducts ||
        (this.$store.state.insurance.promotionProducts &&
          this.$store.state.insurance.promotionProducts.length === 0) ||
        (this.$store.state.insurance.promotionProducts &&
          this.$store.state.insurance.promotionProducts.length > 3)
      )
    },
    shouldShowProductListFilter() {
      return !!this.$store.state.insurance.filter.config
    },
    shouldShowPagination() {
      if (!this.pagination) return false
      return !(this.pagination.totalPage === 1)
    },
    productListDescription() {
      return (
        this.$store.state.insurance.staticData.productListDescription ||
        '依熱門度排序。費率以 30 歲女性為基準。'
      )
    },
    isFeatureTagPage() {
      return this.$route.name === InsuranceListType.FEATURE_TAG
    },
  },
  methods: {
    updateInfoModalActiveTab(tab) {
      this.infoModal.activeTab = tab
    },
    openInfoModal() {
      this.infoModal.visible = true
    },
    scrollToProductListSection() {
      const offset = this.isMobile ? 105 : 160

      scrollToElement({
        el: this.$refs.ProductListSection.$el as HTMLElement,
        vertical: true,
        offset,
      })
    },
    scrollToFAQ() {
      scrollToElement({
        el: document.querySelector('#faq')! as HTMLElement,
        vertical: true,
        offset: 32,
      })
    },
    setLoadingStatus(status) {
      this.isLoading = status
    },
  },
  watch: {
    // handle page position when navigate via pagination
    '$route.query.page'() {
      this.scrollToProductListSection()
    },
    '$store.state.insurance.staticData.id'() {
      this.$nextTick(() => {
        window.scroll(0, 0)
      })
    },
    '$store.state.insurance.insuranceList'() {
      this.$nextTick(() => {
        this.isLoading = false
      })
    },
  },
}

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export type ComponentInstance = CombinedVueInstance<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export interface Instance
  extends Vue,
    Omit<DeviceMixinComponentInstance, keyof Vue> {
  $store: Store<InsuranceVuexState>
  $refs: {
    ProductListSection: Vue
  }
}

export interface Data {
  infoModal: {
    visible: boolean
    activeTab: InsuranceTipModalProps['activeTab'] | ''
  }
  isLoading: boolean
}

export type Methods = {
  updateInfoModalActiveTab(tab: InsuranceTipModalProps['activeTab']): void
  openInfoModal(): void
  scrollToProductListSection(): void
  scrollToFAQ(): void
  setLoadingStatus(status: boolean): void
}

export interface Computed {
  pagination: Pagination | null
  shouldShowPromotionProduct: boolean
  shouldShowDesktopPromotionAd: boolean
  shouldShowProductListFilter: boolean
  shouldShowPagination: boolean
  productListDescription: string
  isFeatureTagPage: boolean
}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.InsurancePage {
  display: flex;
  flex-direction: column;
  padding-top: 40px;
  background: url('#{$image-bucket-url}/front/insurance/bg-cloud-desktop.png')
    center top no-repeat;
  background-color: $primary-bg;

  @include max-media('sm') {
    padding-top: 32px;
    background: url('#{$image-bucket-url}/front/insurance/bg-cloud-mobile.png')
      center top no-repeat;
    background-color: $primary-bg;
  }

  &__row,
  &__rowWithTowColumns {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
  }

  &__rowWithTowColumns {
    margin-bottom: 50px;
  }

  &__row {
    &.faq {
      background: #fff;
      padding-top: 72px;
      margin-bottom: 0;

      @include max-media('xl') {
        @include card-secondary;

        padding-top: 32px;
        margin-bottom: 20px;
      }
    }

    &.promotion {
      overflow: hidden;

      @include min-media('xl') {
        margin-bottom: 20px;
      }
    }
  }

  .pagination {
    margin-top: 16px;

    @include max-media('xl') {
      margin: 0 0 20px;
    }
  }

  &__rowWithTowColumns {
    @include max-media('xl') {
      flex-direction: column-reverse;
    }

    .column {
      display: flex;
      flex-direction: column;
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }

      &.wider {
        width: 836px;
      }

      &.thin {
        width: 264px;
        margin-top: 20px;

        > .faq {
          background: #fff;
          padding-top: 32px;
        }

        @include max-media('xl') {
          margin-top: 0px;
        }
      }

      &.thin,
      &.wider {
        @include max-media('xl') {
          width: 100%;
        }
      }
    }
  }
}
</style>
