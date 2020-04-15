<template>
  <div class="AskingPage">
    <div class="AskingPage__header">
      <h1 class="AskingPage__title">發文到 MY83 討論區</h1>
    </div>
    <div class="AskingPage__row">
      <div class="AskingPage__column left">
        <AskingNotifySection />
      </div>
      <div class="AskingPage__column right"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import AskingNotifySection from '@/components/question/AskingNotifySection.vue'

const options: ComponentOption = {
  components: {
    AskingNotifySection,
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

.AskingPage {
  display: flex;
  flex-direction: column;
  padding: 40px 0 60px;
  background: $primary-bg;

  @include max-media('xl') {
    padding: 0 0 90px;
  }

  &__header,
  &__row {
    display: flex;
    justify-content: center;

    @include max-media('xl') {
      flex-direction: column;
    }
  }

  &__title {
    color: $gray-primary;
    width: 740px;
    margin: 0 0 10px 380px;
    font-size: 1.75rem;
    font-weight: 500;

    @include max-media('xl') {
      width: auto;
      margin: 0;
      text-align: center;
    }
  }

  &__column {
    display: flex;
    flex-direction: column;
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }

    &.right {
      width: 740px;
    }

    &.left {
      width: 360px;
      margin-top: -52px;
    }

    &.left,
    &.right {
      @include max-media('xl') {
        width: 100%;
        margin-top: 0;
      }
    }
  }
}
</style>
