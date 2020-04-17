<template>
  <BaseCard class="AskingFormSection">
    <AskingFormSelectField
      class="AskingFormSection__field restrict"
      title="發問目的"
      :required="true"
      :value.sync="test"
      :options="[]"
    />
    <AskingFormSelectField
      class="AskingFormSection__field restrict"
      title="投保對象"
      :required="true"
      :value.sync="test"
      :options="[]"
    />
    <AskingFormInputField
      class="AskingFormSection__field"
      title="標題"
      :required="true"
      :value.sync="test"
      placeholder="範例：32歲 男 保單健檢及規劃"
    />
    <AskingFormTextareaField
      class="AskingFormSection__field"
      title="內文"
      :required="true"
      :value.sync="test"
      :auto-grow="true"
      :auto-grow-max-height="500"
      height="100px"
      :placeholder="
        '範例：32歲 男 男 辦公室上班族 \n預算約：3 萬 \n保障需求：重疾癌症、殘廢殘扶險、壽險'
      "
      legend="建議包含「年齡、性別、職業、相關家庭責任、大概收入狀況」，可以得到更完整的保險建議唷～"
    />
    <AskingFormInputField
      class="AskingFormSection__field restrict"
      title="暱稱"
      :required="true"
      :value.sync="test"
      placeholder="設定你的暱稱"
      legend="暱稱設定後不可修改"
    />
  </BaseCard>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import AskingFormInputField from './asking/AskingFormInputField.vue'
import AskingFormTextareaField from './asking/AskingFormTextareaField.vue'
import AskingFormSelectField from './asking/AskingFormSelectField.vue'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'

const options: ComponentOption = {
  components: {
    BaseCard,
    AskingFormInputField,
    AskingFormTextareaField,
    AskingFormSelectField,
  },
  data() {
    return {
      test: '',
    }
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
@import '@/sass/rwd.scss';

.AskingFormSection {
  padding: 40px 0;

  &__field {
    margin-bottom: 40px;

    &.restrict {
      width: 250px;

      @include max-media('xl') {
        width: 100%;
      }
    }
  }
}
</style>
