<template>
  <div class="QuestionAuthorInfo">
    <img :src="avatar" alt="avatar" class="avatar" />
    {{ name }}·
    <GlobalLink v-if="target !== null" :to="target.link.path">
      {{ target.name }}
    </GlobalLink>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Tag } from '@/api/question/question.type'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'

export default {
  components: {
    GlobalLink,
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

export interface Methods {}

export interface Computed {}

export interface Props {
  avatar: string
  name: string
  target: Tag
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.QuestionAuthorInfo {
  display: flex;
  align-items: center;
  font-size: 0.875rem;

  .avatar {
    width: 25px;
    height: 25px;
    border-radius: 50%;
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
