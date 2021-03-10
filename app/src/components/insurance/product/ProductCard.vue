<template>
  <BaseCard class="ProductCard" :enable-hover="enabled">
    <template #default>
      <div class="ProductCard__content">
        <div class="ProductCard__section">
          <div class="ProductCard__subSection">
            <div class="ProductCard__company">
              {{ product.company }}
            </div>
            <h3 class="ProductCard__name">{{ product.name }}</h3>
            <div v-if="features" class="ProductCard__features">
              {{ features }}
            </div>
            <div v-if="product.coverage_age" class="ProductCard__coverageAge">
              {{ product.coverage_age }}
            </div>
            <div v-if="product.promotion" class="ProductCard__promotion">
              {{ product.promotion }}
            </div>
          </div>
          <div
            v-if="product.coverage_charts.length || product.coverages.length"
            class="ProductCard__subSection"
          >
            <div
              class="ProductCard__coverages"
              :class="{
                'flex-wrap': enableCoverageFlexWrap,
              }"
            >
              <CoverageBadge
                v-for="(coverage, index) in product.coverage_charts"
                :key="index"
                class="ProductCard__coverages__chart"
                :percentage="coverage.amount_percentage"
                :wording="`${coverage.amount_percentage}%`"
                :legend="coverage.name"
              />
              <div
                v-for="(coverage, index) in product.coverages"
                :key="index"
                class="ProductCard__coverages__item"
              >
                <span class="name">
                  {{ coverage.name }}
                </span>
                <span class="amount">
                  {{ coverage.amount }}
                </span>
                <span v-if="coverage.postfix" class="postfix">
                  {{ coverage.postfix }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="ProductCard__section">
          <div class="ProductCard__subSection">
            <div class="ProductCard__plan">
              推薦計畫：
              <br />
              {{ product.plan }}
            </div>
            <transition name="fade" mode="out-in">
              <div :key="product.fee" class="ProductCard__fee">
                <span
                  v-if="product.fee_prefix"
                  class="ProductCard__fee__prefix"
                >
                  {{ product.fee_prefix }}
                </span>
                {{ getFormattedFee(product.fee) }}
              </div>
            </transition>
          </div>
          <div class="ProductCard__subSection">
            <div v-if="viewCount" class="ProductCard__viewCount">
              {{ viewCount }}
            </div>
            <BaseButton
              class="ProductCard__btn"
              :to="enabled ? product.btn.link : null"
              size="l-a"
              :is-disabled="!enabled"
              @click.stop.native="$emit('click-button')"
            >
              {{ buttonText }}
            </BaseButton>
          </div>
        </div>
      </div>
    </template>
    <template v-if="product.description" #footer>
      {{ product.description }}
    </template>
  </BaseCard>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { InsuranceProduct } from '@/api/insurance/insurance.type'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import { delimitIntegerWithSymbol } from '@/utils/digital'
import CoverageBadge from '../coverages/CoverageBadge.vue'

const options: ComponentOption = {
  components: {
    BaseCard,
    BaseButton,
    CoverageBadge,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
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
    enableCoverageFlexWrap() {
      return (
        this.product.coverages.length > 0 &&
        this.product.coverage_charts.length === 0
      )
    },
    buttonText() {
      return this.enabled ? this.product.btn.text : '條件不符合'
    },
  },
  methods: {
    getFormattedFee(fee) {
      const feeString = fee === null ? '　-　' : delimitIntegerWithSymbol(fee)
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
  getFormattedFee(fee: number | null): string
}

export interface Computed {
  features: string
  viewCount: string
  enableCoverageFlexWrap: boolean
  buttonText: string
}

export interface Props {
  product: InsuranceProduct
  enabled: boolean
}

export default options
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

  &__subSection {
    @include max-media('xl') {
      flex: 0 0 auto;
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

  &__features,
  &__coverageAge,
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
