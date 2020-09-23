<template>
  <div class="PromotionSection">
    <div class="PromotionSection__title">想買保險，但不知道怎麼挑？</div>
    <div class="PromotionSection__content">
      <div class="PromotionSection__description">
        直接到 MY83 保險達人榜，
        <br class="newline" />
        免費詢問站上活躍的業務員，
        <br class="newline" />
        讓專業、好評、回覆迅速的業務員來幫你！
      </div>
      <BaseButton
        size="l-b"
        type="quaternary"
        to="/searchSales"
        :is-full-width="isMobile"
      >
        找業務員
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'

const options: ComponentOption = {
  mixins: [DeviceMixin],
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

export interface Instance
  extends Vue,
    Omit<DeviceMixinComponentInstance, keyof Vue> {}

export interface Data {}

export type Methods = {}

export interface Computed {}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.PromotionSection {
  @include card-primary;

  background: url('https://images.my83.com.tw/front/insurance/bg-ad-sales-desktop@2x.png')
    center -1px / contain no-repeat;
  background-color: #ffccb1;
  border: 0;
  padding: 30px;
  text-align: center;
  margin-bottom: 20px;

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

  @include max-media('xl') {
    background: url('https://images.my83.com.tw/front/insurance/bg-ad-sales-mobile@2x.png')
      center top / contain no-repeat;
    background-color: #ffccb1;
    padding: 16px;
    text-align: left;

    &__title {
      font-size: 1.125rem;
    }

    &__content {
      display: flex;
      align-items: flex-end;
    }

    &__description {
      margin: 26px 16px 0 0;
      width: 186px;
      flex: 0 0 auto;
    }
  }
}
@include max-media('xl') {
  .newline {
    display: none;
  }
}
</style>
