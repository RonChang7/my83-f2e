<template>
  <div class="QuestionListPage">
    <BannerSection />
    <QuestionLayoutWithFixedColumn></QuestionLayoutWithFixedColumn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import QuestionLayoutWithFixedColumn from '@/components/question/layout/QuestionLayoutWithFixedColumn.vue'
import BannerSection from '@/components/question/section/BannerSection.vue'

const options: ComponentOption = {
  components: {
    QuestionLayoutWithFixedColumn,
    BannerSection,
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
@import '@/sass/rwd.scss';

.QuestionListPage {
  display: flex;
  flex-direction: column;
  padding: 0 0 60px;
  background: $primary-bg;

  @include max-media('xl') {
    padding: 0 0 90px;
  }

  &__row {
    display: flex;
    justify-content: center;

    @include max-media('xl') {
      flex-direction: column;
    }
  }
}
</style>
