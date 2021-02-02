<template>
  <BaseCard class="ProductListFilterSection">
    <template v-slot:title>投保資料</template>
    <template v-slot>
      <div class="ProductListFilterSection__content">
        <ProductQueryField
          v-for="option in options"
          :key="option.id"
          class="ProductListFilterSection__field"
          :option="option"
          :value="formData[option.id]"
          @update="update"
        />
      </div>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import ProductQueryField from '../product/ProductQueryField.vue'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { InsuranceFilterScheme } from '@/services/product/InsuranceFilterScheme'
import { UpdateInsuranceListFilterPayload } from '@/store/insurance/insurance'
import { useRoute, useRouter, useStore } from '@/utils/composition-api'

export default defineComponent({
  components: {
    BaseCard,
    ProductQueryField,
  },
  setup() {
    const store = useStore<InsuranceVuexState>()
    const router = useRouter()!
    const route = useRoute()

    const { premiumConfig, defaultPremiumConfig } = store.state.insurance.filter
    const scheme = new InsuranceFilterScheme(
      premiumConfig,
      defaultPremiumConfig
    )
    const options = ref(scheme.form.fields)
    const formData = ref(scheme.form.formData)
    const update = ({ id, value }: UpdateInsuranceListFilterPayload) => {
      scheme.form.updateFormData(id, value)

      router.push({
        query: {
          ...route.value.query,
          ...scheme.form.formData,
        },
      })
    }

    return {
      options,
      formData,
      update,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.ProductListFilterSection {
  margin-bottom: 20px;

  &__content {
    padding: 16px 0;
    color: $gray-primary;
  }

  &__field {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  @include max-media('xl') {
    margin-bottom: 10px;
  }
}
</style>
