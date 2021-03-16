<template>
  <BaseCard class="ListGuideSection">
    <template #title>討論區使用指南</template>
    <template #default>
      <ol>
        <li><span>發問</span></li>
        <li><span>等待業務員回覆</span></li>
        <li><span>選出最佳解答</span></li>
        <li><span>向喜歡的業務員諮詢更多</span></li>
      </ol>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'

const options: ComponentOption = {
  components: {
    BaseCard,
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

.ListGuideSection {
  color: $gray-primary;
  margin-bottom: 20px;

  ol {
    margin: 16px 0;
    padding: 0;
    counter-reset: number;
    list-style-type: none;

    li {
      &:not(:last-child) {
        margin-bottom: 20px;

        span:before {
          content: '';
          display: inline-block;
          position: absolute;
          background: #ef6e2e;
          height: 14px;
          width: 1px;
          margin: 30px 0 0 -31px;
        }
      }

      &:before {
        counter-increment: number;
        content: counter(number);
        color: $primary-color;
        display: inline-block;
        width: 30px;
        height: 30px;
        margin-right: 16px;
        border: 1px solid $primary-color;
        border-radius: 50%;
        font-weight: 700;
        text-align: center;
      }
    }
  }
}
</style>
