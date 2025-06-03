<template>
  <div class="ProductCoverageCard">
    <div class="ProductCoverageCard__header">
      <h3 class="ProductCoverageCard__name">
        {{ coverage.name }}
      </h3>
      <BaseTooltip v-if="coverage.note" :offset="8" placement="bottom-start">
        <template #button>
          <div class="ProductQuerySection__column__icon">
            <BaseInfo />
          </div>
        </template>
        <template #content>
          <TooltipCard :info="[{ title: '', content: coverage.note }]" />
        </template>
      </BaseTooltip>
    </div>
    <template v-if="typeof coverage.content === 'string'">
      <div class="ProductCoverageCard__content">
        {{ coverage.content }}
      </div>
    </template>
    <template v-else>
      <div
        v-for="(item, index) in coverage.content"
        :key="index"
        class="ProductCoverageCard__content"
      >
        <div class="ProductCoverageCard__info">
          <div style="font-weight: 700">{{ item.title }}</div>
          <div class="ProductCoverageCard__amount">
            {{ processValue(item.highlight) }}
          </div>
        </div>
        <div class="ProductCoverageCard__remark">{{ item.remark }}</div>
      </div>
      <div
        v-if="coverage.table.length && isActive"
        class="ProductCoverageCard__table"
      >
        <table>
          <tr v-for="(row, idx) in coverage.table" :key="idx">
            <td v-for="(cell, key) in row" :key="key">
              {{ processValue(cell) }}
            </td>
          </tr>
        </table>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Coverage } from '@/api/insurance/product.type'
import Ring from '@/components/base/progress/Ring.vue'
import DeviceMixin from '@/mixins/device/device-mixins'
import { numberConverterWithUnit } from '@/utils/number-converter'
import BaseInfo from '@/assets/icon/18/BaseInfo.svg'
import BaseTooltip from '@/components/base/tooltip/BaseTooltip.vue'
import TooltipCard from './tooltip-card/TooltipCard.vue'

@Component({
  components: {
    Ring,
    BaseInfo,
    BaseTooltip,
    TooltipCard,
  },
})
export default class ProductCoverageCard extends Mixins(DeviceMixin) {
  @Prop({ type: Object, required: true })
  coverage!: Coverage

  @Prop({ type: Boolean, default: false })
  isActive!: boolean

  get insuredAmount() {
    return this.$store.state.insuranceProduct.insuredAmount
  }

  get selectedCaseIndex() {
    return this.$store.state.insuranceProduct.selectedCaseIndex
  }

  /**
   * 處理格式為 "$[數值1,數值2,...]單位" 的字串
   * @param {string} value - 需要處理的字串，如 "$[0.1,0.2]萬元"
   * @returns {string} - 返回處理後的字串
   */
  processValue(value) {
    // 如果字串不包含 $[，直接返回原字串
    if (!value || !value.includes('$[')) return value

    // 從 computed 屬性獲取值，如果沒有則使用默認值
    const selectedIndex = this.selectedCaseIndex ?? 0
    const insuredAmount = this.insuredAmount ?? 1

    // 使用正則表達式替換所有匹配的模式
    return value.replace(/\$\[([\d\\.,]+)\]/g, (match, valuesStr) => {
      // 將字串分割為數值陣列
      const values = valuesStr.split(',').map(Number)

      // 根據索引選擇數值
      const selectedValue =
        selectedIndex >= 0 && selectedIndex < values.length
          ? values[selectedIndex]
          : values[0]

      // 應用保額倍數並四捨五入到兩位小數
      const result =
        insuredAmount > 0
          ? Math.round(selectedValue * insuredAmount * 100) / 100
          : selectedValue

      // 返回格式化後的數值
      return result.toLocaleString('en-US')
    })
  }

  get coverageRate() {
    return this.coverage.ideal_amount
      ? Math.round((this.coverage.amount / this.coverage.ideal_amount) * 100)
      : 0
  }

  get idealCoverageWording() {
    const cutPoint = 100000
    const amount =
      this.coverage.ideal_amount > cutPoint
        ? numberConverterWithUnit(this.coverage.ideal_amount, 10000)
        : this.coverage.ideal_amount

    return `MY83 建議理想保額 ${amount} 元`
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductCoverageCard {
  @include card-primary;

  padding: 20px 30px;

  @include max-media('xl') {
    @include card-secondary;

    padding: 16px 20px;
    margin: auto 20px;
  }

  &__header {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    h3 {
      margin-right: 4px;
    }
  }

  &__name,
  &__amount {
    font-weight: 500;
  }

  &__name {
    margin: 0;
    color: $gray-primary;
    font-size: 1.125rem;
  }

  &__info {
    display: flex;
    justify-content: space-between;
  }

  &__amount {
    font-size: 16px;
    white-space: nowrap;
    color: $primary-color;
    text-align: right;
  }

  &__remark {
    font-size: 0.75rem;
    color: $gray-primary;
  }

  &__coverage {
    display: flex;
    align-items: center;
    color: $secondary-color;
    font-size: 1.125rem;
    margin-top: 16px;

    @include max-media('xl') {
      font-size: 1rem;
      padding-top: 8px;
    }
  }

  &__coverageWording {
    padding-left: 20px;
    font-size: 0.75rem;

    > span {
      background: $secondary-bright-color;
      padding: 4px 10px;
      border-radius: 1rem;
      font-weight: 500;
    }
  }

  &__content {
    font-size: 0.875rem;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
  }

  &__content:not(:last-child) {
    padding-bottom: 8px;
    border-bottom: 1px dashed #d9d9d9;
  }

  &__table {
    padding: 20px 0 10px;
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;

    table {
      font-size: 14px;
      max-width: 1080px;
      border-collapse: collapse;
      border-spacing: 0;

      tr:first-child {
        background-color: #ededed;
        text-align: center;
      }

      td:first-child {
        background-color: #ededed;
        text-align: center;
      }

      td {
        border: 1px solid #c9c9c9;
        padding: 8px;
        text-align: left;
        word-break: keep-all;
      }
    }
  }
}
</style>
