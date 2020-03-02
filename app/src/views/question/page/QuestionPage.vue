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
        <HotServiceSection v-if="!$ua.isFromPc() && shouldShowGuide" />

        <GuideSection v-if="!$ua.isFromPc() && shouldShowGuide" />

        <QuestionSection />

        <MobileRecommendProductSection
          v-if="!$ua.isFromPc() && shouldShowRecommendProduct"
        />

        <div
          ref="mobileRelatedSection"
          class="QuestionPage__mobileRelatedSection"
        >
          <RelatedQuestionSection v-if="!$ua.isFromPc()" :max-post="5" />

          <RelatedBlogSection
            v-if="!$ua.isFromPc() && shouldShowBlogSection"
            :max-post="5"
          />
        </div>

        <BaseScrollToTopButton
          v-if="!$ua.isFromPc() && shouldShowScrollToTop"
          class="scrollToTop"
          :class="{ hasProduct: shouldShowRecommendProduct }"
          @click.native="scrollToTop"
        />

        <client-only>
          <AddAnswerSection v-if="userRole === 'sales'" />
        </client-only>

        <AnswersSection />

        <client-only>
          <AddAnswerSection v-if="userRole !== 'sales'" />
        </client-only>
      </div>
      <div v-if="$ua.isFromPc()" class="QuestionPage__column right">
        <GuideSection v-if="shouldShowGuide" />
        <DesktopRecommendProductSection v-if="shouldShowRecommendProduct" />
        <RelatedQuestionSection />
        <RelatedBlogSection v-if="shouldShowBlogSection" />
      </div>
    </div>
    <div v-if="$ua.isFromPc()" class="QuestionPage__row">
      <HotServiceSection />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import QuestionSection from '@/components/question/QuestionSection.vue'
import AnswersSection from '@/components/question/AnswersSection.vue'
import AddAnswerSection from '@/components/question/AddAnswerSection.vue'
import GuideSection from '@/components/question/GuideSection.vue'
import HotServiceSection from '@/components/question/HotServiceSection.vue'
import RelatedQuestionSection from '@/components/question/RelatedQuestionSection.vue'
import RelatedBlogSection from '@/components/question/RelatedBlogSection.vue'
import BaseScrollToTopButton from '@/components/my83-ui-kit/button/BaseScrollToTopButton.vue'
import { User, Role } from '@/services/user/user'
import { State, DropdownMenu } from '@/store/question/index'
import { UPDATE_QUESTION_DROPDOWN_MENU_STATUS } from '@/store/question/question.type'
import { scrollTo } from '@/utils/element'
const DesktopRecommendProductSection = () =>
  import('@/components/question/DesktopRecommendProductSection.vue')
const MobileRecommendProductSection = () =>
  import('@/components/question/MobileRecommendProductSection.vue')
const QuestionDropdownPanel = () =>
  import('@/components/question/panel/QuestionDropdownPanel.vue')
const ReportPanel = () => import('@/components/question/report/ReportPanel.vue')

export default {
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
      userRole: User.role,
      isMounted: false,
      scrollToTopObserver: null,
      shouldShowScrollToTop: false,
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
        ;((this.$refs.dropdownPanel as Vue).$el as HTMLElement).focus()
        return
      }

      const payload: DropdownMenu = {
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
  },
  computed: {
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
      const { question } = this.$store.state.question as State
      const recommendProduct = question ? question.recommend_product : null

      if (!!recommendProduct && (process.server || !this.isMounted)) return true

      return this.userRole !== 'sales'
    },
    shouldShowReportPanel() {
      const { report } = this.$store.state.question as State
      return report.visible
    },
    dropdownMenu() {
      const { dropdownMenu } = this.$store.state.question as State
      return dropdownMenu
    },
    dropdownMenuStyle() {
      return {
        top: `${this.dropdownMenu.top}px`,
        left: `${this.dropdownMenu.left}px`,
      }
    },
  },
  mounted() {
    this.isMounted = true

    if (this.$route.hash) {
      this.scrollToAnchorPoint(this.$route.hash)
    }

    this.scrollToTopObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.shouldShowScrollToTop = entry.boundingClientRect.bottom <= 0
      })
    })

    this.scrollToTopObserver.observe(this.$refs.mobileRelatedSection as Element)
  },
  destroyed() {
    if (this.scrollToTopObserver) {
      ;(this.scrollToTopObserver as IntersectionObserver).disconnect()
      this.scrollToTopObserver = null
    }
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

export interface Instance extends Vue {}

export interface Data {
  userRole: Role
  isMounted: boolean
  scrollToTopObserver: IntersectionObserver | null
  shouldShowScrollToTop: boolean
}

export interface Methods {
  scrollToAnchorPoint: (anchor: string) => void
  hidePanel(): void
  scrollToTop(): void
}

export interface Computed {
  shouldShowGuide: boolean
  shouldShowHotService: boolean
  shouldShowBlogSection: boolean
  shouldShowRecommendProduct: boolean
  shouldShowReportPanel: boolean
  dropdownMenu: DropdownMenu
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

      @include max-media('xl') {
        width: 100%;
      }
    }

    &.right {
      width: 360px;
    }
  }
}

.scrollToTop {
  position: fixed;
  bottom: 20px;
  right: 20px;

  .hasProduct {
    bottom: 90px;
  }
}
</style>
