<template>
  <div class="BaseHeaderFunction" :class="{ [`${sectionType}`]: true }">
    <BaseButton
      v-if="shouldShowEditButton"
      size="s"
      type="secondary"
      :to="{ name: 'questionAsking', params: { id: sectionId } }"
    >
      編輯
    </BaseButton>
    <BaseButton
      v-if="shouldShowFollowButton"
      size="s"
      type="secondary"
      :class="{ active: followButtonText === '追蹤中' }"
      @click.native="followQuestion"
    >
      {{ followButtonText }}
    </BaseButton>
    <BaseButton
      v-if="shouldShowBestAnswerButton"
      size="s"
      type="secondary"
      :state="state.setBestAnswer"
      @click.native="setBestAnswer"
    >
      {{ bestAnswerButtonText }}
    </BaseButton>
    <BaseButton
      v-if="shouldShowConsultSalesButton"
      size="s"
      type="secondary"
      :to="consultSalesUrl"
    >
      免費諮詢
    </BaseButton>
    <div
      v-if="shouldShowMoreButton"
      ref="more"
      class="BaseHeaderFunction__more"
      @click="showDropdownPanel"
    >
      <BaseMore />
    </div>
  </div>
</template>

<script lang="ts">
import _, { DebouncedFunc } from 'lodash'
import qs from 'qs'
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import {
  AuthorInfo,
  QuestionPersonalize,
  AnswerPersonalize,
} from '@/api/question/question.type'
import { UserRole } from '@/services/auth/auth'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseMore from '@/assets/icon/24/BaseMore.svg'
import {
  FOLLOW_QUESTION,
  UNFOLLOW_QUESTION,
  SET_QUESTION_BEST_ANSWER,
  UNSET_QUESTION_BEST_ANSWER,
  UPDATE_QUESTION_DROPDOWN_MENU_STATUS,
  OPEN_REPORT_PANEL,
  CANCEL_REPORT,
} from '@/store/question/question.type'
import {
  UPDATE_GLOBAL_DIALOG,
  OPEN_GLOBAL_DIALOG,
  CLOSE_GLOBAL_DIALOG,
} from '@/store/global/global.type'
import {
  DropdownMenu,
  DropdownMenuOption,
  Report,
} from '@/store/question/question'
import { GlobalDialogContent } from '@/store/global/index'
import { SimpleResponse } from '@/api/type'
import { PostType } from '../helpers/type'
import { CancelReportDialogContent } from '../report/cancel-report-dialog-info'

export default {
  components: {
    BaseButton,
    BaseMore,
  },
  props: {
    userRole: {
      type: String,
      required: true,
    },
    sectionType: {
      type: String,
      required: true,
    },
    sectionId: {
      type: Number,
      required: true,
    },
    authorInfo: {
      type: Object,
      required: true,
    },
    personalize: {
      type: Object,
      default: () => {},
    },
    isBestAnswer: {
      type: Boolean,
      default: false,
    },
    isQuestionAuthor: {
      type: Boolean,
      default: false,
    },
    questionId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isMounted: false,
      temporarilyFollowStatus: null,
      state: {
        setBestAnswer: '',
      },
    }
  },
  computed: {
    sectionAuthorRole() {
      return this.authorInfo.role
    },
    anchorString() {
      return `${this.sectionType}-${this.sectionId}`
    },
    shouldShowEditButton() {
      if (!this.isMounted) return false

      return this.sectionType === 'question' && this.personalize.is_owner
    },
    shouldShowFollowButton() {
      if (!this.isMounted) return false

      return this.sectionType === 'question' && this.userRole === 'sales'
    },
    followButtonText() {
      if (this.sectionType === 'question') {
        const status =
          this.temporarilyFollowStatus !== null
            ? this.temporarilyFollowStatus
            : (this.personalize as QuestionPersonalize).is_follower

        return status ? '追蹤中' : '追蹤'
      }

      return ''
    },
    shouldShowBestAnswerButton() {
      /**
       * 區塊是 Answer 且是 Question 的作者，但是不能是 Answer 的作者
       * 避免業務員自問自答，將自己的回答設定成最佳解答
       */
      return (
        this.sectionType === 'answer' &&
        this.isQuestionAuthor &&
        !this.personalize.is_owner
      )
    },
    bestAnswerButtonText() {
      if (this.sectionType === 'answer') {
        return this.isBestAnswer ? '取消最佳留言' : '設為最佳留言'
      }

      return ''
    },
    shouldShowConsultSalesButton() {
      if (!this.isMounted) return false

      return (
        this.sectionAuthorRole === 'sales' &&
        this.authorInfo.role_meta!.is_verified &&
        this.userRole !== 'sales'
      )
    },
    shouldShowMoreButton() {
      return this.sectionType !== 'response'
    },
    consultSalesUrl() {
      const path = this.authorInfo.nickname
        ? `/message/nicknameSales/nickname/${encodeURIComponent(
            this.authorInfo.nickname
          )}`
        : `/user/${this.authorInfo.id}`
      const query = {
        content: `你好,\n\n我有看到你的留言\n${this.$env.HOST_URL}${this.$route.path}#${this.anchorString}\n`,
        source: 'forum',
      }
      return `${path}?${qs.stringify(query)}`
    },
  },
  methods: {
    followQuestion() {
      this.temporarilyFollowStatus =
        this.temporarilyFollowStatus === null
          ? !(this.personalize as QuestionPersonalize).is_follower
          : !this.temporarilyFollowStatus

      this.updateFollowQuestionState(this.temporarilyFollowStatus)
    },
    updateFollowQuestionState: _.debounce(async function (state) {
      if (state === (this.personalize as QuestionPersonalize).is_follower) {
        this.resetTempState()
        return
      }

      if (state) {
        await this.$store.dispatch(
          `question/${FOLLOW_QUESTION}`,
          this.sectionId
        )
      } else {
        await this.$store.dispatch(
          `question/${UNFOLLOW_QUESTION}`,
          this.sectionId
        )
      }

      this.resetTempState()
    }, 2000),
    resetTempState() {
      this.temporarilyFollowStatus = null
    },
    async setBestAnswer() {
      const state = !this.isBestAnswer
      this.state.setBestAnswer = 'loading'

      if (state) {
        await this.$store.dispatch(`question/${SET_QUESTION_BEST_ANSWER}`, {
          questionId: this.questionId,
          answerId: this.sectionId,
        })
      } else {
        await this.$store.dispatch(
          `question/${UNSET_QUESTION_BEST_ANSWER}`,
          this.questionId
        )
      }

      this.state.setBestAnswer = ''
    },
    showDropdownPanel() {
      const el = this.$refs.more
      const paddingTop = 8
      const paddingLeft = 140

      const payload: DropdownMenu = {
        visible: true,
        top: el.offsetTop + el.clientHeight + paddingTop,
        left: el.offsetLeft + el.clientWidth - paddingLeft,
        options: this.dropdownMenuOptions(),
      }

      this.$store.dispatch(
        `question/${UPDATE_QUESTION_DROPDOWN_MENU_STATUS}`,
        payload
      )
    },
    reportOption() {
      const reportText = this.personalize.is_reporter ? '取消檢舉' : '檢舉'
      const questionId =
        this.sectionType === 'question' ? this.sectionId : this.questionId
      const answerId =
        this.sectionType === 'answer' ? this.sectionId : undefined
      let payload = {}
      let action: Function

      if (this.personalize.is_reporter) {
        payload = {
          ...CancelReportDialogContent,
          rightButtonCloseDialogAfterClick: false,
          rightConfirmFn: async () => {
            const result = await this.$store.dispatch(
              `question/${CANCEL_REPORT}`,
              {
                questionId,
                answerId,
              }
            )

            if (typeof result === 'boolean' && result) {
              this.$store.dispatch(`global/${CLOSE_GLOBAL_DIALOG}`)
            } else {
              this.$store.dispatch(`global/${UPDATE_GLOBAL_DIALOG}`, {
                ...payload,
                errMsg: (result as SimpleResponse).message,
              })
            }
          },
        } as GlobalDialogContent

        action = () => {
          this.$store.dispatch(`global/${UPDATE_GLOBAL_DIALOG}`, payload)
          this.$store.dispatch(`global/${OPEN_GLOBAL_DIALOG}`)
        }
      } else {
        payload = {
          visible: true,
          questionId,
          answerId,
        } as Report

        action = () => {
          this.$store.dispatch(`question/${OPEN_REPORT_PANEL}`, payload)
        }
      }

      return {
        title: reportText,
        action,
      }
    },
    dropdownMenuOptions() {
      return [this.reportOption()]
    },
  },
  mounted() {
    this.isMounted = true
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
  $refs: {
    more: HTMLElement
  }
}

export interface Data {
  isMounted: boolean
  temporarilyFollowStatus: boolean | null
  state: {
    setBestAnswer: string
  }
}

export type Methods = {
  updateFollowQuestionState: DebouncedFunc<
    (this: ComponentInstance, state: boolean) => Promise<void>
  >
  followQuestion(): void
  resetTempState(): void
  setBestAnswer(): void
  showDropdownPanel(): void
  reportOption(): DropdownMenuOption
  dropdownMenuOptions(): DropdownMenuOption[]
}

export interface Computed {
  sectionAuthorRole: UserRole
  anchorString: string
  shouldShowEditButton: boolean
  shouldShowFollowButton: boolean
  followButtonText: string
  shouldShowBestAnswerButton: boolean
  bestAnswerButtonText: string
  shouldShowConsultSalesButton: boolean
  shouldShowMoreButton: boolean
  consultSalesUrl: string
}

export interface Props {
  userRole: UserRole
  sectionType: PostType
  sectionId: number
  authorInfo: AuthorInfo
  personalize: QuestionPersonalize | AnswerPersonalize
  isBestAnswer: boolean
  isQuestionAuthor: boolean
  questionId: number
}
</script>

<style lang="scss" scoped>
@import '@/sass/rwd.scss';

.BaseHeaderFunction {
  display: flex;
  flex: 0 0 auto;

  @include max-media('sm') {
    justify-content: flex-end;

    &.question {
      margin-top: 0;
    }

    &.answer {
      margin-top: 10px;
    }
  }

  @include max-media('xs') {
    &.response {
      margin-top: 10px;
    }
  }

  &::v-deep [type='button'] {
    margin-left: 10px;
  }

  &__more {
    width: 24px;
    height: 24px;
    margin-left: 10px;
    cursor: pointer;
  }

  &__dropdownPanel {
    position: absolute;
    margin-top: 32px;
    margin-left: -106px;
  }
}
</style>
