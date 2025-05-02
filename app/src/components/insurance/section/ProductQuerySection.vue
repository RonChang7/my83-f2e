<template>
  <div class="ProductQuerySection">
    <div ref="content" class="ProductQuerySection__content">
      <!-- 年齡欄位 -->
      <ProductQueryField
        class="ProductQuerySection__field"
        :field="fields.age"
        :value="formData.age"
        :validate-state="validateStates.age"
        @update="updateField"
        @blur="calculateFee"
      />

      <!-- 性別欄位 -->
      <ProductQueryField
        class="ProductQuerySection__field"
        :field="fields.gender"
        :value="formData.gender"
        :validate-state="validateStates.gender"
        @update="updateField"
        @blur="calculateFee"
      />

      <!-- 職業等級欄位 -->
      <ProductQueryField
        v-if="fields.job_level"
        class="ProductQuerySection__field"
        :field="fields.job_level"
        :value="formData.job_level"
        :validate-state="validateStates.job_level"
        @update="updateField"
        @blur="calculateFee"
      />

      <!-- 保險期間欄位 -->
      <ProductQueryField
        v-if="fields.period"
        class="ProductQuerySection__field"
        :field="fields.period"
        :value="formData.period"
        :validate-state="validateStates.period"
        @update="updateField"
        @blur="calculateFee"
      />

      <!-- 保額欄位 -->
      <ProductQueryField
        class="ProductQuerySection__field"
        :field="fields.amount"
        :value="formData.amount"
        :validate-state="validateStates.amount"
        @update="updateField"
        @blur="calculateFee"
      />

      <!-- 保費顯示 -->
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
        <span>{{ productType }}</span>
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
        <span>{{ insuranceType }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  useStore,
  watch,
} from '@nuxtjs/composition-api'
import { useDevice } from '@/mixins/device/device-mixins'
import BaseInfo from '@/assets/icon/18/BaseInfo.svg'
import BaseTooltip from '@/components/base/tooltip/BaseTooltip.vue'
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
    const store = useStore()
    const { isDesktop } = useDevice()
    const content = ref<HTMLElement | null>(null)
    const feeCardHeight = ref(0)
    const singleProduct = computed(
      () => store.state.insuranceProduct.singleProduct
    )

    // 基本資訊
    const productType = computed(() => singleProduct.value?.setting.productType)
    const insuranceType = computed(
      () => singleProduct.value?.setting.insuranceType
    )
    const consultLink = computed(() => ({
      path: '/consult',
      url: 'https://my83.com/consult',
    })) // 假設的連結

    // 表單欄位定義
    const fields = reactive({
      age: {
        id: 'age',
        name: '年齡',
        type: 'NUMBER',
        placeholder: '請輸入年齡',
        options: computed(() => {
          if (!singleProduct.value) return { min: 18, max: 65 }

          // 從 setPeriod 中找到年齡範圍
          const periods = singleProduct.value.setting.setPeriod || []
          const minAge = Math.min(
            ...periods.map((p) => parseInt(p.ageMin) || 18)
          )
          const maxAge = Math.max(
            ...periods.map((p) => parseInt(p.ageMax) || 65)
          )

          return {
            min: minAge,
            max: maxAge,
          }
        }),
      },
      gender: {
        id: 'gender',
        name: '性別',
        type: 'RADIO',
        options: computed(() => {
          if (!singleProduct.value || !singleProduct.value.setting.setSex) {
            return [
              { text: '男性 ', value: '男性' },
              { text: '女性', value: '女性' },
            ]
          }

          return singleProduct.value.setting.setSex.map((sex, idx) => ({
            text: sex.content,
            value: idx,
          }))
        }),
      },
      job_level: computed(() => {
        if (
          !singleProduct.value ||
          !singleProduct.value.setting.setJob ||
          !singleProduct.value.setting.setJob.length
        ) {
          return null
        }

        return {
          id: 'job_level',
          name: '職業等級',
          type: 'OPTION',
          options: singleProduct.value.setting.setJob.map((job, index) => ({
            text: job.content,
            value: index + 1,
          })),
        }
      }),
      period: computed(() => {
        if (
          !singleProduct.value ||
          !singleProduct.value.setting.setPeriod ||
          !singleProduct.value.setting.setPeriod.length
        ) {
          return null
        }

        return {
          id: 'period',
          name: '年期',
          type: 'OPTION',
          options: singleProduct.value.setting.setPeriod.map(
            (period, index) => ({
              text: period.content,
              value: index,
            })
          ),
        }
      }),
      amount: {
        id: 'amount',
        name: '保額',
        type: 'NUMBER',
        placeholder: '請輸入保額',
        postfix: '元',
        options: computed(() => {
          if (!singleProduct.value) return { min: 100000, step: 10000 }

          return {
            min: parseInt(singleProduct.value.setting.defaultAmount) || 100000,
            step: parseInt(singleProduct.value.setting.unitstep) || 10000,
          }
        }),
      },
    })

    // 表單數據
    const formData = reactive({
      age: computed(() => singleProduct.value?.setting.defaultAge || 30),
      gender: computed(() =>
        singleProduct.value?.setting.defaultSex === '男' ? 'male' : 'female'
      ),
      job_level: computed(() => 1), // 預設值
      period: computed(() => 1), // 預設值
      amount: computed(
        () => parseInt(singleProduct.value?.setting.defaultAmount) || 1000000
      ),
    })

    // 表單驗證狀態
    const validateStates = reactive({
      age: null,
      gender: null,
      job_level: null,
      period: null,
      amount: null,
    })

    // 保費
    const fee = ref(0)

    // 更新保障內容
    const updateCoverages = () => {
      if (!singleProduct.value || !singleProduct.value.benefit) return

      const coverages = []

      singleProduct.value.benefit.forEach((benefitGroup) => {
        if (!benefitGroup.benefitMain) return

        benefitGroup.benefitMain.forEach((benefit) => {
          // 計算保障金額
          const amount = formData.amount // 簡單起見，以保額為基準

          coverages.push({
            name: benefit.name,
            content: benefit.remark || '',
            amount,
            levels: [],
            ideal_amount: amount, // 假設理想保額等於保額
          })
        })
      })

      // 如果你需要更新 store 中的保障內容，可以在這裡提交
      // store.commit('insuranceProduct/UPDATE_COVERAGE', coverages)
    }

    // 表單驗證函數
    const validateForm = () => {
      let isValid = true

      // 驗證年齡
      if (fields.age && fields.age.options) {
        const { min, max } = fields.age.options
        if (!formData.age || formData.age < min || formData.age > max) {
          validateStates.age = {
            state: 'error',
            message: `年齡必須在 ${min} 到 ${max} 之間`,
          }
          isValid = false
        } else {
          validateStates.age = null
        }
      }

      // 驗證保額
      if (fields.amount && fields.amount.options) {
        const { min } = fields.amount.options
        if (!formData.amount || formData.amount < min) {
          validateStates.amount = {
            state: 'error',
            message: `保額不能低於 ${min}`,
          }
          isValid = false
        } else {
          validateStates.amount = null
        }
      }

      return isValid
    }

    // 計算保費的函數
    const calculateFee = _.debounce(() => {
      // 確保數據有效
      if (!validateForm()) {
        fee.value = 0
        return
      }

      if (!singleProduct.value || !singleProduct.value.premium) {
        fee.value = 0
        return
      }

      // 從 premium 數據中找到符合條件的項目
      const selectedPeriod = formData.period
      const periodText =
        (fields.period && fields.period.options[selectedPeriod - 1]?.text) || ''

      const matchedPremium = singleProduct.value.premium.find(
        (p) =>
          p.Age === formData.age &&
          p.Sex === (formData.gender === 'male' ? '男' : '女') &&
          (fields.job_level ? parseInt(p.Job) === formData.job_level : true) &&
          (fields.period ? p.Period === periodText.split('/')[0] : true)
      )

      if (matchedPremium) {
        // 計算保費: 基本保費 * (保額 / 單位保額)
        const baseFee = parseInt(matchedPremium.Value)
        const unitAmount = parseInt(singleProduct.value.setting.defaultAmount)
        const selectedAmount = formData.amount

        fee.value = Math.round(baseFee * (selectedAmount / unitAmount))
      } else {
        fee.value = 0
      }

      // 更新保障內容
      updateCoverages()
    }, 200)

    // 更新欄位值
    const updateField = ({ id, value }) => {
      if (id in formData) {
        formData[id] = value

        // 驗證單一欄位
        if (id === 'age') {
          const { min, max } = fields.age.options
          if (!value || value < min || value > max) {
            validateStates.age = {
              state: 'error',
              message: `年齡必須在 ${min} 到 ${max} 之間`,
            }
          } else {
            validateStates.age = null
          }
        } else if (id === 'amount') {
          const { min } = fields.amount.options
          if (!value || value < min) {
            validateStates.amount = {
              state: 'error',
              message: `保額不能低於 ${min}`,
            }
          } else {
            validateStates.amount = null
          }
        }

        // 當欄位變更時可以即時計算保費
        calculateFee()
      }
    }

    onMounted(() => {
      // 調整費率區塊位置
      feeCardHeight.value = isDesktop.value
        ? (content.value as HTMLElement).offsetHeight - 22
        : 160

      // 初始計算保費
      calculateFee()
    })

    // 監聽產品數據變更，重新計算保費
    watch(
      () => singleProduct.value,
      () => {
        calculateFee()
      }
    )

    return {
      content,
      fields,
      formData,
      validateStates,
      updateField,
      calculateFee,
      feeCardHeight,
      insuranceType,
      productType,
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
