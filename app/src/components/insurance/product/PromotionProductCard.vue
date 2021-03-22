<template>
  <div class="PromotionProductCard" :class="{ enableHover: enabled }">
    <div class="PromotionProductCard__section">
      <div class="PromotionProductCard__company">{{ product.company }}</div>
      <div class="PromotionProductCard__name">{{ product.name }}</div>
      <div
        v-if="product.badges.length || product.ranking_badge"
        class="PromotionProductCard__featureTags"
      >
        <ProductFeatureTag
          v-for="(tag, index) in product.badges"
          :key="index"
          :tag="tag"
        />
        <div
          v-if="product.ranking_badge"
          class="PromotionProductCard__rankingTag"
        >
          <BaseTag small type="primary-outline">
            {{ product.ranking_badge.text }}
          </BaseTag>
        </div>
      </div>
      <template v-if="!product.promotion">
        <div class="PromotionProductCard__features">
          {{ features }}
        </div>
        <div class="PromotionProductCard__coverageAge">
          {{ product.coverage_age }}
        </div>
      </template>
      <div v-else class="PromotionProductCard__promotion">
        {{ product.promotion }}
      </div>
    </div>
    <div class="PromotionProductCard__section">
      <div class="PromotionProductCard__plan">{{ product.plan }}</div>
      <transition name="fade" mode="out-in">
        <div :key="product.fee" class="PromotionProductCard__fee">
          <span
            v-if="product.fee_prefix"
            class="PromotionProductCard__fee__prefix"
          >
            {{ product.fee_prefix }}
          </span>
          {{ getFormattedFee(product.fee) }}
        </div>
      </transition>
      <div v-if="viewCount" class="PromotionProductCard__viewCount">
        {{ viewCount }}
      </div>
      <BaseButton
        class="PromotionProductCard__btn"
        :to="enabled ? product.btn.link : null"
        size="l-a"
        :is-full-width="true"
        :is-disabled="!enabled"
        @click.stop.native="$emit('click-button')"
      >
        {{ buttonText }}
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { PromotionInsuranceProduct } from '@/api/insurance/insurance.type'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import { delimitIntegerWithSymbol } from '@/utils/digital'
import BaseTag from '@/components/my83-ui-kit/tag/BaseTag.vue'
import ProductFeatureTag from './ProductFeatureTag.vue'

export default defineComponent({
  components: {
    BaseButton,
    ProductFeatureTag,
    BaseTag,
  },
  props: {
    product: {
      type: Object as () => PromotionInsuranceProduct,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const features = computed(() => props.product.features.join('．'))
    const viewCount = computed(() =>
      props.product.view_count ? `有 ${props.product.view_count} 人有興趣` : ''
    )
    const buttonText = computed(() =>
      props.enabled ? props.product.btn.text : '條件不符合'
    )
    const getFormattedFee = (fee: number | null) => {
      const feeString = fee === null ? '　-　' : delimitIntegerWithSymbol(fee)
      return `${feeString}元 /年`
    }

    return {
      features,
      viewCount,
      buttonText,
      getFormattedFee,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.PromotionProductCard {
  @include card-primary();

  &.enableHover {
    @include card-primary($hover: true);
  }

  width: 240px;
  padding: 24px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 0 0 auto;

  @include hover-supported {
    margin: 20px 0;
  }

  &__company {
    color: $secondary-color;
    font-weight: 500;
    padding: 3px 0;
  }

  &__name {
    @include text-ellipsis(2);

    color: $gray-primary;
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 8px;
  }

  &__featureTags {
    margin-bottom: 6px;

    & > * {
      display: inline-block;
      margin: 0 8px 4px 0;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &__rankingTag {
    > span {
      margin-left: 4px;
      color: $primary-color;
      font-size: 0.875em;
      font-weight: 500;
    }
  }

  &__features,
  &__coverageAge,
  &__viewCount {
    font-size: 0.75rem;
    min-height: 1.5em;
  }

  &__promotion {
    color: $primary-color;
    font-size: 0.75rem;
    height: 3em;

    @include text-ellipsis(2);
  }

  &__plan {
    font-size: 0.875rem;
    margin-top: 20px;
  }

  &__fee {
    display: inline-flex;
    align-items: center;
    color: $primary-color;
    font-size: 1.375rem;
    font-weight: 500;
    margin-bottom: 20px;

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
