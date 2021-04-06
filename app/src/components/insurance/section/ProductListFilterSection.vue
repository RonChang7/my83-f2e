<template>
  <div>
    <template v-if="multiSection">
      <BaseCard
        v-for="field in fields"
        :key="field.id"
        class="ProductListFilterSection"
      >
        <template #title>{{ field.name }}</template>
        <template #default>
          <div class="ProductListFilterSection__content">
            <ProductQueryField
              class="ProductListFilterSection__field mb-0"
              :field="field"
              :value="formData[field.id]"
              :disable-label="multiSection"
              radio-type="radio"
              @update="update"
            />
            <BaseInputMessage
              v-if="validateState[field.id] && validateState[field.id].message"
              :msg="validateState[field.id].message"
              type="error"
            />
          </div>
        </template>
      </BaseCard>
    </template>
    <BaseCard v-else class="ProductListFilterSection">
      <template #title>投保資料</template>
      <template #default>
        <div class="ProductListFilterSection__content">
          <ProductQueryField
            v-for="field in fields"
            :key="field.id"
            class="ProductListFilterSection__field"
            :field="field"
            :value="formData[field.id]"
            @update="update"
          />
        </div>
      </template>
    </BaseCard>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { defineComponent, useRoute, useStore } from '@nuxtjs/composition-api'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { useInsuranceFilterForm } from '@/services/product/InsuranceFilterScheme'
import ProductQueryField from '../product/ProductQueryField.vue'

export default defineComponent({
  components: {
    BaseCard,
    ProductQueryField,
    BaseInputMessage,
  },
  props: {
    multiSection: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore<InsuranceVuexState>()
    const route = useRoute()

    const { defaultValue, config } = store.state.insurance.filter
    const queryStringValue = _.keys(config).reduce((acc, cur) => {
      if (!_.isUndefined(route.value.query[cur])) {
        acc[cur] = route.value.query[cur]
      }
      return acc
    }, {})

    const initValue = {
      ...defaultValue,
      ...queryStringValue,
    }

    const { fields, formData, update, validateState } = useInsuranceFilterForm(
      config,
      initValue
    )

    return {
      fields,
      formData,
      update,
      validateState,
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
