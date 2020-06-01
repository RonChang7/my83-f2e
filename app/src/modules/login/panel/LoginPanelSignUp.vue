<template>
  <div class="LoginPanelSignUp">
    <LoginInfo :image-url="$imageUrl" />
    <div class="vertical-line"></div>
    <LoginSignUpForm @to-panel="(name) => $emit('to-panel', name)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import LoginInfo from '../components/LoginInfo.vue'
import LoginSignUpForm from '../components/LoginSignUpForm.vue'

export default {
  components: {
    LoginInfo,
    LoginSignUpForm,
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
@import '@/sass/rwd.scss';

.LoginPanelSignUp {
  display: flex;
  padding: 0 60px 0 50px;

  @include max-media('lg') {
    flex-direction: column;
    padding: 0;
  }

  .vertical-line {
    margin: 0 50px;
    width: 2px;
    border-left: 1px solid $secondary-bg;

    @include max-media('lg') {
      display: none;
    }
  }
}
</style>
