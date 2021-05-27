<template>
  <BaseCard class="DesktopRecommendProductCard">
    <template #title>{{ recommendProduct.header }}</template>
    <GlobalLink :to="recommendProduct.btn.link.path">
      <div class="DesktopRecommendProductCard__content">
        <div
          v-if="recommendProduct.image_url"
          class="DesktopRecommendProductCard__icon"
        >
          <BaseLazyImage :image-url="recommendProduct.image_url" />
        </div>
        <div class="DesktopRecommendProductCard__text">
          {{ recommendProduct.title }}
          <span
            v-if="recommendProduct.description"
            class="DesktopRecommendProductCard__count"
          >
            {{ recommendProduct.description }}
          </span>
        </div>
      </div>
      <BaseButton size="l-a" :is-full-width="true">
        {{ recommendProduct.btn.text }}
      </BaseButton>
    </GlobalLink>
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import BaseLazyImage from '@/components/base/lazy-load-image/BaseLazyImage.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'

export default defineComponent({
  components: {
    BaseCard,
    BaseLazyImage,
    BaseButton,
    GlobalLink,
  },
  props: {
    recommendProduct: {
      type: Object as () => RecommendProduct,
      required: true,
    },
  },
})

interface RecommendProduct {
  header: string
  title: string
  description: string
  image_url: string
  btn: LinkButton
}

interface LinkButton {
  text: string
  link: Link
}

interface Link {
  path: string
  url: string
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.DesktopRecommendProductCard {
  margin-bottom: 20px;
  padding-bottom: 16px;

  &__content {
    display: flex;
    align-items: center;
    padding: 16px 0 18px;
    color: $gray-primary;
    font-size: 1.375rem;
    font-weight: 500;

    @include max-media('xl') {
      font-size: 1.125rem;
    }
  }

  &__count {
    display: block;
    font-size: 0.875rem;
    color: $gray-secondary;
  }

  &__icon {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    flex: 0 0 auto;
  }
}
</style>
