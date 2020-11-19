<template>
  <div class="PromotionProductCard">
    <div class="PromotionProductCard__section">
      <div class="PromotionProductCard__company">{{ product.company }}</div>
      <div class="PromotionProductCard__name">{{ product.name }}</div>
      <div class="PromotionProductCard__features">{{ features }}</div>
      <div class="PromotionProductCard__coverageAge">
        {{ product.coverage_age }}
      </div>
    </div>
    <div class="PromotionProductCard__section">
      <div class="PromotionProductCard__plan">{{ product.plan }}</div>
      <div class="PromotionProductCard__fee">
        {{ getFormattedFee(product.fee) }}
      </div>
      <div v-if="viewCount" class="PromotionProductCard__viewCount">
        {{ viewCount }}
      </div>
      <BaseButton
        class="PromotionProductCard__btn"
        :to="product.btn.link"
        size="l-a"
        :is-full-width="true"
        @click.native="$emit('click-button')"
      >
        {{ product.btn.text }}
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { PromotionInsuranceProduct } from '@/api/insurance/insurance.type'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import { delimitIntegerWithSymbol } from '@/utils/digital'

const options: ComponentOption = {
  components: {
    BaseButton,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  computed: {
    features() {
      return this.product.features.join('．')
    },
    viewCount() {
      return this.product.view_count
        ? `有 ${this.product.view_count} 人有興趣`
        : ''
    },
  },
  methods: {
    getFormattedFee(fee) {
      const feeString = fee < 0 ? '　-　' : delimitIntegerWithSymbol(fee)
      return `${feeString}元 /年`
    },
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

export interface Data {}

export type Methods = {
  getFormattedFee(fee: number): string
}

export interface Computed {
  features: string
  viewCount: string
}

export interface Props {
  product: PromotionInsuranceProduct
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.PromotionProductCard {
  @include card-primary;

  width: 240px;
  padding: 24px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 0 0 auto;

  &__company {
    color: $secondary-color;
    font-weight: 500;
    padding: 3px 0;
    margin-bottom: 8px;
  }

  &__name {
    @include text-ellipsis(2);

    color: $gray-primary;
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 16px;
  }

  &__features,
  &__coverageAge,
  &__viewCount {
    font-size: 0.75rem;
    min-height: 1.5em;
  }

  &__plan {
    font-size: 0.875rem;
    margin-top: 20px;
  }

  &__fee {
    color: $primary-color;
    font-size: 1.375rem;
    font-weight: 500;
    margin-bottom: 20px;
  }

  &__btn {
    margin-top: 8px;
  }
}
</style>
