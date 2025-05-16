<!-- eslint-disable vue/no-v-html -->
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
          Q{{ index + 1 }}：{{ faq.question }}
        </div>
        <div class="ProductFQASection__action">
          <BaseArrowTop v-if="activePanels[index]" />
          <BaseArrowDown v-else />
        </div>
      </div>
      <div v-if="activePanels[index]" class="ProductFQASection__answer">
        <div v-html="faq.answer" />
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
        question: '該怎麼選擇適合自己的保險？',
        answer: `可依照自身需求與人生階段做選擇：<br/><li>單身族：可考慮醫療險、意外險</li><li>家庭族：建議搭配壽險、重大傷病險</li><li>中高齡族群：可補足長照、退休保障</li><li>建議搭配專業顧問諮詢，進行保障檢視。</li>`,
      },
      {
        question: '投保需要健康檢查嗎？',
        answer:
          '不一定。部分險種如醫療險、壽險可能需簡單健康告知或提供體檢報告，高保額或高風險族群可能需進一步體檢。',
      },
      {
        question: '可以幫孩子買保險嗎？有年齡限制嗎？',
        answer:
          '可以。新生兒出生滿15天就可投保。父母可為孩子規劃醫療險、意外險、儲蓄險，提早建立健康與教育保障。',
      },
      {
        question: '按下「免費諮詢」後會發生什麼事？跟我簽約的人是誰？',
        answer:
          '填寫完資料後，我們的保險業務員會與你聯繫確認需求，預約你方便的時間當面洽談、規劃與解說保單內容，並且協助簽約投保，絕對不會推銷你其他商品。',
      },
      {
        question: 'MY83這個網站是合法的嗎',
        answer: '是合法的！錠嵂保險經紀人股份有限公司是經由主管機關核淮經營。',
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
