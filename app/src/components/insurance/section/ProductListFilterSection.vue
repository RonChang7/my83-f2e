<template>
  <BaseCard class="ProductListFilterSection">
    <template #title>投保資料</template>
    <template #default>
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
import _ from 'lodash'
import {
  defineComponent,
  ref,
  useRoute,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { InsuranceFilterScheme } from '@/services/product/InsuranceFilterScheme'
import { UpdateInsuranceListFilterPayload } from '@/store/insurance/insurance'
import { getFirstQuery } from '@/utils/query-string'
import ProductQueryField from '../product/ProductQueryField.vue'

export default defineComponent({
  components: {
    BaseCard,
    ProductQueryField,
  },
  setup() {
    const store = useStore<InsuranceVuexState>()
    const router = useRouter()
    const route = useRoute()
    const options = ref({})
    const formData = ref({})

    const {
      premiumConfig,
      defaultPremiumConfig: defaultFilterPremiumConfig,
    } = store.state.insurance.filter
    const filterPremiumConfig = _.keys(defaultFilterPremiumConfig).reduce(
      (acc, cur) => {
        if (getFirstQuery(route.value.query[cur])) {
          acc[cur] = getFirstQuery(route.value.query[cur])
        }
        return acc
      },
      {}
    )

    const scheme = new InsuranceFilterScheme(
      premiumConfig,
      _.isEmpty(filterPremiumConfig)
        ? defaultFilterPremiumConfig
        : filterPremiumConfig
    )

    scheme.form.setSubmit(() => {
      router.push({
        query: {
          ...route.value.query,
          ...scheme.form.formData,
        },
      })
    })
    options.value = scheme.form.fields
    formData.value = scheme.form.formData

    const update = ({ id, value }: UpdateInsuranceListFilterPayload) => {
      scheme.form.updateFormData(id, value)
      scheme.form.submit()
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
