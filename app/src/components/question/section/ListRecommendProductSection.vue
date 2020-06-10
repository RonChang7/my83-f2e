<template>
  <BaseCard class="ListRecommendProductSection">
    <template v-slot:title>
      保險商品推薦
    </template>
    <template v-slot>
      <GlobalLink
        v-for="product in products"
        :key="product.title"
        :to="product.link.path"
        class="ListRecommendProductSection__product"
      >
        <div class="ListRecommendProductSection__product__image">
          <BaseLazyImage
            :image-url="product.imageUrl"
            :image-alt="product.title"
          />
        </div>
        <div class="ListRecommendProductSection__product__description">
          <div class="title">
            {{ product.title }}
          </div>
        </div>
        <div class="ListRecommendProductSection__product__button">
          <BaseButton size="l-a" :is-full-width="true">
            去看看
          </BaseButton>
        </div>
      </GlobalLink>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseLazyImage from '@/components/base/lazy-load-image/BaseLazyImage.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { Link } from '@/api/type'

const options: ComponentOption = {
  components: {
    BaseCard,
    BaseButton,
    BaseLazyImage,
    GlobalLink,
  },
  data() {
    return {
      products: [
        {
          title: '嬰幼兒罐頭保單',
          imageUrl: `${this.$imageBucketUrl}/front/common/promotion/img-newborn@2x.png`,
          link: {
            path: '/bundle/1',
            url: `${this.$env.HOST_URL}/bundle/1`,
          },
        },
        {
          title: '成人罐頭保單',
          imageUrl: `${this.$imageBucketUrl}/front/common/promotion/img-adult@2x.png`,
          link: {
            path: '/bundle/2',
            url: `${this.$env.HOST_URL}/bundle/2`,
          },
        },
      ],
    }
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

export interface Instance extends Vue {}

export interface Data {
  products: Product[]
}

export interface Methods {}

export interface Computed {}

export interface Props {}

interface Product {
  title: string
  imageUrl: string
  link: Link
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.ListRecommendProductSection {
  margin-bottom: 20px;

  @include max-media('xl') {
    margin-bottom: 10px;
  }

  &__product {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    color: $gray-primary;

    &:hover {
      color: $primary-color;
    }

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
