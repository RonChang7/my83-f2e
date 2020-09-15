<template>
  <div class="QuestionSection">
    <div class="QuestionSection__header">
      <QuestionAuthorInfo :avatar="avatar" :name="author" :target="targetTag" />
      <BaseHeaderFunction
        section-type="question"
        :section-id="id"
        :author-info="authorInfo"
        :personalize="personalize"
        :user-role="userRole"
      />
    </div>
    <QuestionTitle type="h1" :text="subject" />
    <BaseContent :content="content" />
    <QuestionImages v-if="images.length" :images="images" />
    <QuestionTags v-if="tags.length" :tags="tags" icon-type="tag" />
    <QuestionTags
      v-if="companies.length"
      :tags="companies"
      icon-type="company"
    />
    <ContentMeta
      :created-at="createdAt"
      :answer-count="answerCount"
      meta-type="question"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import QuestionAuthorInfo from '../question/QuestionAuthorInfo.vue'
import QuestionTitle from '../question/QuestionTitle.vue'
import BaseContent from '../base/BaseContent.vue'
import ContentMeta from '../base/ContentMeta.vue'
import BaseHeaderFunction from '../base/BaseHeaderFunction.vue'
import QuestionTags from '../question/QuestionTags.vue'
import { QuestionVuexState } from '@/views/question/page/Index.vue'
import {
  QuestionData,
  AuthorInfo,
  QuestionMeta,
} from '@/api/question/question.type'
import { textToUrl } from '@/utils/text-parser'
import UserMetaMixin, {
  ComponentInstance as UserMetaMixinComponentInstance,
} from '@/mixins/user/user-meta'
const QuestionImages = () => import('../question/QuestionImages.vue')

export default {
  components: {
    QuestionAuthorInfo,
    QuestionTitle,
    BaseContent,
    QuestionImages,
    QuestionTags,
    ContentMeta,
    BaseHeaderFunction,
  },
  mixins: [UserMetaMixin],
  computed: {
    id() {
      return this.$store.state.question.question?.question_id
    },
    subject() {
      return this.$store.state.question.question?.subject
    },
    content() {
      // TODO: 之後 question 後端移除 HTML tag 之後要另外處理
      const content = this.$store.state.question.question?.content
      return content ? textToUrl(content) : ''
    },
    avatar() {
      return this.$store.state.question.question?.author_info.avatar_url
    },
    author() {
      return (
        this.$store.state.question.question?.author_info.nickname ||
        this.$store.state.question.question?.author_info.username
      )
    },
    authorInfo() {
      return this.$store.state.question.question?.author_info || {}
    },
    personalize() {
      return this.$store.state.question.question?.personalize || {}
    },
    targetTag() {
      return this.$store.state.question.question?.target_tag || {}
    },
    images() {
      return this.$store.state.question.question?.images
    },
    tags() {
      return this.$store.state.question.question?.tags
    },
    companies() {
      return this.$store.state.question.question?.companies
    },
    answerCount() {
      return this.$store.state.question.question?.question_meta.answer_count
    },
    createdAt() {
      return this.$store.state.question.question?.created_at
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

export interface Instance
  extends Vue,
    Omit<UserMetaMixinComponentInstance, keyof Vue> {
  $store: Store<QuestionVuexState>
}

export interface Data {}

export interface Methods {}

export interface Computed {
  id: QuestionData['question_id']
  subject: QuestionData['subject']
  content: QuestionData['content']
  avatar: AuthorInfo['avatar_url']
  author: AuthorInfo['nickname']
  authorInfo: AuthorInfo
  personalize: QuestionData['personalize']
  targetTag: QuestionData['target_tag']
  images: QuestionData['images']
  tags: QuestionData['tags']
  companies: QuestionData['companies']
  answerCount: QuestionMeta['answer_count']
  createdAt: QuestionData['created_at']
}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.QuestionSection {
  @include card-primary;

  flex: 0 0 auto;
  padding: 30px;
  margin-bottom: 20px;

  @include max-media('xl') {
    @include card-secondary;

    padding: 20px;
    margin-bottom: 10px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
