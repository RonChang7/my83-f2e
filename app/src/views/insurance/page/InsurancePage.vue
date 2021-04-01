<template>
  <div class="InsurancePage">
    <InsuranceTipModal
      :visible.sync="infoModal.visible"
      :active-tab.sync="infoModal.activeTab"
      @update-active-tab="updateInfoModalActiveTab"
    />

    <div class="InsurancePage__row">
      <HeaderSection
        @update-active-tab="updateInfoModalActiveTab"
        @open-modal="openInfoModal"
      />
    </div>

    <div v-if="shouldShowPromotionProduct" class="InsurancePage__row promotion">
      <PromotionProductSection />
    </div>

    <div class="InsurancePage__row mb-0">
      <ProductListTitleSection @scrollToFAQ="scrollToFAQ" />
    </div>

    <div class="InsurancePage__rowWithTowColumns">
      <div class="column thin">
        <ProductListFilterSection
          v-if="!isMobile && shouldShowProductListFilter"
          :multi-section="true"
        />
        <PromotionSection :page-type="$store.state.insurance.staticData.abbr" />
        <FaqSection v-if="isMobile" id="faq" class="faq" />
        <RelatedBlogSection :max-post="isMobile ? 5 : 10" />
        <RelatedQuestionSection :max-post="isMobile ? 5 : 10" />
        <InsuranceLinkSection />
      </div>
      <div class="column wider">
        <ProductListSection ref="ProductListSection">
          <ProductListFilterSection
            v-if="isMobile && shouldShowProductListFilter"
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

    <div v-if="!isMobile" id="faq" class="InsurancePage__row faq">
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
import InsuranceLinkSection from '@/components/insurance/section/InsuranceLinkSection.vue'
import RelatedBlogSection from '@/components/insurance/section/RelatedBlogSection.vue'
import RelatedQuestionSection from '@/components/insurance/section/RelatedQuestionSection.vue'
import ProductListFilterSection from '@/components/insurance/section/ProductListFilterSection.vue'
import BasePagination from '@/components/my83-ui-kit/pagination/BasePagination.vue'
import { Pagination } from '@/api/type'
import InsuranceTipModal, {
  Props as InsuranceTipModalProps,
} from '@/components/insurance/modal/InsuranceTipModal.vue'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'
import { scrollToElement } from '@/utils/scroll'
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
    InsuranceLinkSection,
    RelatedBlogSection,
    RelatedQuestionSection,
    ProductListFilterSection,
    BasePagination,
  },
  data() {
    return {
      infoModal: {
        visible: false,
        activeTab: '',
      },
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
    shouldShowProductListFilter() {
      return !!this.$store.state.insurance.filter.config
    },
    shouldShowPagination() {
      if (!this.pagination) return false
      return !(this.pagination.totalPage === 1)
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
      const offset = this.isMobile ? 65 : 90

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
  },
  watch: {
    // handle page position when navigate via pagination
    '$route.query.page'() {
      this.scrollToProductListSection()
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
}

export type Methods = {
  updateInfoModalActiveTab(tab: InsuranceTipModalProps['activeTab']): void
  openInfoModal(): void
  scrollToProductListSection(): void
  scrollToFAQ(): void
}

export interface Computed {
  pagination: Pagination | null
  shouldShowPromotionProduct: boolean
  shouldShowProductListFilter: boolean
  shouldShowPagination: boolean
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
    margin-top: 40px;

    @include max-media('xl') {
      margin: 30px 0 20px;
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
