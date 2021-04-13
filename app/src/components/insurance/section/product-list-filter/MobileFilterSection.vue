<template>
  <div class="MobileFilterSection">
    <BaseButton
      size="m"
      type="tertiary"
      :is-full-width="true"
      @click.native="openPanel"
    >
      <BaseFilter18 class="mr-1" />
      篩選商品
      <template v-if="filterNumberCount">({{ filterNumberCount }})</template>
    </BaseButton>
    <div class="MobileFilterSection__description">{{ description }}</div>
    <BaseInfoModal :visible="visiblePanel" @close="closePanel">
      <div class="MobileFilterSection__title">
        <BaseFilter24 class="mr-1" />
        篩選商品
      </div>
      <div class="MobileFilterSection__content">
        <div
          v-for="field in form.fields"
          :key="field.id"
          class="MobileFilterSection__section"
        >
          <div class="MobileFilterSection__section__title">
            {{ field.name }}
          </div>
          <div class="MobileFilterSection__section__content">
            <ProductQueryField
              class="MobileFilterSection__section__field"
              :field="field"
              :value="form.formData[field.id]"
              :disable-label="true"
              radio-type="radio"
              @update="form.update"
            />
            <BaseInputMessage
              v-if="
                form.validateState[field.id] &&
                form.validateState[field.id].message
              "
              class="MobileFilterSection__section__message"
              :msg="form.validateState[field.id].message"
              type="error"
            />
          </div>
        </div>
      </div>
      <div class="MobileFilterSection__footer">
        <BaseButton
          size="l-a"
          type="secondary"
          :is-full-width="true"
          @click.native="reset"
        >
          重設
        </BaseButton>
        <BaseButton
          size="l-a"
          type="primary"
          :is-full-width="true"
          :disabled="!form.isAllValidated"
          @click.native="submit"
        >
          套用
        </BaseButton>
      </div>
    </BaseInfoModal>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import {
  computed,
  defineComponent,
  nextTick,
  ref,
  useRoute,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { useInsuranceFilterForm } from '@/services/product/InsuranceFilterScheme'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseInfoModal from '@/components/my83-ui-kit/modal/BaseInfoModal.vue'
import BaseFilter18 from '@/assets/icon/18/BaseFilter.svg'
import BaseFilter24 from '@/assets/icon/24/BaseFilter.svg'
import ProductQueryField from '../../product/ProductQueryField.vue'

export default defineComponent({
  components: {
    ProductQueryField,
    BaseInputMessage,
    BaseButton,
    BaseInfoModal,
    BaseFilter18,
    BaseFilter24,
  },
  setup(props, ctx) {
    const store = useStore<InsuranceVuexState>()
    const route = useRoute()
    const router = useRouter()

    const visiblePanel = ref(false)
    const openPanel = () => (visiblePanel.value = true)
    const closePanel = () => (visiblePanel.value = false)
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
    const description = computed(
      () =>
        store.state.insurance.staticData.productListDescription ||
        '依熱門度排序。費率以 30 歲女性為基準。'
    )

    const filterNumberCount = computed(() => {
      return _.reduce(
        form.value.formData,
        (result, value, key) => {
          if (!defaultValue) return result

          if (_.isArray(defaultValue[key])) {
            !_.isEqual(
              (_.cloneDeep(defaultValue[key]) as any[]).sort(),
              (_.cloneDeep(value) as any[]).sort()
            ) && result++
          } else {
            !_.isEqual(defaultValue[key], value) && result++
          }

          return result
        },
        0
      )
    })

    const reset = function () {
      if (defaultValue) {
        form.value = useInsuranceFilterForm(config, defaultValue)
      }
    }

    const submit = () => {
      router.push({
        query: form.value.formData,
      })

      closePanel()

      nextTick(() => {
        ctx.emit('submit')
      })
    }

    return {
      form,
      visiblePanel,
      openPanel,
      closePanel,
      reset,
      submit,
      filterNumberCount,
      description,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.MobileFilterSection {
  padding: 6px 20px 0;

  &__description {
    margin: 10px 0;
    font-size: 0.875rem;
    color: $gray-primary;

    @include min-media('xl') {
      display: none;
    }
  }

  &__title,
  &__footer {
    @include shadow('01');

    position: absolute;

    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    background: #fff;
  }

  &__title {
    padding: 16px 20px;
    top: 0;
    font-size: 1.125rem;
    font-weight: 500;
  }

  &__footer {
    padding: 14px 20px;
    box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
    bottom: 0;

    > button {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }

  &__content {
    margin: 20px -15px 0;
    padding: 0 20px 72px;
    height: 100%;
    overflow: scroll;
  }

  &__section {
    &__title {
      padding: 12px 0 10px;
    }

    &__content {
      margin-left: 10px;

      &:after {
        content: '';
        display: block;
        margin: 0 -20px 0 -30px;
        border-bottom: 1px solid $secondary-bg;
      }
    }

    &__field {
      margin-bottom: 12px;
    }

    ::v-deep &__message {
      padding: 0;
      margin-bottom: 12px;
    }
  }
}
</style>
