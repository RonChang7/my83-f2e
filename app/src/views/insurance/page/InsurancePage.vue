<template>
  <div class="InsurancePage">
    <InfoModal
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

    <div class="InsurancePage__rowWithTowColumns">
      <div class="column left">
        <ProductionLIstSection />
        <div class="pagination">
          <BasePagination
            v-if="shouldShowPagination"
            :pagination="pagination"
            @to-page="(index) => $emit('to-page', index)"
          />
        </div>
      </div>
      <div class="column right">
        <PromotionSection />
        <FaqSection v-if="isMobile" id="faq" class="faq" />
        <RelatedBlogSection :max-post="isMobile ? 5 : 10" />
        <RelatedQuestionSection :max-post="isMobile ? 5 : 10" />
        <InsuranceLinkSection />
      </div>
    </div>

    <div v-if="!isMobile" id="faq" class="InsurancePage__row faq">
      <FaqSection />
    </div>
    <BaseScrollToTopButton
      v-if="shouldShowScrollToTop"
      class="scrollToTop"
      @click="scrollToTop"
    />
  </div>
</template>

<script lang="ts">
import _, { DebouncedFunc } from 'lodash'
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { InsuranceVuexState } from './Index.vue'
import HeaderSection from '@/components/insurance/section/HeaderSection.vue'
import ProductionLIstSection from '@/components/insurance/section/ProductionLIstSection.vue'
import PromotionProductSection from '@/components/insurance/section/PromotionProductSection.vue'
import PromotionSection from '@/components/insurance/section/PromotionSection.vue'
import FaqSection from '@/components/insurance/section/FaqSection.vue'
import InsuranceLinkSection from '@/components/insurance/section/InsuranceLinkSection.vue'
import RelatedBlogSection from '@/components/insurance/section/RelatedBlogSection.vue'
import RelatedQuestionSection from '@/components/insurance/section/RelatedQuestionSection.vue'
import BasePagination from '@/components/my83-ui-kit/pagination/BasePagination.vue'
import BaseScrollToTopButton from '@/components/my83-ui-kit/button/BaseScrollToTopButton.vue'
import { Pagination } from '@/api/type'
import InfoModal, {
  Props as InfoModalProps,
} from '@/components/insurance/modal/InfoModal.vue'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'
import { scrollToElement } from '@/utils/scroll'

const options: ComponentOption = {
  mixins: [DeviceMixin],
  components: {
    HeaderSection,
    ProductionLIstSection,
    PromotionProductSection,
    PromotionSection,
    InfoModal,
    FaqSection,
    InsuranceLinkSection,
    RelatedBlogSection,
    RelatedQuestionSection,
    BasePagination,
    BaseScrollToTopButton,
  },
  data() {
    return {
      infoModal: {
        visible: false,
        activeTab: '',
      },
      shouldShowScrollToTop: false,
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
    shouldShowPagination() {
      if (!this.pagination) return false
      return !(this.pagination.totalPage === 1)
    },
  },
  methods: {
    scrollToTop() {
      const body = document.querySelector('body')
      scrollToElement({
        el: body!,
        vertical: true,
      })
    },
    checkShouldShowScrollToTop: _.debounce(function () {
      const screenInnerHeight = window.innerHeight
      const pageYScroll =
        window.pageYOffset || document.documentElement.scrollTop

      this.shouldShowScrollToTop = pageYScroll >= screenInnerHeight * 2
    }, 200),
    updateInfoModalActiveTab(tab) {
      this.infoModal.activeTab = tab
    },
    openInfoModal() {
      this.infoModal.visible = true
    },
  },
  mounted() {
    window.addEventListener('scroll', this.checkShouldShowScrollToTop, {
      passive: true,
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.checkShouldShowScrollToTop)
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
}

export interface Data {
  infoModal: {
    visible: boolean
    activeTab: InfoModalProps['activeTab'] | ''
  }
  shouldShowScrollToTop: boolean
}

export type Methods = {
  checkShouldShowScrollToTop: DebouncedFunc<(this: ComponentInstance) => void>
  scrollToTop(): void
  updateInfoModalActiveTab(tab: InfoModalProps['activeTab']): void
  openInfoModal(): void
}

export interface Computed {
  pagination: Pagination | null
  shouldShowPromotionProduct: boolean
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
    }
  }

  .pagination {
    margin-top: 40px;
  }

  &::v-deep .scrollToTop {
    position: fixed;
    bottom: 20px;
    right: 20px;

    @include min-media('xl') {
      width: 56px;
      height: 56px;
      bottom: 40px;
      right: 40px;
    }
  }

  &__rowWithTowColumns {
    @include max-media('xl') {
      flex-direction: column;
    }

    .column {
      display: flex;
      flex-direction: column;
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }

      &.left {
        width: 740px;
      }

      &.right {
        width: 360px;
        margin-top: 120px;

        > .faq {
          background: #fff;
          padding-top: 32px;
        }

        @include max-media('xl') {
          margin-top: 30px;
        }
      }

      &.left,
      &.right {
        @include max-media('xl') {
          width: 100%;
        }
      }
    }
  }
}
</style>
