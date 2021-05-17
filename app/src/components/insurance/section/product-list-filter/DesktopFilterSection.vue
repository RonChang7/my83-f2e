<template>
  <div class="DesktopFilterSection__wrapper">
    <template v-if="multiSection">
      <BaseCard
        v-for="field in form.fields"
        :key="field.id"
        class="DesktopFilterSection"
      >
        <template #title>{{ field.name }}</template>
        <template #default>
          <div class="DesktopFilterSection__content">
            <ProductQueryField
              class="DesktopFilterSection__field mb-0"
              :field="field"
              :value="form.formData[field.id]"
              :disable-label="multiSection"
              radio-type="radio"
              @update="update"
            />
            <BaseInputMessage
              v-if="
                form.validateState[field.id] &&
                form.validateState[field.id].message
              "
              :msg="form.validateState[field.id].message"
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
            v-for="field in form.fields"
            :key="field.id"
            class="DesktopFilterSection__field"
            :field="field"
            :value="form.formData[field.id]"
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
  ref,
  useRoute,
  useRouter,
  useStore,
  watch,
} from '@nuxtjs/composition-api'
import { useAnalytics } from '@/utils/composition-api'
import { EventTypes } from '@/analytics/event-listeners/event.type'
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
  setup(props, ctx) {
    const store = useStore<InsuranceVuexState>()
    const route = useRoute()
    const router = useRouter()
    const analytics = useAnalytics()

    const multiSection = !(route.value.name === InsuranceListType.EXTERNAL)
    const pageType =
      route.value.name === InsuranceListType.FEATURE_TAG
        ? '主題標籤頁'
        : route.value.name === InsuranceListType.SEARCH
        ? '搜尋結果頁'
        : '險種頁'

    let isResetForm = false
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

    const form = ref(useInsuranceFilterForm(config, initValue))

    const tracking = (label: string) => {
      analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: '篩選商品',
        action: pageType,
        label,
      })
    }

    const update: typeof form.value.update = (payload) => {
      const trackingLabel = form.value.fields.find(
        (field) => field.id === payload.id
      )?.name
      if (trackingLabel) {
        tracking(trackingLabel)
      }
      isResetForm = false
      return form.value.update(payload)
    }

    const updateQuery = _.debounce(() => {
      if (
        _.isEqual(route.value.query, form.value.formData) ||
        _.isEmpty(route.value.query)
      ) {
        ctx.emit('loading', false)
      }

      if (form.value.isAllValidated) {
        const query = form.value.formData

        if (route.value.name === InsuranceListType.SEARCH) {
          query.q = route.value.query.q
        }

        router.push({ query })
      }
    }, 1000)

    watch(
      () => form.value.formData,
      () => {
        if (isResetForm) return

        ctx.emit('loading', form.value.isAllValidated)
        updateQuery()
      },
      {
        deep: true,
      }
    )

    watch(
      () => store.state.insurance.filter.config,
      () => {
        isResetForm = true
        const { defaultValue, config } = store.state.insurance.filter
        form.value = useInsuranceFilterForm(config, defaultValue)
      }
    )

    return {
      multiSection,
      form,
      update,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.DesktopFilterSection {
  margin-bottom: 10px;

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
