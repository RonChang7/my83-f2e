<template>
  <div class="ProductQuerySection">
    <div ref="content" class="ProductQuerySection__content">
      <ProductQueryField
        v-for="option in options"
        :key="option.id"
        class="ProductQuerySection__field"
        :option="option"
        :value="premiumQuery[fieldValueMap[option.id]]"
        :is-validated="fieldValidated[fieldValueMap[option.id]]"
        @update="updatePremiumQuery"
        @blur="fetchProductFee"
      />
      <ProductFee
        class="ProductQuerySection__fee"
        :card-height="feeCardHeight"
        :fee="fee"
        :consult-link="consultLink"
        @open-modal="$emit('open-modal')"
      />
    </div>
    <div class="ProductQuerySection__footer">
      <div class="ProductQuerySection__column">
        商品類型
        <BaseTooltip :offset="8" placement="bottom-start">
          <template v-slot:button>
            <div class="ProductQuerySection__column__icon">
              <BaseInfo />
            </div>
          </template>
          <template v-slot:content>
            <ProductQueryTooltipCard :info="contractTypeInfo" />
          </template>
        </BaseTooltip>
        <span>{{ contractType }}</span>
      </div>
      <div class="ProductQuerySection__column">
        保障類型
        <BaseTooltip :offset="8" placement="bottom-start">
          <template v-slot:button>
            <div class="ProductQuerySection__column__icon">
              <BaseInfo />
            </div>
          </template>
          <template v-slot:content>
            <ProductQueryTooltipCard :info="wholeLifeTypeInfo" />
          </template>
        </BaseTooltip>
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
import ProductQueryTooltipCard from '../product/ProductQueryTooltipCard.vue'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'
import { UpdatePremiumQueryPayload } from '@/store/insurance/product'
import {
  UPDATE_PREMIUM_QUERY_KEY,
  FETCH_PRODUCT_FEE,
  UPDATE_PREMIUM_QUERY_VALIDATE,
  CLEAR_FEE,
} from '@/store/insurance/product.type'
import { OptionValueType } from '@/api/insurance/product.type'
import { ProductQueryFormService } from '@/services/product/ProductQueryFormService'
import { FieldOption, InputType } from '@/services/product/field.type'
import { ZHTWUnitMap } from '@/utils/number-converter'
import DeviceMixin from '@/mixins/device/device-mixins'
import BaseInfo from '@/assets/icon/18/BaseInfo.svg'
import BaseTooltip from '@/components/base/tooltip/BaseTooltip.vue'

@Component({
  components: {
    ProductQueryField,
    ProductFee,
    BaseInfo,
    BaseTooltip,
    ProductQueryTooltipCard,
  },
})
export default class ProductQuerySection extends DeviceMixin {
  // 不設定初始值以避免響應
  queryForm: ProductQueryFormService

  $refs: {
    content: HTMLElement
  }

  options: FieldOption<OptionValueType>[] = []

  fetchProductFeeAction = _.debounce(
    () => this.$store.dispatch(`insuranceProduct/${FETCH_PRODUCT_FEE}`),
    50
  )

  feeCardHeight: number = 0

  contractTypeInfo = [
    {
      title: '主約',
      content: '可以單獨購買的保險契約。',
    },
    {
      title: '附約',
      content: '不能單獨購買、需搭配著主約一起購買的保險契約。',
    },
  ]

  wholeLifeTypeInfo = [
    {
      title: '終身險',
      content: '保障終身。通常繳費 20 年後即可不須再繳保費。',
    },
    {
      title: '定期險',
      content:
        '保障一定年期，如：10 年定期壽險，即保障 10 年，到期後契約終止。',
    },
  ]

  get storeState() {
    return this.$store.state as InsuranceProductVuexState
  }

  get contractType() {
    return this.storeState.insuranceProduct.product?.product.contract_type
  }

  get wholeLifeType() {
    return this.storeState.insuranceProduct.product?.product.whole_life_type
  }

  get fee() {
    return this.storeState.insuranceProduct.fee
  }

  get consultLink() {
    return this.storeState.insuranceProduct.product?.consult_link
  }

  get premiumConfig() {
    return this.storeState.insuranceProduct.product?.premium_config
  }

  get premiumQuery() {
    return this.storeState.insuranceProduct.premiumQuery
  }

  get amountUnit() {
    return this.storeState.insuranceProduct.product?.premium_config.amount_unit
  }

  get fieldValueMap() {
    return _.keys(this.premiumQuery).reduce<Record<string, string>>(
      (acc, key) => {
        if (!this.premiumConfig?.is_fixed_rate && key === 'plan') {
          acc.period = key
        } else {
          acc[_.snakeCase(key)] = key
        }

        return acc
      },
      {}
    )
  }

  get fieldValidated() {
    return this.storeState.insuranceProduct.fieldValidated
  }

  get isFieldsValidated(): boolean {
    return this.$store.getters['insuranceProduct/isFieldsValidated']
  }

  fetchProductFee() {
    this.$nextTick(() => {
      if (this.isFieldsValidated) {
        this.fetchProductFeeAction()
      } else if (this.fee !== null) {
        this.$store.commit(`insuranceProduct/${CLEAR_FEE}`)
      }
    })
  }

  validateAllField() {
    _.forEach(this.premiumQuery!, (value, id) => {
      this.updateFieldValidate(
        this.fieldValueMap[id],
        this.queryForm.validate(id, value!)
      )
    })
  }

  updateFieldValidate(key: string, status: boolean) {
    this.$store.dispatch(`insuranceProduct/${UPDATE_PREMIUM_QUERY_VALIDATE}`, {
      [key]: status,
    })
  }

  updatePremiumQuery(payload: UpdatePremiumQueryPayload) {
    const { id, value } = payload

    this.updateFieldValidate(
      this.fieldValueMap[id],
      this.queryForm.validate(id, value)
    )

    const optionType = this.options.find((option) => option.id === id)!.type

    this.$store.dispatch(`insuranceProduct/${UPDATE_PREMIUM_QUERY_KEY}`, {
      id: this.fieldValueMap[id],
      value: optionType === InputType.NUMBER ? Number(value) : value,
    })

    if (this.fieldValueMap[id] === 'plan') {
      this.updateOptions()
      this.validateAllField()
    }
  }

  updateOptions() {
    this.options = this.queryForm.getOptions(this.premiumQuery!.plan!)
  }

  created() {
    const displayAmountUnit = this.amountUnit
      ? ZHTWUnitMap[this.amountUnit] || '元'
      : undefined

    this.queryForm = new ProductQueryFormService(this.premiumConfig!, {
      age: '歲',
      amount: displayAmountUnit,
    })
    this.updateOptions()
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
