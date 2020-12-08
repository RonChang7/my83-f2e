<template>
  <div class="QuestionTags">
    <div v-if="iconName" class="QuestionTags__icon">
      <component :is="iconName" />
    </div>
    <div class="QuestionTags__tag">
      <template v-for="tag in tags">
        <GlobalLink :key="tag.id" :to="tag.link.path">
          <QuestionTag :text="tag.name" />
        </GlobalLink>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import QuestionTag from './QuestionTag.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { Tag } from '@/api/question/question.type'
import BaseCompany from '@/components/base/icon/24/BaseCompany.svg'
import BaseTag from '@/components/base/icon/24/BaseTag.svg'

export default {
  components: {
    GlobalLink,
    QuestionTag,
    BaseCompany,
    BaseTag,
  },
  props: {
    iconType: {
      type: String,
      default: '',
    },
    tags: {
      type: Array as PropType<Props['tags']>,
      required: true,
    },
  },
  computed: {
    iconName() {
      switch (this.iconType) {
        case 'tag':
          return 'BaseTag'
        case 'company':
          return 'BaseCompany'
        default:
          return null
      }
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

export interface Data {}

export type Methods = {}

export interface Computed {
  iconName: string | null
}

export interface Props {
  iconType: 'tag' | 'company' | ''
  tags: Tag[]
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.QuestionTags {
  display: flex;
  margin-bottom: 6px;

  a::v-deep {
    &:not(:last-child):after {
      content: '|';
      display: inline-block;
      margin: 0 6px;
      color: $secondary-color;
      font-size: 0.875rem;
      font-weight: 500;
    }
  }

  &__icon {
    margin-right: 6px;
  }
}
</style>
