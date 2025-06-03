<template>
  <div class="ProductHeaderSection">
    <div class="ProductHeaderSection__column">
      <div class="ProductHeaderSection__row">
        <div class="ProductHeaderSection__column">
          <div class="ProductHeaderSection__company">{{ company }}</div>
        </div>
      </div>
      <h1 class="ProductHeaderSection__name">{{ name }} ( {{ productId }} )</h1>
      <div class="ProductHeaderSection__tags">{{ tags }}</div>
    </div>
    <div class="ProductHeaderSection__column">
      <div class="ProductHeaderSection__files">
        <BaseButton
          v-for="(file, index) in files"
          :key="index"
          :to="file.link"
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
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'
import { useDevice } from '@/mixins/device/device-mixins'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'

export default defineComponent({
  components: {
    BaseButton,
  },
  setup() {
    const store = useStore<InsuranceProductVuexState>()
    const { isMobile } = useDevice()

    const company = computed(
      () => store.state.insuranceProduct.singleProduct?.basic.companyName
    )
    const name = computed(
      () => store.state.insuranceProduct.singleProduct?.basic.productName
    )
    const productId = computed(
      () => store.state.insuranceProduct.singleProduct?.basic.productCode
    )
    const tags = computed(() => {
      const tags = []
      store.state.insuranceProduct.singleProduct?.basic.productTag.forEach(
        (item) => {
          tags.push(item.content)
        }
      )
      return tags.join('．')
    })

    const files = computed(() => {
      const mapping = {
        productTerm: '商品條款',
        productTable: '商品費率',
        productDM: '商品DM',
        productRule: '投保規則',
      }
      const basic = store.state.insuranceProduct.singleProduct?.basic || {}

      return Object.entries(mapping)
        .filter(([key]) => basic[key])
        .map(([key, text]) => ({
          text,
          link: basic[key],
        }))
    })

    return {
      isMobile,
      company,
      name,
      tags,
      files,
      productId,
    }
  },
})
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

  &__row {
    display: flex;
    justify-content: space-between;
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

    &__files {
      text-align: left;
      margin-top: 14px;
    }
  }
}
</style>
