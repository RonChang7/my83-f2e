<template>
  <BaseCard class="ListRecommendProductSection">
    <template #title>{{ promotionHeader }}</template>
    <template #default>
      <GlobalLink
        v-for="promotion in promotions"
        :key="promotion.title"
        :to="promotion.link.path"
        class="ListRecommendProductSection__promotion"
      >
        <div class="ListRecommendProductSection__promotion__image">
          <BaseLazyImage
            :image-url="promotion.image_url"
            :image-alt="promotion.title"
          />
        </div>
        <div class="ListRecommendProductSection__promotion__description">
          <div class="title">
            {{ promotion.title }}
          </div>
          <div class="count">
            已經有 {{ promotion.consultations_count }} 人在此規劃保險
          </div>
        </div>
        <div class="ListRecommendProductSection__promotion__button">
          <BaseButton size="l-a" :is-full-width="true">去看看</BaseButton>
        </div>
      </GlobalLink>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import { QuestionListVuexState } from '@/views/question/list/CreateQuestionListPage'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseLazyImage from '@/components/base/lazy-load-image/BaseLazyImage.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'

export default defineComponent({
  components: {
    BaseCard,
    BaseButton,
    BaseLazyImage,
    GlobalLink,
  },
  setup() {
    const store = useStore<QuestionListVuexState>()
    const promotionHeader = computed(() =>
      store.state.questionList.promotions
        ? store.state.questionList.promotions.header
        : ''
    )
    const promotions = computed(() =>
      store.state.questionList.promotions
        ? store.state.questionList.promotions.promotions
        : []
    )

    return {
      promotionHeader,
      promotions,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ListRecommendProductSection {
  margin-bottom: 20px;

  @include max-media('xl') {
    margin-bottom: 10px;
  }

  &__promotion {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;

    @include hover('_gray-primary');

    &:not(:last-child) {
      border-bottom: 1px solid $gray-quaternary;
    }

    &__image {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      flex: 0 0 auto;
    }

    &__description {
      flex: 1 1 auto;

      .title {
        font-size: 1.375rem;
        font-weight: 500;

        @include max-media('xl') {
          font-size: 1.125rem;
        }
      }

      .count {
        font-size: 0.875rem;
        color: $gray-secondary;

        @include max-media('xl') {
          font-size: 0.75rem;
        }
      }
    }

    &__button {
      display: none;

      @include max-media('xl') {
        display: block;
        width: 76px;
        flex: 0 0 auto;
      }
    }
  }
}
</style>
