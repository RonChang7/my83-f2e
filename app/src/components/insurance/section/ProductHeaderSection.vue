<template>
  <div class="ProductHeaderSection">
    <div class="ProductHeaderSection__column">
      <div class="ProductHeaderSection__breadcrumbs">
        <span v-for="(breadcrumb, index) in breadcrumbs" :key="index">
          <GlobalLink :to="breadcrumb.link.path">
            {{ breadcrumb.name }}
          </GlobalLink>
        </span>
      </div>
      <div class="ProductHeaderSection__company">{{ company }}</div>
      <h1 class="ProductHeaderSection__name">{{ name }}</h1>
      <div class="ProductHeaderSection__features">{{ features }}</div>
    </div>
    <div class="ProductHeaderSection__column">
      <div class="ProductHeaderSection__files">
        <BaseButton
          v-for="(file, index) in files"
          :key="index"
          :to="file.link.url"
          :size="isMobile ? 's' : 'm'"
          type="tertiary"
          target="_blank"
        >
          {{ file.text }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import DeviceMixin from '@/mixins/device/device-mixins'

@Component({
  components: {
    GlobalLink,
    BaseButton,
  },
})
export default class ProductHeaderSection extends Mixins(DeviceMixin) {
  get breadcrumbs() {
    return (this.$store.state as InsuranceProductVuexState).pageMeta.pageMeta
      ?.breadcrumbs
  }

  get company() {
    const state = this.$store.state as InsuranceProductVuexState
    return state.insuranceProduct.product?.product.company
  }

  get name() {
    const state = this.$store.state as InsuranceProductVuexState
    return state.insuranceProduct.product?.product.name
  }

  get features() {
    const state = this.$store.state as InsuranceProductVuexState
    return state.insuranceProduct.product?.product.features.join('．')
  }

  get files() {
    const state = this.$store.state as InsuranceProductVuexState
    return state.insuranceProduct.product?.files
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductHeaderSection {
  display: flex;
  justify-content: space-between;
  width: 100%;

  &__column {
    flex: 1 1 auto;
  }

  &__breadcrumbs {
    font-size: 0.875rem;

    span:after {
      content: '>';
    }

    a {
      @include hover('_gray-secondary-lighter');
    }
  }

  &__company {
    color: $secondary-color;
    font-size: 1.375rem;
    font-weight: 500;
    margin-top: 12px;
  }

  &__name {
    margin: 0;
    color: $gray-primary;
    font-size: 1.75rem;
    font-weight: 500;
    margin-bottom: 6px;
  }

  &__features {
    font-size: 0.875rem;
  }

  &__files {
    margin-top: 10px;
    text-align: right;

    > [type='button']:not(:last-child) {
      margin-right: 12px;
    }
  }

  @include max-media('xl') {
    padding: 0 20px;
    flex-direction: column;

    &__company {
      font-size: 1.125rem;
      margin-top: 4px;
    }

    &__name {
      font-size: 1.375rem;
      margin-bottom: 8px;
    }

    &__features {
      font-size: 0.75rem;
    }

    &__files {
      text-align: left;
      margin-top: 14px;
    }
  }
}
</style>
