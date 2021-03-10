<template>
  <div :id="`answer-${answer.answer_id}`" class="AnswerSection">
    <div v-if="shouldShowAnswerCount" class="AnswerSection__title">
      共 {{ answerCount }} 則留言
    </div>
    <div class="AnswerSection__content" :class="{ bestAnswer: isBestAnswer }">
      <div v-if="isBestAnswer" class="AnswerSection__bestAnswer">最佳留言</div>
      <div class="AnswerSection__header">
        <BaseAuthorInfo :author-info="answer.author_info" />
        <BaseHeaderFunction
          section-type="answer"
          :section-id="answer.answer_id"
          :author-info="answer.author_info"
          :personalize="answer.personalize"
          :is-best-answer="isBestAnswer"
          :is-question-author="isQuestionAuthor"
          :question-id="questionId"
          :user-role="userRole"
        />
      </div>
      <BaseContent :content="answer.content" />
      <ContentMeta :created-at="answer.created_at" meta-type="answer" />
      <AnswerInteraction
        :like-count="likeCount"
        :dislike-count="dislikeCount"
        :response-count="answer.answer_meta.response_count"
        :like-status="likeStatus"
        @action="buttonActionHandler"
      />
      <ResponsesListSection
        :responses="answer.responses"
        :user-role="userRole"
      />
      <ResponseEditor
        v-if="displayResponsePanel"
        :avatar="avatar"
        :nickname="nickname"
        :has-response="!!answer.responses.length"
        :active-panel.sync="activeResponsePanel"
        :is-focus.sync="isResponsePanelFocus"
        :question-id="questionId"
        :answer-id="answer.answer_id"
        :is-dislike-response.sync="isDislikeResponse"
        @add-dislike-response="toggleLikeStatus(-1)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import _, { DebouncedFunc } from 'lodash'
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { AnswerData, LikeStatus } from '@/api/question/question.type'
import { UserRole } from '@/services/auth/auth'
import { SET_LIKE_STATUS } from '@/store/question/question.type'
import {
  OPEN_GLOBAL_DIALOG,
  OPEN_LOGIN_PANEL,
  UPDATE_AFTER_LOGIN_EVENT,
  UPDATE_GLOBAL_DIALOG,
} from '@/store/global/global.type'
import { GlobalDialogContent } from '@/store/global'
import { AvatarMap } from '../helpers/reply-default-avatar'
import ResponsesListSection from '../section/ResponsesListSection.vue'
import BaseContent from '../base/BaseContent.vue'
import ContentMeta from '../base/ContentMeta.vue'
import BaseHeaderFunction from '../base/BaseHeaderFunction.vue'
import BaseAuthorInfo from '../base/BaseAuthorInfo.vue'
import AnswerInteraction from './AnswerInteraction.vue'
import { Type } from './AnswerInteractionButton.vue'
import { CancelDislikeDialogContent } from './cancel-dislike-dialog-info'
const ResponseEditor = () => import('../response/ResponseEditor.vue')

export default {
  components: {
    BaseAuthorInfo,
    BaseContent,
    ContentMeta,
    AnswerInteraction,
    ResponsesListSection,
    ResponseEditor,
    BaseHeaderFunction,
  },
  props: {
    answer: {
      type: Object,
      required: true,
    },
    shouldShowAnswerCount: {
      type: Boolean,
      default: false,
    },
    answerCount: {
      type: Number,
      default: 0,
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
    userRole: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      openEditor: false,
      activeResponsePanel: false,
      isResponsePanelFocus: false,
      isDislikeResponse: false,
      temporarilyLikeCount: null,
      temporarilyDislikeCount: null,
      temporarilyLikeStatus: null,
    }
  },
  computed: {
    hasResponse() {
      return !!this.answer.responses.length
    },
    displayResponsePanel() {
      return this.openEditor || this.hasResponse
    },
    likeCount() {
      return this.temporarilyLikeCount !== null
        ? this.temporarilyLikeCount
        : this.answer.answer_meta.like_count
    },
    dislikeCount() {
      return this.temporarilyDislikeCount !== null
        ? this.temporarilyDislikeCount
        : this.answer.answer_meta.dislike_count
    },
    likeStatus() {
      return this.temporarilyLikeStatus !== null
        ? this.temporarilyLikeStatus
        : this.answer.personalize!.like_status
    },
    avatar() {
      return AvatarMap[this.userRole]
        ? `${this.$imageBucketUrl}/${AvatarMap[this.userRole]}`
        : ''
    },
  },
  methods: {
    showLoginPanel() {
      this.$store.dispatch(`global/${OPEN_LOGIN_PANEL}`, 'login')
      this.$store.dispatch(`global/${UPDATE_AFTER_LOGIN_EVENT}`, () => {
        window.location.reload()
      })
    },
    buttonActionHandler(type) {
      if (!this.$auth.isLogin) {
        this.showLoginPanel()
        return
      }

      switch (type) {
        case 'response':
          this.isDislikeResponse = false
          this.openResponsePanel()
          break
        case 'like':
          this.likeStatus === -1
            ? this.cancelDislike(type)
            : this.toggleLikeStatus(LikeStatus.LIKE)
          break
        case 'dislike':
          this.likeStatus === -1
            ? this.cancelDislike(type)
            : (() => {
                this.isDislikeResponse = true
                this.openResponsePanel()
              })()
          break
      }
    },
    cancelDislike(type) {
      const likeStatus = type === 'like' ? LikeStatus.LIKE : LikeStatus.DISLIKE

      const payload: GlobalDialogContent = {
        ...CancelDislikeDialogContent,
        rightConfirmFn: () => this.toggleLikeStatus(likeStatus),
      }

      this.$store.dispatch(`global/${UPDATE_GLOBAL_DIALOG}`, payload)
      this.$store.dispatch(`global/${OPEN_GLOBAL_DIALOG}`)
    },
    openResponsePanel() {
      this.openEditor = true
      this.activeResponsePanel = true
      this.isResponsePanelFocus = true
    },
    toggleLikeStatus(status) {
      this.temporarilyLikeStatus =
        this.temporarilyLikeStatus === null
          ? this.answer.personalize!.like_status
          : this.temporarilyLikeStatus

      this.temporarilyLikeCount =
        this.temporarilyLikeCount === null
          ? this.answer.answer_meta.like_count
          : this.temporarilyLikeCount

      this.temporarilyDislikeCount =
        this.temporarilyDislikeCount === null
          ? this.answer.answer_meta.dislike_count
          : this.temporarilyDislikeCount

      const likeStatus = status === this.temporarilyLikeStatus ? 0 : status

      if (status === 1) {
        this.temporarilyLikeCount += likeStatus === status ? 1 : -1
      }
      if (status === -1) {
        this.temporarilyDislikeCount += likeStatus === status ? 1 : -1
      }
      if (status + this.temporarilyLikeStatus === 0) {
        if (status === 1) {
          this.temporarilyDislikeCount -= 1
        }
        if (status === -1) {
          this.temporarilyLikeCount -= 1
        }
      }

      this.temporarilyLikeStatus = likeStatus
      this.updateLikeStatus(likeStatus)
    },
    updateLikeStatus: _.debounce(async function (status) {
      if (status === this.answer.personalize!.like_status) {
        this.resetTempState()
        return
      }

      await this.$store.dispatch(`question/${SET_LIKE_STATUS}`, {
        questionId: this.questionId,
        answerId: this.answer.answer_id,
        likeStatus: status,
      })

      this.resetTempState()
    }, 2000),
    resetTempState() {
      this.temporarilyLikeCount = null
      this.temporarilyDislikeCount = null
      this.temporarilyLikeStatus = null
    },
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
  openEditor: boolean
  activeResponsePanel: boolean
  isResponsePanelFocus: boolean
  isDislikeResponse: boolean
  temporarilyLikeCount: number | null
  temporarilyDislikeCount: number | null
  temporarilyLikeStatus: number | null
}

export type Methods = {
  updateLikeStatus: DebouncedFunc<
    (this: ComponentInstance, status: LikeStatus) => Promise<void>
  >
  showLoginPanel(): void
  buttonActionHandler(type: Type): void
  cancelDislike(type: Exclude<Type, 'response'>): void
  openResponsePanel(): void
  toggleLikeStatus(status: LikeStatus): void
  resetTempState(): void
}

export interface Computed {
  hasResponse: boolean
  displayResponsePanel: boolean
  likeCount: number
  dislikeCount: number
  likeStatus: number
  avatar: string
}

export interface Props {
  answer: AnswerData
  shouldShowAnswerCount: boolean
  answerCount: number
  isBestAnswer: boolean
  isQuestionAuthor: boolean
  questionId: number
  userRole: UserRole
  nickname: string
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.AnswerSection {
  @include card-primary;

  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  @include max-media('xl') {
    @include card-secondary;
    margin-bottom: 10px;
  }

  &__title {
    display: flex;
    align-items: center;
    color: $gray-primary;
    height: 50px;
    border-bottom: 1px solid $gray-quaternary;
    padding: 0 30px;

    @include max-media('xl') {
      height: 36px;
      color: $text-default-color;
      padding: 0 20px;
      border-bottom: 4px solid $primary-bg;
      font-size: 0.875rem;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    margin: 30px 0 15px;

    @include max-media('xl') {
      margin: 20px 0 12px;
    }

    @include max-media('sm') {
      flex-direction: column;
    }
  }

  &__bestAnswer {
    display: flex;
    align-items: center;
    font-weight: 500;
    height: 50px;
    background: $primary-bright-color;
    color: $primary-color;
    margin: 0 -28px;
    padding: 0 28px;
    border-radius: 2px 2px 0 0;

    @include max-media('xl') {
      height: 36px;
      margin: 0 -18px;
      padding: 0 18px;
      border-radius: 0;
      font-size: 0.875rem;
    }
  }

  &__content {
    padding: 0 30px;

    &.bestAnswer {
      padding: 0 28px;
      border: 2px solid $primary-color;
      border-radius: $border-radius;
    }

    @include max-media('xl') {
      padding: 0 20px;

      &.bestAnswer {
        padding: 0 18px;
        border-radius: 0;
      }
    }
  }
}
</style>
