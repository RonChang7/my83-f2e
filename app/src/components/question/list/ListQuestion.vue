<template>
  <div class="ListQuestion">
    <QuestionAuthorInfo :avatar="avatar" :name="author" :target="targetTag" />

    <div class="ListQuestion__row">
      <div class="ListQuestion__content">
        <GlobalLink class="ListQuestion__content__link" :to="`/question/${id}`">
          <QuestionTitle
            class="ListQuestion__content__title"
            :text="subject"
            type="list"
          />
          <ListQuestionContent
            class="ListQuestion__content__abstract"
            :content="content"
          />
        </GlobalLink>
        <QuestionTags v-if="tags.length" :tags="tags" icon-type="tag" />
        <QuestionTags
          v-if="companies.length"
          :tags="companies"
          icon-type="company"
        />
      </div>
      <GlobalLink :to="`/question/${id}`">
        <ListQuestionImage
          v-if="image"
          :image-url="image"
          :image-alt="`question_${id}`"
        />
      </GlobalLink>
    </div>

    <ContentMeta
      :created-at="createdAt"
      :answer-count="answerCount"
      meta-type="question"
    />
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import ContentMeta from '../base/ContentMeta.vue'
import QuestionAuthorInfo from '../question/QuestionAuthorInfo.vue'
import QuestionTitle from '../question/QuestionTitle.vue'
import QuestionTags from '../question/QuestionTags.vue'
import ListQuestionContent from './ListQuestionContent.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { QuestionListData } from '@/api/question/list.type'
import { AuthorInfo, QuestionMeta } from '@/api/question/question.type'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'
const ListQuestionImage = () => import('./ListQuestionImage.vue')

const options: ComponentOption = {
  mixins: [DeviceMixin],
  components: {
    ContentMeta,
    QuestionAuthorInfo,
    QuestionTitle,
    QuestionTags,
    ListQuestionContent,
    ListQuestionImage,
    GlobalLink,
  },
  props: {
    question: {
      type: Object as PropType<Props['question']>,
      required: true,
    },
  },
  computed: {
    id() {
      return this.question.question_id
    },
    subject() {
      return this.question.subject
    },
    content() {
      return this.question.content
    },
    avatar() {
      return this.question.author_info.avatar_url
    },
    author() {
      return (
        this.question.author_info.nickname || this.question.author_info.username
      )
    },
    targetTag() {
      return this.question.target_tag || {}
    },
    image() {
      return this.question.images.length ? this.question.images[0] : ''
    },
    tags() {
      const originTagsCount = this.question.tags.length
      const cutPoint = this.isMobile
        ? this.image
          ? 5
          : 7
        : this.image
        ? 13
        : 15
      const tags = _.cloneDeep(this.question.tags.slice(0, cutPoint))
      if (originTagsCount > cutPoint) {
        tags[cutPoint - 1].name += ' ...'
      }
      return tags
    },
    companies() {
      return this.question.companies
    },
    answerCount() {
      return this.question.question_meta.answer_count
    },
    createdAt() {
      return this.question.created_at
    },
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
    Omit<DeviceMixinComponentInstance, keyof Vue> {}

export interface Data {}

export interface Methods {}

export interface Computed {
  id: QuestionListData['question_id']
  subject: QuestionListData['subject']
  content: QuestionListData['content']
  avatar: AuthorInfo['avatar_url']
  author: AuthorInfo['nickname']
  targetTag: QuestionListData['target_tag']
  image: string
  tags: QuestionListData['tags']
  companies: QuestionListData['companies']
  answerCount: QuestionMeta['answer_count']
  createdAt: QuestionListData['created_at']
}

export interface Props {
  question: QuestionListData
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.ListQuestion {
  padding: 25px 0;

  &:not(:last-child) {
    border-bottom: 1px solid $gray-quaternary;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__content {
    $self: &;

    flex: 1 1 100%;
    margin-right: 20px;

    &__link {
      @include hover-supported {
        &::v-deep #{$self}__title,
        &::v-deep #{$self}__abstract {
          transition: 0.3s;
        }

        &:hover {
          &::v-deep #{$self}__title {
            color: $primary-color;
          }

          &::v-deep #{$self}__abstract {
            color: $gray-primary;
          }
        }
      }
    }
  }
}
</style>
