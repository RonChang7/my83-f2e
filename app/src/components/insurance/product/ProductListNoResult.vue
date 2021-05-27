<template functional>
  <div class="ProductListNoResult">
    <div
      class="ProductListNoResult__info"
      :class="{ isEmptySearchResult: props.isEmptySearchResult || false }"
    >
      <img
        :src="`${parent.$imageBucketUrl}/front/insurance/filter-not-found@2x.png`"
        alt="filter not found"
      />
      <div class="title">沒有符合條件的商品</div>
      <div class="description">
        換個篩選條件試試看吧！調整保險種類、保障類型、商品類型等項目。
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  functional: true,
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.ProductListNoResult {
  &__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 64px;

    @include max-media('xl') {
      padding: 0 20px;
    }

    img {
      width: 160px;
      height: 160px;
      margin: 36px 0 10px;
    }

    .title {
      color: $gray-primary;
      font-size: 1.125rem;
      font-weight: 500;
    }

    .description {
      text-align: center;
      font-size: 0.875rem;
      margin: 4px 0 40px;
    }

    &.isEmptySearchResult {
      padding-top: 0px;

      img {
        margin-top: 10px;
      }

      .description {
        margin-bottom: 0;
      }
    }
  }
}
</style>
