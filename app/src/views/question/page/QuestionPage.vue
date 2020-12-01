<template>
  <div class="QuestionPage" @click.capture="hideDropdownPanel">
    <QuestionDropdownPanel
      v-if="dropdownMenu.visible"
      ref="dropdownPanel"
      :style="dropdownMenuStyle"
      :visible="dropdownMenu.visible"
    />
    <ReportPanel
      v-if="shouldShowReportPanel"
      :visible="shouldShowReportPanel"
    />
    <div class="QuestionPage__row">
      <QuestionLayoutWithFixedColumn
        ref="fixedColumnLayout"
        :display-right-column="!isMobile"
      >
        <template v-slot:left>
          <HotServiceSection v-if="isMobile && shouldShowGuide" />

          <GuideSection v-if="isMobile && shouldShowGuide" />

          <QuestionSection />

          <client-only>
            <AddAnswerSection v-if="userRole === 'sales'" />
          </client-only>

          <div ref="mobileRecommendProductSection">
            <MobileRecommendProductSection
              v-if="isMobile && shouldShowRecommendProduct"
            />
          </div>

          <AnswersListSection />
        </template>
        <template v-slot:left-bottom-offset>
          <client-only>
            <AddAnswerSection
              v-if="userRole !== 'sales'"
              class="QuestionPage__clientAddAnswerSection"
            />
          </client-only>

          <RelatedQuestionSection v-if="isMobile" :max-post="5" />

          <RelatedBlogSection
            v-if="isMobile && shouldShowBlogSection"
            :max-post="5"
          />
        </template>
        <template v-slot:right>
          <GuideSection v-if="shouldShowGuide" />
          <DesktopRecommendProductSection v-if="shouldShowRecommendProduct" />
          <RelatedQuestionSection />
          <RelatedBlogSection v-if="shouldShowBlogSection" />
        </template>
      </QuestionLayoutWithFixedColumn>
    </div>
    <div v-if="!isMobile" class="QuestionPage__row">
      <HotServiceSection />
    </div>
    <BaseScrollToTopButton
      v-if="isMobile && shouldShowScrollToTop"
      class="scrollToTop"
      :class="{ hasProduct: shouldShowRecommendProduct }"
      @click="scrollToTop"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { QuestionVuexState } from './Index.vue'
import QuestionSection from '@/components/question/section/QuestionSection.vue'
import AnswersListSection from '@/components/question/section/AnswersListSection.vue'
import AddAnswerSection from '@/components/question/section/AddAnswerSection.vue'
import GuideSection from '@/components/question/section/GuideSection.vue'
import HotServiceSection from '@/components/question/section/HotServiceSection.vue'
import RelatedQuestionSection from '@/components/question/section/RelatedQuestionSection.vue'
import RelatedBlogSection from '@/components/question/section/RelatedBlogSection.vue'
import BaseScrollToTopButton from '@/components/my83-ui-kit/button/BaseScrollToTopButton.vue'
import DesktopRecommendProductSection from '@/components/question/section/DesktopRecommendProductSection.vue'
import MobileRecommendProductSection from '@/components/question/section/MobileRecommendProductSection.vue'
import QuestionLayoutWithFixedColumn, {
  ComponentInstance as QuestionLayoutWithFixedColumnComponentInstance,
} from '@/components/question/layout/QuestionLayoutWithFixedColumn.vue'
import { UserRole } from '@/store/user/index'
import { UPDATE_QUESTION_DROPDOWN_MENU_STATUS } from '@/store/question/question.type'
import { scrollToElement } from '@/utils/scroll'

import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'
import UserMetaMixin, {
  ComponentInstance as UserMetaMixinComponentInstance,
} from '@/mixins/user/user-meta'
const QuestionDropdownPanel = () =>
  import('@/components/question/panel/QuestionDropdownPanel.vue')
const ReportPanel = () => import('@/components/question/report/ReportPanel.vue')

export default {
  mixins: [DeviceMixin, UserMetaMixin],
  components: {
    QuestionSection,
    AnswersListSection,
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
    QuestionLayoutWithFixedColumn,
  },
  data() {
    return {
      isMounted: false,
      observer: {
        scrollToTopObserver: null,
      },
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
    hideDropdownPanel() {
      if (
        !this.$refs.dropdownPanel ||
        !this.$store.state.question.dropdownMenu.visible
      ) {
        return
      }

      const payload: QuestionVuexState['question']['dropdownMenu'] = {
        visible: false,
        top: null,
        left: null,
        options: [],
      }

      this.$store.dispatch(
        `question/${UPDATE_QUESTION_DROPDOWN_MENU_STATUS}`,
        payload
      )
    },
    scrollToTop() {
      const body = document.querySelector('body')
      scrollToElement({
        el: body!,
        vertical: true,
      })
    },
    createScrollToTopIntersectionObserver() {
      return new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          this.shouldShowScrollToTop = entry.boundingClientRect.bottom < 0
        })
      })
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
      const recommendProduct = this.$store.state.question.recommendProduct

      if (!!recommendProduct && (process.server || !this.isMounted)) return true

      return !!recommendProduct && this.userRole !== 'sales'
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
  mounted() {
    this.isMounted = true

    if (this.$route.hash) {
      this.scrollToAnchorPoint(this.$route.hash)
    }

    if (this.$refs.mobileRecommendProductSection) {
      this.observer.scrollToTopObserver = this.createScrollToTopIntersectionObserver()
      this.observer.scrollToTopObserver.observe(
        this.$refs.mobileRecommendProductSection
      )
    }
  },
  watch: {
    userRole(val: UserRole) {
      // 登入角色如果為業務員，重新計算右側 column 高度
      if (val === 'sales') {
        this.$nextTick(() => {
          this.$refs.fixedColumnLayout.calcRightColumnHeight()
        })
      }
    },
    '$store.state.question.answers'() {
      this.$nextTick(() => {
        this.$refs.fixedColumnLayout.getScrollHeightBottom()
      })
    },
  },
  beforeDestroy() {
    if (this.observer.scrollToTopObserver) {
      this.observer.scrollToTopObserver.disconnect()
      this.observer.scrollToTopObserver = null
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

export interface Instance
  extends Vue,
    Omit<DeviceMixinComponentInstance, keyof Vue>,
    Omit<UserMetaMixinComponentInstance, keyof Vue> {
  $store: Store<QuestionVuexState>
  $refs: {
    dropdownPanel: Vue
    mobileRecommendProductSection: Element
    fixedColumnLayout: QuestionLayoutWithFixedColumnComponentInstance
  }
}

export interface Data {
  isMounted: boolean
  observer: {
    scrollToTopObserver: IntersectionObserver | null
  }
  shouldShowScrollToTop: boolean
}

export type Methods = {
  scrollToAnchorPoint(anchor: string): void
  hideDropdownPanel(): void
  scrollToTop(): void
  createScrollToTopIntersectionObserver(): IntersectionObserver
}

export interface Computed {
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

  &__clientAddAnswerSection {
    padding-bottom: 10px;
  }
}

::v-deep .scrollToTop {
  position: fixed;
  bottom: 20px;
  right: 20px;

  &.hasProduct {
    bottom: 90px;
  }
}
</style>
