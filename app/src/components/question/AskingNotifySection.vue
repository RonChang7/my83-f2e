<template>
  <BaseCard class="AskingNotifySection">
    <template v-slot:title>討論區發文注意事項</template>
    <ol class="AskingNotifySection__rule">
      <li>
        若有保險規劃的需求，可以直接
        <GlobalLink to="/request">提出需求</GlobalLink>
        ，通常會有 6-8位業務員提供保單建議給您。
      </li>
      <li>請勿留下聯絡方式，避免受到陌生人騷擾。</li>
      <li>MY83不會主動提供您的個資給業務員，請安心留言。</li>
      <li>
        發文後，您可以挑選回覆優質的業務員，進一步「諮詢」該業務員，獲得更多幫助！
      </li>
    </ol>
    <img src="https://my83.com.tw/images/feature3.png" alt="asking" />
  </BaseCard>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'

const options: ComponentOption = {
  components: {
    BaseCard,
    GlobalLink,
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

export interface Methods {}

export interface Computed {}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.AskingNotifySection {
  color: $gray-primary;

  &__rule {
    padding-left: 20px;

    > li {
      margin-bottom: 1rem;
    }
  }
}
</style>
