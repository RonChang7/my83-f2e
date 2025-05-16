<template>
  <div class="ProductFQASection">
    <h2 class="ProductFQASection__title">常見問題</h2>
    <div
      v-for="(faq, index) in faqList"
      :key="index"
      class="ProductFQASection__column"
      @click="togglePanel(index)"
    >
      <div class="ProductFQASection__question">
        <div class="ProductFQASection__question-text">
          Q：{{ faq.question }}
        </div>
        <div class="ProductFQASection__action">
          <BaseArrowTop v-if="activePanels[index]" />
          <BaseArrowDown v-else />
        </div>
      </div>
      <div v-if="activePanels[index]" class="ProductFQASection__answer">
        {{ faq.answer }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BaseArrowDown from '@/assets/icon/24/BaseArrowDown.svg'
import BaseArrowTop from '@/assets/icon/24/BaseArrowTop.svg'

@Component({
  components: {
    BaseArrowDown,
    BaseArrowTop,
  },
})
export default class ProductFQASection extends Vue {
  @Prop({ type: Array, default: () => [] }) readonly fqaList!: Array<any>

  activePanels: Record<number, boolean> = {}

  get faqList() {
    // 如果有傳入 list prop，則使用它，否則使用預設的硬編碼資料
    if (this.fqaList && this.fqaList.length > 0) {
      return this.fqaList
    }

    // 預設的硬編碼 FQA 資料
    return [
      {
        question: '保險有什麼保障？',
        answer:
          '本保險提供意外傷害、醫療、住院等多項保障，詳細內容請參閱保單條款。',
      },
      {
        question: '如何申請理賠？',
        answer:
          '請備妥相關文件（如診斷證明、收據等）向保險公司提出申請，可透過線上、郵寄或親自辦理。',
      },
      {
        question: '保險期間可以退保嗎？',
        answer:
          '可以，但會依照保險法規定扣除部分費用，建議在購買前詳細評估需求。',
      },
      {
        question: '保險費用如何計算？',
        answer:
          '保險費用根據投保人的年齡、性別、職業、保障內容等因素綜合計算，詳情請洽詢保險業務員。',
      },
    ]
  }

  togglePanel(index: number) {
    // 使用 Vue.set 確保響應式更新
    this.$set(this.activePanels, index, !this.activePanels[index])
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductFQASection {
  @include max-media('xl') {
    width: 100vw;
  }

  &__title {
    margin: 0;
    color: $gray-primary;
    font-size: 1.375rem;
    font-weight: 500;
    margin-bottom: 16px;

    @include max-media('xl') {
      margin-top: 16px;
      font-size: 1.25rem;
      padding: 0 20px;
    }
  }

  &__action {
    @include hover('_secondary', $has-svg: true);

    display: flex;
    align-items: center;
    cursor: pointer;

    > svg {
      margin-left: 4px;
    }
  }

  &__column {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    padding: 20px 30px;
    cursor: pointer;
  }

  &__question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 18px;
    font-weight: 700;
    color: $gray-primary;
  }

  &__answer {
    margin-top: 12px;
    margin-left: 20px;
    color: $gray-secondary;
    font-size: 16px;
    line-height: 1.5;
  }
}
</style>
