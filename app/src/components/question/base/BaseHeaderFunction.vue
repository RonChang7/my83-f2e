<template>
  <div class="BaseHeaderFunction">
    <BaseButton
      v-if="shouldShowEditButton"
      size="s"
      type="secondary"
      @click.native="editPost"
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
      {{ BestAnswerButtonText }}
    </BaseButton>
    <BaseButton
      v-if="shouldShowConsultSalesButton"
      size="s"
      type="secondary"
      @click.native="consultSales"
    >
      免費諮詢
    </BaseButton>
    <BaseMore v-if="shouldShowMoreButton" class="BaseHeaderFunction__more" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import {
  AuthorInfo,
  QuestionPersonalize,
  AnswerPersonalize,
} from '@/api/question/question.type'
import { User, Role } from '@/services/user/user'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseMore from '@/components/base/icon/24/BaseMore.vue'
import {
  FOLLOW_QUESTION,
  UNFOLLOW_QUESTION,
  SET_QUESTION_BEST_ANSWER,
  UNSET_QUESTION_BEST_ANSWER,
} from '@/store/question/question.type'
import { PostType } from '@/services/question/post-template-factory'

enum RoleMap {
  guest = -1,
  client = 0,
  sales = 1,
  admin = 2,
}

export default {
  components: {
    BaseButton,
    BaseMore,
  },
  props: {
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
      userRole: User.role,
      isMounted: false,
      temporarilyFollowStatus: null,
      state: {
        setBestAnswer: '',
      },
    }
  },
  computed: {
    sectionAuthorRole() {
      return RoleMap[this.authorInfo.role]
    },
    anchorString() {
      return `${this.sectionType}-${this.sectionId}`
    },
    shouldShowEditButton() {
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
    BestAnswerButtonText() {
      if (this.sectionType === 'answer') {
        return this.isBestAnswer ? '取消最佳留言' : '設為最佳留言'
      }

      return ''
    },
    shouldShowConsultSalesButton() {
      return (
        this.sectionType !== 'question' &&
        this.sectionAuthorRole === 'sales' &&
        this.userRole !== 'sales'
      )
    },
    shouldShowMoreButton() {
      if (!this.isMounted) return false

      return this.sectionType !== 'response'
    },
  },
  methods: {
    editPost() {
      // @todo: Change path after migrate to Nuxt.js
      window.location.href = `/question/asking/${this.sectionId}`
    },
    async followQuestion() {
      this.temporarilyFollowStatus = !(this.personalize as QuestionPersonalize)
        .is_follower

      if (this.temporarilyFollowStatus) {
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
    consultSales() {
      // @todo: Change path after migrate to Nuxt.js
      const path = `/message/nicknameSales/nickname/${this.authorInfo.nickname}`
      const query = {
        content: `你好,\n\n我有看到你的留言\n${window.location.href}#${this.anchorString}`,
        source: 'forum',
      }
      window.location.href = `${path}?content=${query.content}&source=${query.source}`
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

export interface Instance extends Vue {}

export interface Data {
  userRole: Role
  isMounted: boolean
  temporarilyFollowStatus: boolean | null
  state: {
    setBestAnswer: string
  }
}

export interface Methods {
  consultSales: () => void
}

export interface Computed {
  sectionAuthorRole: Role
  anchorString: string
  shouldShowEditButton: boolean
  shouldShowFollowButton: boolean
  followButtonText: string
  shouldShowBestAnswerButton: boolean
  BestAnswerButtonText: string
  shouldShowConsultSalesButton: boolean
  shouldShowMoreButton: boolean
}

export interface Props {
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
.BaseHeaderFunction {
  display: flex;

  &::v-deep button {
    margin-left: 10px;
  }

  &__more {
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
