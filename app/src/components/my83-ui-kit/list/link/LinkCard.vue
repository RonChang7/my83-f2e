<template>
  <div class="LinkCard" :class="{ last }">
    <div class="LinkCard__index">{{ index }}</div>
    <div class="LinkCard__content">
      <div class="LinkCard__title">{{ title }}</div>
      <div class="LinkCard__meta">
        <span v-if="viewCount !== null" class="LinkCard__count">
          <BaseView />
          {{ delimitIntegerWithSymbol(viewCount) }}
        </span>
        <span v-if="answerCount !== null" class="LinkCard__count">
          <BaseComment />
          {{ delimitIntegerWithSymbol(answerCount) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseView from '@/assets/icon/18/BaseView.svg'
import BaseComment from '@/assets/icon/18/BaseComment.svg'
import { delimitIntegerWithSymbol } from '@/utils/digital'

export default defineComponent({
  components: {
    BaseView,
    BaseComment,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    viewCount: {
      type: Number,
      default: null,
    },
    answerCount: {
      type: Number,
      default: null,
    },
    last: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      delimitIntegerWithSymbol,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.LinkCard {
  $self: &;

  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid $gray-quaternary;

  &.last {
    border-bottom: 0;
  }

  &:hover {
    #{$self}__title {
      color: $primary-color;
    }
  }

  @include max-media('xl') {
    padding: 10px;
  }

  &__index {
    color: $primary-color;
    font-size: 1.25rem;
    font-weight: 500;
    padding-right: 14px;
    max-width: 33px;

    @include max-media('xl') {
      font-size: 1rem;
      max-width: 25px;
      padding-right: 15px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
  }

  &__title {
    margin: 0 0 4px;
    color: $gray-primary;
    font-size: 0.875rem;

    @include max-media('xl') {
      margin-top: 0;
    }
  }

  &__meta {
    display: flex;
    color: $text-default-color;
  }

  &__count {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    margin-right: 20px;

    @include max-media('xl') {
      margin-right: 30px;
    }

    &::v-deep svg {
      margin-right: 6px;

      > path {
        fill: $gray-tertiary;
      }
    }
  }
}
</style>
