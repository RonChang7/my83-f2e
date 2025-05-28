<template>
  <div class="InsurancePage">
    <div class="InsurancePage__row" :class="{ 'mb-0': isSearchPage }">
      <!-- 搜尋：國泰。TODO:確認資料到底從哪來, openInfoModal 在幹嘛 -->
      <HeaderSection
        :is-insurance-page="isInsurancePage"
        @update-active-tab="updateInfoModalActiveTab"
        @open-modal="openInfoModal"
      />
    </div>
    <div class="InsurancePage__row mb-0">
      <!-- 國泰 的相關產品 TODO: 國泰哪裡來的 scrollToFAQ 是什麼 -->
      <ProductListTitleSection
        :is-insurance-page="isInsurancePage"
        :product-list-description="productListDescription"
        @scrollToFAQ="scrollToFAQ"
      />
    </div>

    <div class="InsurancePage__rowWithTowColumns">
      <div class="column thin">
        <ProductListDesktopFilterSection
          v-if="!isMobile"
          @loading="setLoadingStatus"
        />
      </div>
      <div class="column wider">
        <ProductListSection
          ref="ProductListSection"
          :is-empty-search-result="isSearchPage"
          :is-loading="isLoading"
        >
          <ProductListMobileFilterSection
            v-if="isMobile"
            :product-list-description="productListDescription"
            @submit="scrollToProductListSection"
          />
        </ProductListSection>
        <div v-if="shouldShowPagination" class="pagination">
          <BasePagination
            :pagination="pagination"
            @to-page="(index) => $emit('to-page', index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
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
import PromotionBundleSection from '@/components/insurance/section/PromotionBundleSection.vue'
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
    PromotionBundleSection,
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
      if (!meta) return null

      // 直接從路由取得當前頁碼
      const currentPage = parseInt(this.$route.query.page) || 1

      return {
        ...meta.pagination,
        currentPage, // 使用路由中的頁碼
      }
    },
    shouldShowPromotionProduct() {
      return !!this.$store.state.insurance.promotionProducts?.length
    },
    shouldShowDesktopPromotionAd() {
      return !(
        this.$store.state.insurance.promotionProducts &&
        this.$store.state.insurance.promotionProducts.length > 0 &&
        this.$store.state.insurance.promotionProducts.length <= 3
      )
    },
    shouldShowProductListFilter() {
      return _.every(
        this.$store.state.insurance.filter.config,
        (field) => field.values.length > 0
      )
    },
    shouldShowPagination() {
      if (!this.pagination?.totalPage) return false
      return !(this.pagination.totalPage === 1)
    },
    productListDescription() {
      return this.$store.state.insurance.staticData.productListDescription ||
        this.shouldShowProductListFilter
        ? '依熱門度排序。費率以 30 歲女性為基準。'
        : ''
    },
    isInsurancePage() {
      return (
        this.$route.name === InsuranceListType.NORMAL ||
        this.$route.name === InsuranceListType.EXTERNAL
      )
    },
    isExternalPage() {
      return this.$route.name === InsuranceListType.EXTERNAL
    },
    isSearchPage() {
      return this.$route.name === InsuranceListType.SEARCH
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
    // 當篩選條件變化時監聽 URL 參數變化
    '$route.query'(newQuery, oldQuery) {
      // 如果有篩選參數變化（除了 page）
      const filterParams = ['status', 'categoryId', 'caseId', 'typeId', 'tagId']
      const hasFilterChange = filterParams.some(
        (param) => newQuery[param] !== oldQuery[param]
      )

      if (hasFilterChange) {
        this.scrollToProductListSection()
      }
    },

    // 資料變化後自動關閉加載狀態
    '$store.state.insurance.insuranceSearchProduct'() {
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
  isInsurancePage: boolean
  isExternalPage: boolean
  isSearchPage: boolean
}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.InsurancePage {
  min-height: 100vh;
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

      &.bottom {
        margin-bottom: 90px;

        @include max-media('xl') {
          margin-bottom: 110px;
        }
      }
    }
  }

  .promotion-ad {
    margin: 6px 0 -4px;
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
