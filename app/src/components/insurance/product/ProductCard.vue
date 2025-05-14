<template>
  <BaseCard class="ProductCard">
    <template #default>
      <div class="ProductCard__content">
        <div class="ProductCard__section">
          <div class="ProductCard__subSection">
            <div class="ProductCard__company">
              {{ product.companyName }}
            </div>
            <h3 class="ProductCard__name">
              <span v-if="product.stop" class="ProductCard__name__stop">
                [停售]
              </span>
              {{ product.productCode }}{{ product.productName }}
            </h3>
            <div class="ProductCard__featureTags">
              <!-- TODO: ranking_badge 等同於 熱門 popular>60 / 推薦 promote>60 / 停售stop:true(要確認是否擺這)-->
              <div v-if="product.popular > 60" class="ProductCard__rankingTag">
                <BaseTag small type="primary-outline">熱門</BaseTag>
              </div>
              <div v-if="product.promote > 60" class="ProductCard__rankingTag">
                <BaseTag small type="primary-outline">推薦</BaseTag>
              </div>
            </div>
            <div class="ProductCard__features">{{ features }}</div>
            <div class="ProductCard__features">承保年齡：{{ product.age }}</div>
            <div class="ProductCard__features">年期：{{ product.period }}</div>
            <div class="ProductCard__features">理賠項目：{{ benefit }}</div>
          </div>
        </div>
        <div class="ProductCard__section justify-end ml-12">
          <div class="ProductCard__subSection">
            <button @click.stop.prevent="goToProductDetail(product.url)">
              詳細內容
            </button>
          </div>
        </div>
      </div>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import { computed, defineComponent, useRouter } from '@nuxtjs/composition-api'
import { InsuranceProduct } from '@/api/insurance/insurance.type'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import BaseTag from '@/components/my83-ui-kit/tag/BaseTag.vue'

export default defineComponent({
  components: {
    BaseCard,
    BaseTag,
  },
  props: {
    product: {
      type: Object as () => InsuranceProduct,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()

    const features = computed(() => {
      const categorys =
        props.product?.categoryMain + '．' + props.product?.categorySub
      const tags = props.product?.tag.map((item) => item.name)
      return categorys + '．' + tags.join('．')
    })
    const benefit = computed(() => {
      const arr = []
      props.product?.benefit.forEach((item) => {
        arr.push(item.name)
      })
      return arr.join('．')
    })

    const goToProductDetail = (url: string) => {
      router.push({
        name: 'insuranceProduct',
        params: { url },
        query: {},
      })
    }

    return {
      features,
      benefit,
      goToProductDetail,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductCard {
  &__content {
    display: flex;
    padding-top: 24px;
    padding-bottom: 24px;
    min-height: 220px;

    @include max-media('xl') {
      flex-direction: column;
      min-height: 248px;
    }
  }

  &__section {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:last-child {
      flex: 0 0 auto;
      text-align: right;

      @include max-media('xl') {
        flex-direction: row;
        align-items: flex-end;
        text-align: left;
      }
    }
  }

  .justify-end {
    justify-content: flex-end;
  }

  .ml-12 {
    margin-left: 12px;
    @include max-media('xl') {
      margin-left: 0;
    }
  }

  &__subSection {
    width: 100%;
    @include max-media('xl') {
      flex: 0 0 auto;
    }

    button {
      @include max-media('xl') {
        min-width: 100%;
      }

      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      min-height: 40px;
      line-height: 1;
      padding: 0 50px;
      border: 1px solid transparent;
      border-radius: 4px;
      font-weight: 500;
      font-size: 1rem;
      transition: 0.3s;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      cursor: pointer;
      color: #fff;
      background: #ef6e2e;
      border-color: #ef6e2e;
      margin-top: 8px;
    }
  }

  &__company {
    color: $secondary-color;
    font-weight: 500;
  }

  &__name {
    color: $gray-primary;
    font-size: 1.375rem;
    font-weight: 500;
    margin: 0;
    margin-bottom: 8px;
  }

  &__featureTags {
    @include inline-block-space-remove-parent;
    margin-bottom: 2px;

    & > * {
      @include inline-block-space-remove-child;
      display: inline-block;
      margin: 0 8px 8px 0;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &__rankingTag {
    > span {
      margin-left: 6px;
      color: $primary-color;
      font-size: 0.875rem;
      font-weight: 500;
    }
  }

  &__features,
  &__viewCount,
  &__promotion {
    font-size: 0.75rem;
  }

  &__viewCount {
    text-align: right;
  }

  &__promotion {
    color: $primary-color;
    margin-top: 8px;
  }

  &__coverages {
    display: flex;
    align-items: center;
    margin: 32px 0 0 4px;

    @include max-media('xl') {
      margin: 24px 0 0 0;
    }

    &__chart {
      &:not(:last-child) {
        margin-right: 12px;
      }

      @include max-media('xl') {
        &:not(:last-child) {
          margin-right: 10px;
        }
      }
    }

    &__item {
      flex: 0 0 50%;
      display: inline-flex;
      align-items: center;
      font-size: 0.875rem;
      margin-top: 6px;

      &:before {
        content: '';
        width: 0px;
        height: 14px;
        margin-right: 8px;
        border: 2px solid $secondary-light-color;
        border-radius: 2px;
      }

      @include min-media('xl') {
        &:nth-child(-n + 2) {
          margin-top: 0;
        }
      }

      > .name {
        color: $gray-primary;
      }

      > .amount {
        color: $secondary-color;
        font-weight: 500;
        margin-left: 0.25rem;
      }

      > .postfix {
        color: $secondary-color;
        font-size: 0.75em;
        margin-left: 0.25rem;
      }

      @include max-media('xl') {
        flex: 0 0 100%;
        margin-top: 4px;

        &:first-child {
          margin-top: 0;
        }
      }
    }
  }

  &__plan {
    font-size: 0.875rem;
    margin-bottom: 8px;

    @include max-media('xl') {
      font-size: 0.75rem;
      margin-top: 24px;
    }

    @include min-media('xl') {
      br {
        display: none;
      }
    }
  }

  &__fee {
    display: inline-flex;
    align-items: center;
    color: $primary-color;
    font-size: 1.5rem;
    font-weight: 500;

    &__prefix {
      font-size: 0.875rem;
      margin-right: 4px;
    }
  }

  &__btn {
    margin-top: 8px;
  }

  .fade {
    @include vue-transition-fade($second: 0.2);
  }
}
</style>
