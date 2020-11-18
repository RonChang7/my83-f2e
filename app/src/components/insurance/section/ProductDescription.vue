<template>
  <div class="ProductDescription__wrapper" :class="{ hide: !description }">
    <div class="ProductDescription">{{ description }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'

@Component
export default class ProductDescription extends Vue {
  get description() {
    const state = this.$store.state as InsuranceProductVuexState
    return state.insuranceProduct.product?.product.description
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductDescription {
  @include card-primary;

  min-height: 47px;
  padding: 12px 20px 12px 24px;
  font-size: 0.875rem;
  color: $gray-primary;

  @include max-media('xl') {
    padding: 12px 16px 12px 20px;
  }

  &__wrapper {
    display: flex;

    @include max-media('xl') {
      padding: 0 20px;
    }

    &.hide {
      @include min-media('xl') {
        visibility: hidden;
      }

      @include max-media('xl') {
        display: none;
      }
    }

    &:before {
      content: '';
      flex: 0 0 auto;
      position: relative;
      left: 8px;
      width: 8px;
      margin-left: -8px;
      background: linear-gradient(
        to bottom,
        lighten($primary-color, 20),
        lighten($primary-color, 10)
      );

      @include max-media('xl') {
        left: 4px;
        width: 4px;
        margin-left: -4px;
      }
    }
  }
}
</style>
