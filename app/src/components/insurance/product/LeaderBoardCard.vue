<template>
  <div class="LeaderBoardCard">
    <div class="LeaderBoardCard__header">
      <div class="LeaderBoardCard__header__content">
        <h2 class="LeaderBoardCard__header__title">{{ section.title }}</h2>
        <div class="LeaderBoardCard__header__description">
          {{ section.description }}
        </div>
      </div>
      <div class="LeaderBoardCard__header__icon">
        <BaseLazyImage :image-url="section.image_url" :image-alt="section.id" />
      </div>
    </div>
    <div class="LeaderBoardCard__content">
      <div
        v-for="(product, index) in section.products"
        :key="index"
        class="LeaderBoardCard__product"
        @click="() => $router.push({ path: `${product.btn.link.path}` })"
      >
        <div class="LeaderBoardCard__product__index">{{ index + 1 }}</div>
        <div class="LeaderBoardCard__product__content">
          <div class="company">{{ product.company }}</div>
          <div class="name">{{ product.name }}</div>
          <div v-if="product.features.length" class="features">
            {{ featuresFormatter(product.features) }}
          </div>
        </div>
        <div class="LeaderBoardCard__product__action">
          <div v-if="product.pageviews" class="count">
            {{ pageviewsFormatter(product.pageviews) }}
          </div>
          <BaseButton :to="product.btn.link" size="m">
            {{ product.btn.text }}
          </BaseButton>
        </div>
      </div>
      <GlobalLink
        :to="`/insurance/${section.id}`"
        class="LeaderBoardCard__link"
      >
        更多商品
      </GlobalLink>
    </div>
    <GlobalLink
      v-if="section.blog"
      :to="section.blog.link"
      class="LeaderBoardCard__blog"
    >
      → {{ section.blog.text }}
    </GlobalLink>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { Section } from '@/api/insurance/leader-board.type'
import BaseLazyImage from '@/components/base/lazy-load-image/BaseLazyImage.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import { delimitIntegerWithSymbol } from '@/utils/digital'

export default defineComponent({
  components: {
    BaseLazyImage,
    GlobalLink,
    BaseButton,
  },
  props: {
    section: {
      type: Object as PropType<Section>,
      required: true,
    },
  },
  setup() {
    const pageviewsFormatter = (number: number) => {
      return number ? delimitIntegerWithSymbol(number) : ''
    }

    const featuresFormatter = (features: string[]) => features.join('．')

    return {
      pageviewsFormatter,
      featuresFormatter,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.LeaderBoardCard {
  width: 550px;
  margin-bottom: 64px;

  @include max-media('xl') {
    width: 100%;
    margin-bottom: 40px;
  }

  &__header {
    @include card-primary;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 30px;

    @include max-media('xl') {
      @include card-secondary;

      padding: 16px 20px;
    }

    &__title {
      margin: 0;
      color: $gray-primary;
      font-size: 1.375rem;
      font-weight: 500;

      @include max-media('xl') {
        font-size: 1.125rem;
      }
    }

    &__description {
      margin-top: 10px;

      @include max-media('xl') {
        margin-top: 4px;
        font-size: 0.875rem;
      }
    }

    &__icon {
      flex: 0 0 auto;
      width: 94px;
      height: 94px;
      margin-left: 10px;

      @include max-media('xl') {
        width: 60px;
        height: 60px;
        margin-left: 8px;
      }
    }
  }

  &__content {
    @include card-primary;

    margin: 10px 0 14px;
    padding: 0 36px;

    @include max-media('xl') {
      @include card-secondary;

      margin: 4px 0 12px;
      padding: 0 20px;
    }
  }

  &__product {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid $gray-quaternary;
    cursor: pointer;

    @include max-media('xl') {
      padding: 12px 0;
    }

    &__index {
      flex: 0 0 auto;
      color: $primary-color;
      font-size: 2rem;
      font-weight: 500;

      @include max-media('xl') {
        font-size: 1.25rem;
      }
    }

    &__content {
      flex: 1 1 auto;
      padding: 0 20px;

      > * {
        transition: 0.3s;
      }

      .company {
        color: $secondary-color;
        font-weight: 500;
      }

      .name {
        margin-top: 2px;
        color: $gray-primary;
        font-size: 1.125rem;
        font-weight: 500;
      }

      .features {
        margin-top: 2px;
        font-size: 0.875rem;
      }

      @include max-media('xl') {
        padding: 0 12px;

        .company,
        .features {
          font-size: 0.875rem;
        }

        .name {
          font-size: 1rem;
        }
      }
    }

    &__action {
      flex: 0 0 auto;

      .count {
        margin-bottom: 6px;
        color: $gray-primary;
        font-size: 1.375rem;
        font-weight: 500;
        text-align: right;

        &:after {
          content: '人次';
          font-size: 0.875rem;
          font-weight: 400;

          @include max-media('xl') {
            font-size: 0.75rem;
          }
        }
      }
    }

    @include hover-supported {
      &:hover {
        .company {
          color: $secondary-hover-color;
        }

        .name {
          color: $primary-color;
        }

        .features {
          color: $gray-primary;
        }
      }
    }
  }

  &__link {
    display: flex;
    justify-content: center;
    padding: 14px 0;
    font-weight: 500;

    @include max-media('xl') {
      padding: 10px 0;
    }
  }

  &__blog {
    @include hover('_secondary');

    display: block;
    padding-left: 16px;
    font-weight: 500;

    @include max-media('xl') {
      padding: 0 20px;
    }
  }
}
</style>
