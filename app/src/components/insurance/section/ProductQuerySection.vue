<template>
  <div class="ProductQuerySection">
    <div ref="content" class="ProductQuerySection__content">
      <ProductQueryField
        v-for="option in options"
        :key="option.id"
        class="ProductQuerySection__field"
        :option="option"
        :value="premiumQuery[fieldValueMap[option.id]]"
        @update="updatePremiumQuery"
        @blur="fetchProductFee"
        @validate="(e) => updateFieldValidate(option.id, e)"
      />
      <ProductFee
        class="ProductQuerySection__fee"
        :card-height="feeCardHeight"
        :fee="fee"
        :consult-link="consultLink"
        @open-panel="$emit('open-panel', true)"
      />
    </div>
    <div class="ProductQuerySection__footer">
      <div class="ProductQuerySection__column">
        商品類型
        <span>{{ contractType }}</span>
      </div>
      <div class="ProductQuerySection__column">
        保障類型
        <span>{{ wholeLifeType }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { Component } from 'vue-property-decorator'
import ProductQueryField from '../product/ProductQueryField.vue'
import ProductFee from '../product/ProductFee.vue'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'
import { UpdatePremiumQueryPayload } from '@/store/insurance/product'
import {
  UPDATE_PREMIUM_QUERY_KEY,
  FETCH_PRODUCT_FEE,
  UPDATE_PREMIUM_QUERY_VALIDATE,
} from '@/store/insurance/product.type'
import { OptionValueType } from '@/api/insurance/product.type'
import {
  FieldOption,
  ProductQueryFormService,
} from '@/services/product/ProductQueryFormService'
import { ZHTWUnitMap } from '@/utils/number-converter'
import { camelToSnakeCase } from '@/utils/text-parser'
import DeviceMixin from '@/mixins/device/device-mixins'

@Component({
  components: {
    ProductQueryField,
    ProductFee,
  },
})
export default class ProductQuerySection extends DeviceMixin {
  // 不設定初始值以避免響應
  queryForm: ProductQueryFormService

  $refs: {
    content: HTMLElement
  }

  options: FieldOption<OptionValueType>[] = []

  fetchProductFeeAction = _.throttle(
    () => this.$store.dispatch(`insuranceProduct/${FETCH_PRODUCT_FEE}`),
    500
  )

  feeCardHeight: number = 0

  get contractType() {
    return (this.$store.state as InsuranceProductVuexState).insuranceProduct
      .product?.contract_type
  }

  get wholeLifeType() {
    return (this.$store.state as InsuranceProductVuexState).insuranceProduct
      .product?.whole_life_type
  }

  get fee() {
    return this.isFieldValidated
      ? (this.$store.state as InsuranceProductVuexState).insuranceProduct.fee
      : -1
  }

  get consultLink() {
    return (this.$store.state as InsuranceProductVuexState).insuranceProduct
      .product?.consult_link
  }

  get premiumConfig() {
    const state = this.$store.state as InsuranceProductVuexState
    return state.insuranceProduct.product?.premium_config
  }

  get premiumQuery() {
    const state = this.$store.state as InsuranceProductVuexState
    return state.insuranceProduct.premiumQuery
  }

  get fieldValueMap() {
    return _.keys(this.premiumQuery).reduce<Record<string, string>>(
      (acc, key) => {
        if (!this.premiumConfig?.is_fixed_rate && key === 'plan') {
          acc.period = key
        } else {
          acc[camelToSnakeCase(key)] = key
        }

        return acc
      },
      {}
    )
  }

  get isFieldValidated(): boolean {
    return this.$store.getters['insuranceProduct/isFieldValidated']
  }

  fetchProductFee() {
    if (this.isFieldValidated) {
      this.fetchProductFeeAction()
    }
  }

  updateFieldValidate(key: string, status: boolean) {
    this.$store.dispatch(`insuranceProduct/${UPDATE_PREMIUM_QUERY_VALIDATE}`, {
      [key]: status,
    })
  }

  updatePremiumQuery(payload: UpdatePremiumQueryPayload) {
    this.$store.dispatch(
      `insuranceProduct/${UPDATE_PREMIUM_QUERY_KEY}`,
      payload
    )
  }

  created() {
    this.queryForm = new ProductQueryFormService(this.premiumConfig!, {
      age: '歲',
      amount: ZHTWUnitMap[this.premiumQuery!.amountUnit!],
    })
    this.options = this.queryForm.getOptions(this.premiumQuery!.plan!)
  }

  mounted() {
    this.feeCardHeight = this.isDesktop
      ? this.$refs.content.offsetHeight - 22
      : 160
  }
}
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

    @include max-media('xl') {
      position: relative;
      margin: -160px auto 16px;
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

    @include max-media('xl') {
      flex: 1 1 auto;

      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
