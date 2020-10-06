<template>
  <div class="PromotionProductSection">
    <h2 class="PromotionProductSection__title">推薦商品</h2>
    <div class="PromotionProductSection__description">
      {{ description }}
    </div>
    <BaseHorizontalList>
      <PromotionProductCard
        v-for="product in promotionProducts"
        :key="product.id"
        class="product"
        :product="product"
        @click-button="
          clickPromotionProductButton(`${product.company}${product.name}`)
        "
      />
    </BaseHorizontalList>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import PromotionProductCard from '../product/PromotionProductCard.vue'
import BaseHorizontalList from '@/components/my83-ui-kit/list/BaseHorizontalList.vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { PromotionInsuranceProduct } from '@/api/insurance/insurance.type'
import { EventTypes } from '@/analytics/event-listeners/event.type'

const options: ComponentOption = {
  components: {
    BaseHorizontalList,
    PromotionProductCard,
  },
  computed: {
    description() {
      return this.$store.state.insurance.staticData.isExternal
        ? this.$store.state.insurance.staticData.promotionWording
        : 'MY83 嚴選的高保障的保單，讓你挑選保險商品不再耗時傷神！'
    },
    promotionProducts() {
      return this.$store.state.insurance.promotionProducts
    },
  },
  methods: {
    clickPromotionProductButton(productName) {
      const insuranceType = this.$store.state.insurance.staticData.abbr

      this.$analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: '險種頁商品CTA',
        action: '推薦商品',
        label: `${insuranceType} ${productName}`,
      })
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

export interface Instance extends Vue {
  $store: Store<InsuranceVuexState>
}

export interface Data {}

export type Methods = {
  clickPromotionProductButton(productName: string): void
}

export interface Computed {
  description: string
  promotionProducts: PromotionInsuranceProduct[] | null
}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.PromotionProductSection {
  width: 1120px;
  color: $gray-primary;

  &__title {
    margin: 0 0 8px 0;
    font-size: 1.75rem;
    font-weight: 500;
  }

  &__description {
    margin-bottom: 20px;
  }

  .product:not(:last-child) {
    margin-right: 16px;
  }

  @include max-media('xl') {
    width: 100%;
    padding: 0 20px;

    &__title {
      font-size: 1.375rem;
    }

    &__description {
      font-size: 0.875rem;
      margin: 0 10px 12px 0;
    }

    .product:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>
