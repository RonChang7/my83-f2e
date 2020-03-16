<template>
  <div class="QuestionAuthorInfo">
    <div class="QuestionAuthorInfo__avatar">
      <BaseLazyImage
        :image-url="avatar"
        :image-alt="name"
        :image-loaded-style="avatarStyle"
      />
    </div>
    {{ name }}
    <span v-if="!checkItemEmpty(target)">·</span>
    <GlobalLink v-if="!checkItemEmpty(target)" :to="target.link.path">
      {{ target.name }}
    </GlobalLink>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Tag } from '@/api/question/question.type'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseLazyImage from '@/components/base/lazy-load-image/BaseLazyImage.vue'

export default {
  components: {
    GlobalLink,
    BaseLazyImage,
  },
  props: {
    avatar: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    target: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      avatarStyle: {
        borderRadius: '50%',
      },
    }
  },
  methods: {
    checkItemEmpty(item) {
      return _.isEmpty(item)
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
  avatarStyle: CSSStyleDeclaration
}

export interface Methods {
  checkItemEmpty(item: Props['target']): boolean
}

export interface Computed {}

export interface Props {
  avatar: string
  name: string
  target: Tag | {}
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.QuestionAuthorInfo {
  display: flex;
  align-items: center;
  font-size: 0.875rem;

  &__avatar {
    width: 25px;
    height: 25px;
    margin-right: 8px;
  }

  &::v-deep a {
    color: $gray-secondary;

    &:hover {
      color: $primary-hover-color;
    }
  }
}
</style>
