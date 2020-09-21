<template>
  <div
    class="QuestionListPage"
    :class="{ 'pb-0': pageType === 'search' && !hasSearchResult }"
  >
    <div class="QuestionListPage__row banner">
      <BannerSection v-if="pageType === 'list'" />
    </div>
    <div class="QuestionListPage__row search">
      <div class="left" :class="[pageType]">
        <ListSearchSection />
      </div>
      <div v-if="!isMobile && pageType === 'list'" class="right">
        <ListAskingSection />
      </div>
    </div>
    <div
      v-if="pageType === 'search'"
      class="QuestionListPage__row searchResultCount"
    >
      <span>共 {{ pagination.totalCount }} 個搜尋結果</span>
    </div>
    <template v-if="isMobile && shouldShowHotService">
      <div class="QuestionListPage__row hot">
        <HotServiceSection />
      </div>
      <div class="QuestionListPage__row asking">
        <ListAskingSection />
      </div>
    </template>
    <div
      class="QuestionListPage__row content"
      :class="{ 'mb-0': pageType === 'search' && !hasSearchResult }"
    >
      <QuestionLayoutWithFixedColumn
        v-if="pageType === 'list' || (pageType === 'search' && hasSearchResult)"
      >
        <template v-slot:left>
          <ListQuestionSection />
        </template>
        <template v-slot:left-bottom-offset>
          <div class="pagination">
            <BasePagination
              v-if="shouldShowPagination"
              :pagination="pagination"
              @to-page="(index) => $emit('to-page', index)"
            />
          </div>
        </template>
        <template v-slot:right>
          <ListGuideSection v-if="isDesktop && shouldShowGuide" />
          <ListRecommendProductSection v-if="shouldShowRecommendProduct" />
          <PopularQuestionSection :max-post="isMobile ? 5 : 10" />
          <PopularBlogSection :max-post="isMobile ? 5 : 10" />
        </template>
      </QuestionLayoutWithFixedColumn>
      <div v-else class="noSearchResult">
        <img
          :src="`${$imageBucketUrl}/front/question/search-noresult.png`"
          :srcset="`${$imageBucketUrl}/front/question/search-noresult.png 2x`"
          alt="No search result"
        />
        <span>
          沒有符合的搜尋結果
          <br />
          換個關鍵字試試看吧
        </span>
        <HotServiceSection />
      </div>
      <BaseScrollToTopButton
        v-if="shouldShowScrollToTop"
        class="scrollToTop"
        @click="scrollToTop"
      />
    </div>
  </div>
</template>

<script lang="ts">
import _, { DebouncedFunc } from 'lodash'
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import QuestionLayoutWithFixedColumn from '@/components/question/layout/QuestionLayoutWithFixedColumn.vue'
import BannerSection from '@/components/question/section/BannerSection.vue'
import ListQuestionSection from '@/components/question/section/ListQuestionSection.vue'
import ListAskingSection from '@/components/question/section/ListAskingSection.vue'
import ListGuideSection from '@/components/question/section/ListGuideSection.vue'
import ListRecommendProductSection from '@/components/question/section/ListRecommendProductSection.vue'
import ListSearchSection from '@/components/question/section/ListSearchSection.vue'
import HotServiceSection from '@/components/question/section/HotServiceSection.vue'
import PopularBlogSection from '@/components/question/section/PopularBlogSection.vue'
import PopularQuestionSection from '@/components/question/section/PopularQuestionSection.vue'
import BasePagination from '@/components/my83-ui-kit/pagination/BasePagination.vue'
import BaseScrollToTopButton from '@/components/my83-ui-kit/button/BaseScrollToTopButton.vue'
import { Pagination } from '@/api/type'
import { QuestionListVuexState } from '@/views/question/list/CreateQuestionListPage'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'
import UserMetaMixin, {
  ComponentInstance as UserMetaMixinComponentInstance,
} from '@/mixins/user/user-meta'
import { scrollTo } from '@/utils/element'

const options: ComponentOption = {
  mixins: [DeviceMixin, UserMetaMixin],
  components: {
    QuestionLayoutWithFixedColumn,
    BannerSection,
    ListQuestionSection,
    ListAskingSection,
    ListGuideSection,
    ListRecommendProductSection,
    ListSearchSection,
    HotServiceSection,
    PopularBlogSection,
    PopularQuestionSection,
    BasePagination,
    BaseScrollToTopButton,
  },
  data() {
    return {
      isMounted: false,
      shouldShowScrollToTop: false,
    }
  },
  methods: {
    scrollToTop() {
      const body = document.querySelector('body')
      scrollTo(body!, window)
    },
    checkShouldShowScrollToTop: _.debounce(function () {
      const screenInnerHeight = window.innerHeight
      const pageYScroll =
        window.pageYOffset || document.documentElement.scrollTop

      this.shouldShowScrollToTop = pageYScroll >= screenInnerHeight * 2
    }, 200),
  },
  computed: {
    pageType() {
      // pageType: 'list' | 'search'
      return this.$route.meta.pageType
    },
    pagination() {
      const { meta } = this.$store.state.questionList
      return meta ? meta.pagination : null
    },
    shouldShowPagination() {
      if (!this.pagination) return false
      return !(this.pagination.totalPage === 1)
    },
    shouldShowGuide() {
      if (this.pageType !== 'list') return false
      if (process.server || !this.isMounted) return true

      return this.userRole !== 'sales'
    },
    shouldShowRecommendProduct() {
      if (process.server || !this.isMounted) return true

      return this.userRole !== 'sales'
    },
    shouldShowHotService() {
      if (this.pageType !== 'list') return false
      if (process.server || !this.isMounted) return true

      return this.userRole !== 'sales'
    },
    hasSearchResult() {
      return !!(
        this.pageType === 'search' &&
        this.pagination &&
        this.pagination.totalCount
      )
    },
  },
  mounted() {
    this.isMounted = true
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
    Omit<DeviceMixinComponentInstance, keyof Vue>,
    Omit<UserMetaMixinComponentInstance, keyof Vue> {
  $store: Store<QuestionListVuexState>
}

export interface Data {
  isMounted: boolean
  shouldShowScrollToTop: boolean
}

export type Methods = {
  checkShouldShowScrollToTop: DebouncedFunc<(this: ComponentInstance) => void>
  scrollToTop(): void
}

export interface Computed {
  pageType: string
  pagination: Pagination | null
  shouldShowPagination: boolean
  shouldShowGuide: boolean
  shouldShowRecommendProduct: boolean
  shouldShowHotService: boolean
  hasSearchResult: boolean
}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.QuestionListPage {
  display: flex;
  flex-direction: column;
  padding: 0 0 60px;
  background: $primary-bg;

  @include max-media('xl') {
    padding: 0 0 90px;
  }

  &__row {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;

    @include max-media('xl') {
      flex-direction: column;

      &.search {
        order: 0;
        padding: 20px;
      }

      &.banner {
        order: 1;
        margin-bottom: 0;
      }

      &.hot {
        order: 2;
        margin-bottom: 0;
      }

      &.asking {
        order: 3;
        margin-bottom: 0;
      }

      &.content {
        order: 4;
      }
    }
  }

  .search {
    margin-bottom: 0;
  }

  .searchResultCount {
    margin: -20px 0 20px;

    > span {
      width: 1120px;

      @include max-media('xl') {
        width: 100%;
        padding: 10px 20px 0px;
      }
    }
  }

  .noSearchResult {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 80px;

    @include max-media('xl') {
      margin-bottom: 0;
    }

    > img {
      height: 100px;
      margin: 80px 0 30px;

      @include max-media('xl') {
        margin: 50px 0 20px;
        height: 50px;
      }
    }

    > span {
      text-align: center;

      @include max-media('xl') {
        margin-bottom: 63px;
      }

      @include min-media('xl') {
        font-weight: 500;
      }
    }
  }

  .pagination {
    @include max-media('xl') {
      margin: 30px 0;
    }
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

  .left {
    width: 740px;

    &.search {
      width: 1120px;

      @include max-media('xl') {
        width: auto;
      }
    }

    &:not(:last-child) {
      margin-right: 20px;
    }

    @include max-media('xl') {
      margin-right: 0;
    }
  }

  .right {
    width: 360px;
  }

  @include max-media('xl') {
    .left,
    .right {
      width: 100%;
    }
  }
}
</style>
