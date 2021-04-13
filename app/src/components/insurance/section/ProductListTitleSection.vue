<template>
  <div class="ProductListTitleSection">
    <h2 class="ProductListTitleSection__title">
      全部商品
      <a
        class="ProductListTitleSection__faq"
        href="#faq"
        @click.prevent="$emit('scrollToFAQ')"
      >
        <BaseFAQ />
        常見問題
      </a>
    </h2>
    <div class="ProductListTitleSection__description">{{ description }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import BaseFAQ from '@/assets/icon/24/BaseFAQ.svg'

export default defineComponent({
  components: {
    BaseFAQ,
  },
  setup() {
    const store = useStore<InsuranceVuexState>()
    const description = computed(
      () =>
        store.state.insurance.staticData.productListDescription ||
        '依熱門度排序。費率以 30 歲女性為基準。'
    )

    return {
      description,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductListTitleSection {
  width: 1120px;

  @include max-media('xl') {
    padding: 0 20px;
  }

  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    color: $gray-primary;
    font-size: 1.75rem;
    font-weight: 500;

    @include max-media('xl') {
      font-size: 1.375rem;
    }

    > a {
      font-weight: 500;
      margin-right: 10px;

      @include hover('_secondary', $has-svg: true);

      @include max-media('xl') {
        margin: 0;
      }
    }
  }

  &__description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $gray-primary;

    @include max-media('xl') {
      display: none;
    }
  }

  &__faq {
    font-size: 1rem;
  }
}
</style>
