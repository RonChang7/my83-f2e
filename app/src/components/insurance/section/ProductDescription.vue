<template>
  <div class="ProductDescription__wrapper">
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
    return state.insuranceProduct.product?.description
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.ProductDescription {
  @include card-primary;

  padding: 12px 20px 12px 24px;
  font-size: 0.875rem;
  color: $gray-primary;

  &__wrapper {
    display: flex;

    &:before {
      content: '';
      flex: 0 0 auto;
      position: relative;
      left: 8px;
      width: 8px;
      margin-left: -8px;
      // @TODO: update color to variable config
      background: linear-gradient(to top, #f78b56, #ffa77c);
    }
  }
}
</style>
