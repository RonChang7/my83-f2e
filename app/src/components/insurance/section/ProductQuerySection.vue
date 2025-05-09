<template>
  <div class="ProductQuerySection">
    <div ref="content" class="ProductQuerySection__content">
      <!-- 年齡欄位 -->
      <ProductQueryField
        class="ProductQuerySection__field"
        :field="fields.age"
        :value="userInfo.age"
        :validate-state="validateStates.age"
        @update="updateField"
      />

      <!-- 性別欄位 -->
      <ProductQueryField
        class="ProductQuerySection__field"
        :field="fields.sex"
        :value="userInfo.sex"
        @update="updateField"
      />

      <!-- 職業等級欄位 - 只有當產品有職業等級設定時才顯示 -->
      <ProductQueryField
        v-if="fields.job_level"
        class="ProductQuerySection__field"
        :field="fields.job_level"
        :value="userInfo.job_level"
        @update="updateField"
      />

      <!-- case欄位 - 年期/計畫 -->
      <ProductQueryField
        v-if="fields.period"
        class="ProductQuerySection__field"
        :field="fields.period"
        :value="userInfo.period"
        @update="updateField"
      />

      <!-- 保額欄位 -->
      <ProductQueryField
        v-if="setting.unit"
        class="ProductQuerySection__field"
        :field="fields.amount"
        :value="userInfo.amount"
        :validate-state="validateStates.amount"
        @update="updateField"
      />

      <!-- 保費顯示區塊 - 顯示計算結果 -->
      <ProductFee
        class="ProductQuerySection__fee"
        :card-height="feeCardHeight"
        :fee="yearFee"
        :consult-link="consultLink"
        :insurance-type="setting && setting.insuranceType"
        @open-modal="$emit('open-modal')"
      />
    </div>
    <div class="ProductQuerySection__footer">
      <!-- 商品類型資訊 -->
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
        <span>{{ setting && setting.productType }}</span>
      </div>
      <!-- 保障類型資訊 -->
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
        <span>{{ setting && setting.insuranceType }}</span>
      </div>
      <!-- 保障年期資訊 -->
      <div class="ProductQuerySection__column">
        保障年期
        <span>{{ userInfo.selectedCase.insurancePeriod }}</span>
      </div>
      <!-- 繳費年期資訊 -->
      <div class="ProductQuerySection__column">
        繳費年期
        <span>{{ userInfo.selectedCase.paymentPeriod }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  useStore,
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
    // 取得 Vuex store 和裝置資訊
    const store = useStore()
    const { isDesktop } = useDevice()

    // 用於保存 DOM 元素引用和計算保費卡片高度
    const content = ref<HTMLElement | null>(null)
    const feeCardHeight = ref(0)

    // 從 store 中獲取保險產品資料
    const singleProduct = computed(
      () => store.state.insuranceProduct.singleProduct
    )

    // 基本資訊區塊 - 從產品資料中提取基本屬性
    const basic = computed(() => singleProduct.value?.basic)
    const setting = computed(() => singleProduct.value?.setting)
    const premium = computed(() => singleProduct.value?.premium)
    const benefit = computed(() => singleProduct.value?.benefit)

    // userInfo
    const userInfo = reactive({
      age: 0,
      sex: '',
      job_level: '',
      period: '',
      body: '',
      amount: 0,
      selectedCase: {
        // 動態生成可能為年期或專案或其他
        ageMin: 0,
        ageMax: 0,
        amountMin: 0,
        amountMax: 0,
        content: '',
        insurancePeriod: '',
        paymentPeriod: '',
      },
    })

    const amountMin = computed(() => {
      const result = userInfo.selectedCase?.amountMin * setting.value?.unitstep
      return Math.round(result * 100) / 100 // 使用 Math.round() 解決精度問題
    })
    const amountMax = computed(() => {
      const result = userInfo.selectedCase?.amountMax * setting.value?.unitstep
      return Math.round(result * 100) / 100 // 使用 Math.round() 解決精度問題
    })

    const choosePeriod = () => {
      const selectedItem = setting.value.setPeriod.find(
        (item) => item.content === userInfo.period
      )
      userInfo.selectedCase = selectedItem
    }

    // 諮詢連結 - 假設連結
    const consultLink = computed(() => ({
      path: '/consult',
      url: 'https://my83.com/consult',
    }))

    // 表單欄位定義 - 使用 reactive 創建響應式物件
    const fields = reactive({
      // 年齡欄位定義
      age: {
        id: 'age',
        name: '年齡',
        type: 'NUMBER',
        // 顯示年齡範圍提示
        range: computed(
          () =>
            `(${userInfo.selectedCase.ageMin} - ${userInfo.selectedCase.ageMax}歲)`
        ),
      },
      // 性別欄位定義
      sex: {
        id: 'sex',
        name: '性別',
        type: 'RADIO',
        // 根據產品設置動態生成性別選項
        options: computed(() => {
          if (!singleProduct.value || !singleProduct.value.setting.setSex) {
            return [
              { text: '男性 ', value: '男性' },
              { text: '女性', value: '女性' },
            ]
          }

          return singleProduct.value.setting.setSex.map((sex) => ({
            text: sex.content,
            value: sex.content,
          }))
        }),
      },
      // 職業等級欄位 - 只有當產品有相關設置時才會有值
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
          options: singleProduct.value.setting.setJob.map((job) => ({
            text: job.content,
            value: job.content,
          })),
        }
      }),
      // 年期欄位 - 只有當產品有相關設置時才會有值
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
          name: setting.value.casePeriod,
          type: 'OPTION',
          options: singleProduct.value.setting.setPeriod.map((period) => ({
            ...period,
            text: period.content,
            value: period.content,
          })),
        }
      }),
      // 保額欄位定義
      // TODO:step似乎只能用1跳
      amount: {
        id: 'amount',
        name: '保額',
        type: 'NUMBER',
        postfix: setting.value?.unit,
        // 根據產品設置計算保額限制和步進值
        range: computed(() => {
          return `(${amountMin.value} - ${amountMax.value} ${setting.value?.unit})`
        }),
      },
    })

    // 表單驗證狀態 - 存儲各欄位驗證結果
    const validateStates = reactive({
      age: null,
      amount: null,
    })

    const yearFee = computed(() => {
      if (
        userInfo.amount < amountMin.value ||
        userInfo.amount > amountMax.value
      ) {
        return 0
      }
      if (premium.value?.length) {
        const formattedJob = Number(userInfo.job_level.slice(2))
        const found = premium.value.find((item) => {
          return (
            (!('Sex' in item) || item.Sex === userInfo.sex) &&
            (!('Age' in item) || item.Age === userInfo.age) &&
            (!('Job' in item) || item.Job === formattedJob) &&
            (!('Body' in item) || item.Body === userInfo.body) &&
            (!('Period' in item) || item.Period === userInfo.period)
          )
        })

        if (found) {
          if (setting.value?.unit) {
            const result =
              (userInfo.amount * found.Value * 100) /
              setting.value?.unitstep /
              100
            return Math.round(result)
          }
          return Math.round(found.Value)
        }
      }
      return 0
    })

    // 更新欄位值的處理函數
    const updateField = ({ id, value }) => {
      // console.log('updateField', id, value)
      if (id in userInfo) {
        // 更新欄位值
        userInfo[id] = value

        // 根據欄位類型進行單獨驗證
        if (id === 'age') {
          const { ageMin, ageMax } = userInfo.selectedCase
          if (value < ageMin || value > ageMax) {
            validateStates.age = {
              state: 'error',
              message: `年齡不符`,
            }
          } else {
            validateStates.age = null
          }
        } else if (id === 'amount') {
          if (value < amountMin.value || value > amountMax.value) {
            validateStates.amount = {
              state: 'error',
              message: `保額有誤`,
            }
          } else {
            validateStates.amount = null
          }
        }
      }
    }

    // 組件掛載後的處理
    onMounted(() => {
      // 根據裝置類型調整費率區塊位置
      feeCardHeight.value = isDesktop.value
        ? (content.value as HTMLElement).offsetHeight - 22
        : 160

      userInfo.sex = singleProduct.value?.setting.defaultSex
      userInfo.job_level = singleProduct.value?.setting.defaultJob
      userInfo.period = singleProduct.value?.setting.defaultPeriod
      choosePeriod()
      if (setting.value.defaultAge > userInfo.selectedCase.ageMax) {
        userInfo.age = userInfo.selectedCase.ageMax
      } else {
        userInfo.age = setting.value.defaultAge
      }
      userInfo.amount = amountMin.value
      // 初始化時計算年繳保費
      // console.log(yearFee.value)
      // console.log(userInfo)
    })

    // 返回所有需要在模板中使用的變數和方法
    return {
      content,
      fields,
      validateStates,
      updateField,
      feeCardHeight,
      basic,
      setting,
      premium,
      benefit,
      consultLink,
      yearFee,
      userInfo,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductQuerySection {
  // 桌面版使用卡片樣式
  @include min-media('xl') {
    @include card-primary;
  }

  &__content,
  &__footer {
    // 行動版使用簡化卡片樣式
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

    // 行動版佈局調整
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

    // 行動版佈局調整
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

    // 行動版保費卡片位置調整
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

    // 行動版佈局調整
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

    // 行動版佈局調整
    @include max-media('xl') {
      flex: 1 1 auto;

      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
