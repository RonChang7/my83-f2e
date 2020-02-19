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
        />
      </div>
      <BaseContent :content="answer.content" />
      <BaseMeta
        :like-count="answer.answer_meta.like_count"
        :dislike-count="answer.answer_meta.dislike_count"
        :answer-count="answer.answer_meta.response_count"
        :created-at="answer.created_at"
        meta-type="answer"
      />
      <AnswerInteraction @action="buttonActionHandler" />
      <ResponsesSection :responses="answer.responses" />
      <ResponseEditor
        v-if="displayResponsePanel"
        :avatar="avatar"
        :nickname="nickname"
        :has-response="!!answer.responses.length"
        :active-panel.sync="activeResponsePanel"
        :is-focus.sync="isResponsePanelFocus"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseAuthorInfo from './base/BaseAuthorInfo.vue'
import AnswerInteraction from './answer/AnswerInteraction.vue'
import { Type } from './answer/AnswerInteractionButton.vue'
import ResponsesSection from './ResponsesSection.vue'
import BaseContent from './base/BaseContent.vue'
import BaseMeta from './base/BaseMeta.vue'
import BaseHeaderFunction from './base/BaseHeaderFunction.vue'
import { AvatarMap } from './helpers/reply-default-avatar'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import { AnswerData } from '@/api/question/question.type'
import { User } from '@/services/user/user'
import { State } from '@/store/header/index'
const ResponseEditor = () => import('./response/ResponseEditor.vue')

const UserRole = User.role

export default {
  components: {
    BaseCard,
    BaseAuthorInfo,
    BaseContent,
    BaseMeta,
    AnswerInteraction,
    ResponsesSection,
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
  },
  data() {
    return {
      openEditor: false,
      activeResponsePanel: false,
      isResponsePanelFocus: false,
      avatar: AvatarMap[UserRole],
    }
  },
  computed: {
    nickname() {
      const { headerPersonalized } = this.$store.state.header as State
      return headerPersonalized ? headerPersonalized.personalize.nickname : ''
    },
    hasResponse() {
      return !!this.answer.responses.length
    },
    displayResponsePanel() {
      return this.openEditor || this.hasResponse
    },
  },
  methods: {
    buttonActionHandler(type) {
      switch (type) {
        case 'response':
          this.openResponsePanel()
          break
        default:
          break
      }
    },
    openResponsePanel() {
      this.openEditor = true
      this.activeResponsePanel = true
      this.isResponsePanelFocus = true
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
  avatar: string
}

export interface Methods {
  buttonActionHandler: (type: Type) => void
  openResponsePanel: () => void
}

export interface Computed {
  nickname: string
  hasResponse: boolean
  displayResponsePanel: boolean
}

export interface Props {
  answer: AnswerData
  shouldShowAnswerCount: boolean
  answerCount: number
  isBestAnswer: boolean
  isQuestionAuthor: boolean
  questionId: number
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

  &__title {
    display: flex;
    align-items: center;
    color: $gray-primary;
    height: 50px;
    border-bottom: 1px solid $gray-quaternary;
    padding: 0 30px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    margin: 30px 0 15px;
  }

  &__bestAnswer {
    display: flex;
    align-items: center;
    font-weight: 500;
    height: 50px;
    background: #ffeadf;
    color: $primary-color;
    margin: 0 -28px;
    padding: 0 28px;
    border-radius: 2px 2px 0 0;
  }

  &__content {
    padding: 0 30px;

    &.bestAnswer {
      padding: 0 28px;
      border: 2px solid $primary-color;
      border-radius: $border-radius;
    }
  }
}
</style>
