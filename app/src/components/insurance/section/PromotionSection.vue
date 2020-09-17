<template>
  <div class="PromotionSection">
    <div class="PromotionSection__title">想買保險，但不知道怎麼挑？</div>
    <div class="PromotionSection__description">
      直接到 MY83 保險達人榜，
      <br />
      免費詢問站上活躍的業務員，
      <br />
      讓專業、好評、回覆迅速的業務員來幫你！
    </div>
    <BaseButton size="l-b" type="quaternary" to="/searchSales">
      找業務員
    </BaseButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'

const options: ComponentOption = {
  components: {
    BaseButton,
  },
}

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

export type Methods = {}

export interface Computed {}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.PromotionSection {
  @include card-primary;
  background: url('https://images.my83.com.tw/front/insurance/bg-ad-sales-desktop@2x.png')
    center -1px / contain no-repeat;
  background-color: #ffccb1;
  border: 0;
  padding: 30px;
  text-align: center;

  &__title {
    color: #fff;
    font-size: 1.375rem;
    font-weight: 500;
  }

  &__description {
    width: 192px;
    font-size: 0.875rem;
    color: $gray-primary;
    margin: 60px 0 24px;
    text-align: left;
  }
}
</style>
