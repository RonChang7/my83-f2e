<template>
  <div class="ProductQuerySection">
    <div ref="content" class="ProductQuerySection__content">
      <ProductQueryField
        v-for="option in options"
        :key="option.id"
        class="ProductQuerySection__field"
        :option="option"
        :value="formData[option.id]"
        :validate-state="validateState[option.id]"
        @update="update"
        @blur="submit"
      />
      <ProductFee
        class="ProductQuerySection__fee"
        :card-height="feeCardHeight"
        :fee="fee"
        :consult-link="consultLink"
        :insurance-type="insuranceType"
        @open-modal="$emit('open-modal')"
      />
    </div>
    <div class="ProductQuerySection__footer">
      <div class="ProductQuerySection__column">
        商品類型
        <BaseTooltip :offset="8" placement="bottom-start">
          <template #button>
            <div class="ProductQuerySection__column__icon">
              <BaseInfo />
            </div>
          </template>
          <template #content>
            <ContractTypeCard />
          </template>
        </BaseTooltip>
        <span>{{ contractType }}</span>
      </div>
      <div class="ProductQuerySection__column">
        保障類型
        <BaseTooltip :offset="8" placement="bottom-start">
          <template #button>
            <div class="ProductQuerySection__column__icon">
              <BaseInfo />
            </div>
          </template>
          <template #content>
            <WholeLifeTypeCard />
          </template>
        </BaseTooltip>
        <span>{{ wholeLifeType }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from '@nuxtjs/composition-api'
import { useStore } from '@/utils/composition-api'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'
import { FETCH_PRODUCT_FEE, CLEAR_FEE } from '@/store/insurance/product.type'
import { useDevice } from '@/mixins/device/device-mixins'
import BaseInfo from '@/assets/icon/18/BaseInfo.svg'
import BaseTooltip from '@/components/base/tooltip/BaseTooltip.vue'
import { useProductQuery } from '@/services/product/ProductQueryScheme'
import WholeLifeTypeCard from '../product/tooltip-card/WholeLifeTypeCard.vue'
import ContractTypeCard from '../product/tooltip-card/ContractTypeCard.vue'
import ProductFee from '../product/ProductFee.vue'
import ProductQueryField from '../product/ProductQueryField.vue'

export default defineComponent({
  components: {
    ProductQueryField,
    ProductFee,
    BaseInfo,
    BaseTooltip,
    ContractTypeCard,
    WholeLifeTypeCard,
  },
  setup() {
    const store = useStore<InsuranceProductVuexState>()
    const { isDesktop } = useDevice()
    const content = ref<HTMLElement | null>(null)
    const feeCardHeight = ref(0)
    const options = ref({})
    const formData = ref({})
    const submit = ref({})

    const insuranceType = computed(
      () => store.state.pageMeta.pageMeta?.breadcrumbs?.[0].name || ''
    )
    const contractType = computed(
      () => store.state.insuranceProduct.product?.product.contract_type
    )
    const wholeLifeType = computed(
      () => store.state.insuranceProduct.product?.product.whole_life_type
    )
    const fee = computed(() => store.state.insuranceProduct.fee)
    const consultLink = computed(
      () => store.state.insuranceProduct.product?.consult_link
    )
    const premiumConfig = computed(
      () => store.state.insuranceProduct.product?.premium_config
    )
    const amountUnit = computed(
      () => store.state.insuranceProduct.product?.premium_config.amount_unit
    )

    const { scheme, validateState, validateAll, update } = useProductQuery(
      premiumConfig?.value,
      store.state.insuranceProduct.product!.default_premium_config
    )

    const fetchProductFeeAction = _.debounce(() => {
      const payload = {
        productId: store.state.insuranceProduct.id,
        amountUnit: amountUnit.value,
        ...formData.value,
      }
      store.dispatch(`insuranceProduct/${FETCH_PRODUCT_FEE}`, payload)
    }, 50)

    const fetchProductFee = () => {
      nextTick(async () => {
        if (await validateAll()) {
          fetchProductFeeAction()
        } else {
          store.commit(`insuranceProduct/${CLEAR_FEE}`)
        }
      })
    }

    const createReactive = () => {
      formData.value = reactive(scheme.form.formData)
      options.value = reactive(scheme.form.fields)
      validateState.value = reactive(scheme.form.validateState)
      scheme.form.setSubmit(fetchProductFee)
      submit.value = () => scheme.form.submit()
    }

    createReactive()

    onMounted(() => {
      // 調整費率區塊位置
      feeCardHeight.value = isDesktop.value
        ? (content.value as HTMLElement).offsetHeight - 22
        : 160
    })

    watch(
      () => scheme.form.formData.plan_id,
      async (val) => {
        // 更新 plan id，重建整張 form
        scheme.updateForm(val)
        await validateAll()
        // 重新建立 form 響應的資料
        createReactive()
      }
    )

    return {
      content,
      options,
      formData,
      validateState,
      update,
      submit,
      feeCardHeight,
      insuranceType,
      contractType,
      wholeLifeType,
      fee,
      consultLink,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductQuerySection {
  @include min-media('xl') {
    @include card-primary;
  }

  &__content,
  &__footer {
    @include max-media('xl') {
      @include card-secondary;
    }

    display: flex;
    width: 100%;
    color: $gray-primary;
    font-size: 1rem;
    font-weight: 500;
  }

  &__content {
    padding: 32px 116px 4px 40px;
    flex-wrap: wrap;
    position: relative;

    @include max-media('xl') {
      padding: 20px;
      flex-direction: column;
      margin-bottom: 140px;
    }
  }

  &__field {
    flex: 0 1 auto;
    width: 50%;
    padding-right: 40px;

    @include max-media('xl') {
      width: 100%;
      padding: 0;
    }
  }

  &__fee {
    position: absolute;
    margin-top: -20px;
    margin-left: 675px;
    left: 40px;
    top: 32px;

    @include max-media('xl') {
      position: relative;
      margin: -160px auto 10px;
      top: 160px;
      left: -20px;
    }
  }

  &__footer {
    padding: 20px 154px 20px 40px;
    border-top: 1px solid $gray-quaternary;

    span {
      color: $primary-color;
    }

    @include max-media('xl') {
      padding: 20px;
      flex-direction: column;
    }
  }

  &__column {
    flex: 0 0 50%;
    display: flex;
    align-items: center;

    &__icon {
      @include hover('_gray-secondary-darker', $has-svg: true);

      margin: -2px 8px 0 2px;
    }

    @include max-media('xl') {
      flex: 1 1 auto;

      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
