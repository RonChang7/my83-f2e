<template>
  <div class="AnswerSalesRule">
    <div class="AnswerSalesRule__title">MY83 討論區板規</div>
    <div class="AnswerSalesRule__content">
      <ol>
        <li>
          為保有較佳的使用體驗，請勿在給保戶的公開內容中，提供其他保險平台的連結。可以使用其他方式，如整理列表或表格，讓用戶更方便參考資訊內容。
        </li>
        <li>
          為維護討論區品質，請勿提及任何實際聯絡方式或暗示保戶，違者若查證屬實將
          <span class="text-error">停權帳號兩週警告！</span>
        </li>
        <li>
          為求公平，請勿要求保戶選擇最低費率，違者經檢舉查證，將
          <span class="text-error">停權帳號兩週警告！</span>
        </li>
        <li>
          留言時，請勿回覆與問題無關之無意義的答覆，如：留言內容只有訴求保戶與自己連繫/討論，無個人想法與見解
        </li>
        <li>
          討論區不限制就事論事的保險討論，但若涉及人身攻擊之言論，版主將有權刪文處理
        </li>
      </ol>
      業務員溫馨小提醒：
      <br />
      您所參與過的留言，都會累積在你的業務員檔案下方
      <br />
      <span class="highlight">多發表專業留言，讓保戶了解你的專業所在吧！</span>
    </div>
    <div class="AnswerSalesRule__action">
      <BaseButton size="m" to="/classroom#qaKing">
        我要成為討論區達人
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'

export default {
  components: {
    BaseButton,
  },
} as ComponentOption

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export type ComponentInstance = CombinedVueInstance<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export interface Instance extends Vue {}

export interface Data {}

export interface Methods {}

export interface Computed {}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.AnswerSalesRule {
  padding: 20px 30px;
  border: 6px solid $primary-bright-color;
  outline: 2px solid $primary-bright-color;
  outline-offset: -12px;
  color: $gray-primary;

  &:before {
    content: '';
    background: url('https://images.my83.com.tw/front/question/forumrules-sales@2x.png');
    display: inline-block;
    height: 98px;
    width: 46px;
    background-size: contain;
    position: absolute;
    margin-top: -71px;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 500;
    padding-left: 45px;
  }

  &__content {
    font-size: 0.875rem;
    line-height: 1.6;

    > ol {
      padding-top: 16px;
      padding-left: 0.875rem;
    }

    .highlight {
      display: inline;
      box-shadow: inset 0 -12px 0 0 $primary-bright-color;
      padding-bottom: 2px;
      font-weight: 500;
    }
  }

  &__action {
    display: flex;
    justify-content: center;
    margin: 30px 0 15px;
  }
}
</style>
