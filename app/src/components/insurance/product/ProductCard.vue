<template>
  <BaseCard class="ProductCard">
    <template v-slot:default>
      <div class="ProductCard__content">
        <div class="ProductCard__section">
          <div class="ProductCard__subSection">
            <div class="ProductCard__company">
              {{ insuranceProduct.company }}
            </div>
            <h3 class="ProductCard__name">{{ insuranceProduct.name }}</h3>
            <div class="ProductCard__features">{{ features }}</div>
            <div class="ProductCard__coverageAge">
              {{ insuranceProduct.coverage_age }}
            </div>
          </div>
          <div
            v-if="insuranceProduct.coverage_charts.length"
            class="ProductCard__subSection"
          >
            <div class="ProductCard__coverages">
              <CoverageBadge
                v-for="(coverage, index) in insuranceProduct.coverage_charts"
                :key="index"
                :percentage="coverage.amount_percentage"
                :wording="`${coverage.amount_percentage}%`"
                :legend="coverage.name"
              />
            </div>
          </div>
        </div>
        <div class="ProductCard__section">
          <div class="ProductCard__subSection">
            <div class="ProductCard__plan">
              推薦計畫：
              <br />
              {{ insuranceProduct.plan }}
            </div>
            <div class="ProductCard__fee">
              <span
                v-if="insuranceProduct.fee_prefix"
                class="ProductCard__fee__prefix"
              >
                {{ insuranceProduct.fee_prefix }}
              </span>
              {{ insuranceProduct.fee }}
            </div>
          </div>
          <div class="ProductCard__subSection">
            <div class="ProductCard__viewCount">{{ viewCount }}</div>
            <BaseButton
              class="ProductCard__btn"
              :to="insuranceProduct.btn.link"
              size="l-a"
            >
              {{ insuranceProduct.btn.text }}
            </BaseButton>
          </div>
        </div>
      </div>
    </template>
    <template v-if="insuranceProduct.description" v-slot:footer>
      {{ insuranceProduct.description }}
    </template>
  </BaseCard>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import CoverageBadge from '../coverages/CoverageBadge.vue'
import { InsuranceProduct } from '@/api/insurance/insurance.type'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'

const options: ComponentOption = {
  components: {
    BaseCard,
    BaseButton,
    CoverageBadge,
  },
  props: {
    insuranceProduct: {
      type: Object,
      required: true,
    },
  },
  computed: {
    features() {
      return this.insuranceProduct.features.join('．')
    },
    viewCount() {
      return this.insuranceProduct.view_count
        ? `有 ${this.insuranceProduct.view_count} 人有興趣`
        : ''
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

export type Methods = {}

export interface Computed {
  features: string
  viewCount: string
}

export interface Props {
  insuranceProduct: InsuranceProduct
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
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
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:last-child {
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
  &__viewCount {
    font-size: 0.75rem;
    min-height: 1.5em;
  }

  &__coverages {
    display: flex;
    align-items: center;
    height: 50px;
    margin: 32px 0 0 4px;

    @include max-media('xl') {
      margin: 24px 0 0 0;
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
}
</style>
