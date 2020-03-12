<template>
  <div class="QuestionPage">
    <QuestionDropdownPanel
      v-if="dropdownMenu.visible"
      ref="dropdownPanel"
      :style="dropdownMenuStyle"
      :visible="dropdownMenu.visible"
      @blur="hidePanel"
    />
    <ReportPanel
      v-if="shouldShowReportPanel"
      :visible="shouldShowReportPanel"
    />
    <div class="QuestionPage__row">
      <div class="QuestionPage__column left">
        <HotServiceSection v-if="isMobile && shouldShowGuide" />

        <GuideSection v-if="isMobile && shouldShowGuide" />

        <QuestionSection />

        <MobileRecommendProductSection
          v-if="isMobile && shouldShowRecommendProduct"
        />

        <div
          ref="mobileRelatedSection"
          class="QuestionPage__mobileRelatedSection"
        >
          <RelatedQuestionSection v-if="isMobile" :max-post="5" />

          <RelatedBlogSection
            v-if="isMobile && shouldShowBlogSection"
            :max-post="5"
          />
        </div>

        <BaseScrollToTopButton
          v-if="isMobile && shouldShowScrollToTop"
          class="scrollToTop"
          :class="{ hasProduct: shouldShowRecommendProduct }"
          @click.native="scrollToTop"
        />

        <client-only>
          <AddAnswerSection v-if="userRole === 'sales'" />
        </client-only>

        <AnswersSection ref="answersSection" />

        <client-only>
          <AddAnswerSection v-if="userRole !== 'sales'" />
        </client-only>
      </div>
      <div v-if="!isMobile" class="QuestionPage__column right">
        <div
          ref="wrapper"
          class="wrapper"
          :class="{ fixed: shouldFixedColumn }"
        >
          <GuideSection v-if="shouldShowGuide" />
          <DesktopRecommendProductSection v-if="shouldShowRecommendProduct" />
          <RelatedQuestionSection />
          <RelatedBlogSection v-if="shouldShowBlogSection" />
        </div>
      </div>
    </div>
    <div v-if="!isMobile" class="QuestionPage__row">
      <HotServiceSection />
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { QuestionVuexState } from './Index.vue'
import QuestionSection from '@/components/question/QuestionSection.vue'
import AnswersSection from '@/components/question/AnswersSection.vue'
import AddAnswerSection from '@/components/question/AddAnswerSection.vue'
import GuideSection from '@/components/question/GuideSection.vue'
import HotServiceSection from '@/components/question/HotServiceSection.vue'
import RelatedQuestionSection from '@/components/question/RelatedQuestionSection.vue'
import RelatedBlogSection from '@/components/question/RelatedBlogSection.vue'
import BaseScrollToTopButton from '@/components/my83-ui-kit/button/BaseScrollToTopButton.vue'
import { UserRole } from '@/services/user/user'
import { UPDATE_QUESTION_DROPDOWN_MENU_STATUS } from '@/store/question/question.type'
import { scrollTo } from '@/utils/element'

import DeviceMixin, {
  Computed as DeviceMixinComputed,
} from '@/mixins/device/device-mixins'
const DesktopRecommendProductSection = () =>
  import('@/components/question/DesktopRecommendProductSection.vue')
const MobileRecommendProductSection = () =>
  import('@/components/question/MobileRecommendProductSection.vue')
const QuestionDropdownPanel = () =>
  import('@/components/question/panel/QuestionDropdownPanel.vue')
const ReportPanel = () => import('@/components/question/report/ReportPanel.vue')

export default {
  mixins: [DeviceMixin],
  components: {
    QuestionSection,
    AnswersSection,
    AddAnswerSection,
    GuideSection,
    HotServiceSection,
    RelatedQuestionSection,
    RelatedBlogSection,
    DesktopRecommendProductSection,
    MobileRecommendProductSection,
    QuestionDropdownPanel,
    ReportPanel,
    BaseScrollToTopButton,
  },
  data() {
    return {
      isMounted: false,
      observer: {
        scrollToTopObserver: null,
        fixedColumnObserver: null,
      },
      shouldShowScrollToTop: false,
      shouldFixedColumn: false,
      screenWidth: 0,
      scrollHeightBottom: 0,
      fixedColumn: {
        start: 0,
        end: 0,
      },
    }
  },
  methods: {
    /**
     * To fit my83-rt with question link to anchor point answer section,
     * e.g. https://my83.com.tw/question/22264#answer-107851
     */
    scrollToAnchorPoint(anchor) {
      const el = document.querySelector(anchor) as HTMLElement
      el && el.scrollIntoView()
    },
    hidePanel() {
      if (this.dropdownMenu.disableBlur) {
        this.$store.dispatch(
          `question/${UPDATE_QUESTION_DROPDOWN_MENU_STATUS}`,
          {
            ...this.dropdownMenu,
            disableBlur: false,
          }
        )
        ;(this.$refs.dropdownPanel.$el as HTMLElement).focus()
        return
      }

      const payload: QuestionVuexState['question']['dropdownMenu'] = {
        visible: false,
        top: null,
        left: null,
        disableBlur: false,
        options: [],
      }

      this.$store.dispatch(
        `question/${UPDATE_QUESTION_DROPDOWN_MENU_STATUS}`,
        payload
      )
    },
    scrollToTop() {
      const header = document.querySelector('header')
      scrollTo(header!, window)
    },
    createScrollToTopIntersectionObserver() {
      return new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          this.shouldShowScrollToTop = entry.boundingClientRect.bottom <= 0
        })
      })
    },
  },
  computed: {
    userRole() {
      const { headerPersonalized } = this.$store.state.header
      return headerPersonalized ? headerPersonalized.personalize.role : 'guest'
    },
    shouldShowGuide() {
      if (process.server || !this.isMounted) return true

      return this.userRole !== 'sales'
    },
    shouldShowHotService() {
      if (process.server || !this.isMounted) return true

      return this.userRole !== 'sales'
    },
    shouldShowBlogSection() {
      if (process.server || !this.isMounted) return true

      return this.userRole !== 'sales'
    },
    shouldShowRecommendProduct() {
      const recommendProduct = this.$store.state.question.recommendProduct

      if (!!recommendProduct && (process.server || !this.isMounted)) return true

      return this.userRole !== 'sales'
    },
    shouldShowReportPanel() {
      const { report } = this.$store.state.question
      return report.visible
    },
    dropdownMenu() {
      const { dropdownMenu } = this.$store.state.question
      return dropdownMenu
    },
    dropdownMenuStyle() {
      return {
        top: `${this.dropdownMenu.top}px`,
        left: `${this.dropdownMenu.left}px`,
      }
    },
  },
  beforeMount() {
    this.getScreenWidth = _.throttle(() => {
      this.screenWidth = window.innerWidth
    }, 200)

    this.getScrollHeightBottom = _.throttle(() => {
      this.scrollHeightBottom = window.scrollY + window.innerHeight
    }, 200)
  },
  mounted() {
    this.isMounted = true

    this.getScreenWidth()
    this.getScrollHeightBottom()

    this.fixedColumn.start =
      this.$refs.wrapper.offsetTop + this.$refs.wrapper.offsetHeight + 60

    if (this.$route.hash) {
      this.scrollToAnchorPoint(this.$route.hash)
    }

    if (this.$refs.mobileRelatedSection) {
      this.observer.scrollToTopObserver = this.createScrollToTopIntersectionObserver()
      this.observer.scrollToTopObserver.observe(this.$refs.mobileRelatedSection)
    }

    this.isDesktop && window.addEventListener('resize', this.getScreenWidth)
    this.isDesktop &&
      window.addEventListener('scroll', this.getScrollHeightBottom)
  },
  watch: {
    scrollHeightBottom(val: number) {
      if (!this.isDesktop || this.screenWidth < 1200) {
        this.$refs.wrapper.style.cssText = ''
        this.shouldFixedColumn = false
        return
      }

      this.fixedColumn.end =
        (this.$refs.answersSection.$el as HTMLElement).offsetTop +
        (this.$refs.answersSection.$el as HTMLElement).offsetHeight +
        60

      if (val < this.fixedColumn.start) {
        this.$refs.wrapper.style.cssText = ''
        this.shouldFixedColumn = false
      } else if (val > this.fixedColumn.start && val < this.fixedColumn.end) {
        this.$refs.wrapper.style.cssText = ''
        this.shouldFixedColumn = true
      } else {
        const paddingTop = this.fixedColumn.end - this.fixedColumn.start
        this.shouldFixedColumn = false
        this.$refs.wrapper.style.paddingTop = `${paddingTop}px`
      }
    },
  },
  beforeDestroy() {
    this.isDesktop && window.removeEventListener('resize', this.getScreenWidth)
    this.isDesktop &&
      window.removeEventListener('scroll', this.getScrollHeightBottom)

    _.forEach(this.observer, (observer) => {
      if (observer) {
        observer.disconnect()
        observer = null
      }
    })
  },
} as ComponentOption

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

export interface Instance extends Vue {
  $store: Store<QuestionVuexState>
  $refs: {
    dropdownPanel: Vue
    mobileRelatedSection: Element
    wrapper: HTMLElement
    answersSection: Vue
    anchor: HTMLElement
  }
  getScreenWidth(this: ComponentInstance): void
  getScrollHeightBottom(this: ComponentInstance): void
}

export interface Data {
  isMounted: boolean
  observer: {
    scrollToTopObserver: IntersectionObserver | null
    fixedColumnObserver: IntersectionObserver | null
  }
  shouldShowScrollToTop: boolean
  shouldFixedColumn: boolean
  screenWidth: number
  scrollHeightBottom: number
  fixedColumn: {
    start: number
    end: number
  }
}

export interface Methods {
  scrollToAnchorPoint(anchor: string): void
  hidePanel(): void
  scrollToTop(): void
  createScrollToTopIntersectionObserver(): IntersectionObserver
}

export interface Computed extends DeviceMixinComputed {
  userRole: UserRole
  shouldShowGuide: boolean
  shouldShowHotService: boolean
  shouldShowBlogSection: boolean
  shouldShowRecommendProduct: boolean
  shouldShowReportPanel: boolean
  dropdownMenu: QuestionVuexState['question']['dropdownMenu']
  dropdownMenuStyle: CSSStyleDeclaration
}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.QuestionPage {
  display: flex;
  flex-direction: column;
  padding: 40px 0 60px;
  background: $primary-bg;

  @include max-media('xl') {
    padding: 0 0 90px;
  }

  &__row {
    display: flex;
    justify-content: center;

    @include max-media('xl') {
      flex-direction: column;
    }
  }

  &__column {
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

      .wrapper {
        width: inherit;

        &.fixed {
          position: fixed;
          bottom: 60px;
        }
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

.scrollToTop {
  position: fixed;
  bottom: 20px;
  right: 20px;

  &.hasProduct {
    bottom: 90px;
  }
}

.anchor {
  width: 0px;
  height: 0px;
}
</style>
