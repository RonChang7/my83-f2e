<template>
  <div class="DesktopFilterSection__wrapper">
    <template v-if="multiSection">
      <BaseCard
        v-for="field in fields"
        :key="field.id"
        class="DesktopFilterSection"
      >
        <template #title>{{ field.name }}</template>
        <template #default>
          <div class="DesktopFilterSection__content">
            <ProductQueryField
              class="DesktopFilterSection__field mb-0"
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
    <BaseCard v-else class="DesktopFilterSection">
      <template #title>投保資料</template>
      <template #default>
        <div class="DesktopFilterSection__content">
          <ProductQueryField
            v-for="field in fields"
            :key="field.id"
            class="DesktopFilterSection__field"
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
import {
  defineComponent,
  useRoute,
  useRouter,
  useStore,
  watch,
} from '@nuxtjs/composition-api'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { useInsuranceFilterForm } from '@/services/product/InsuranceFilterScheme'
import { InsuranceListType } from '@/routes/insurance'
import ProductQueryField from '../../product/ProductQueryField.vue'

export default defineComponent({
  components: {
    BaseCard,
    ProductQueryField,
    BaseInputMessage,
  },
  setup() {
    const store = useStore<InsuranceVuexState>()
    const route = useRoute()
    const router = useRouter()

    const multiSection = !(route.value.name === InsuranceListType.EXTERNAL)

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

    const {
      fields,
      formData,
      update,
      validateState,
      isAllValidated,
    } = useInsuranceFilterForm(config, initValue)

    watch(
      () => formData.value,
      _.debounce(() => {
        if (isAllValidated.value) {
          router.push({
            query: formData.value,
          })
        }
      }, 1500),
      {
        deep: true,
      }
    )

    return {
      multiSection,
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

.DesktopFilterSection {
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
}
</style>
