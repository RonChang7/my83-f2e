<template>
  <div class="LoginPanelLogin">
    <LoginInfo :image-bucket-url="$imageBucketUrl" />
    <div class="vertical-line"></div>
    <LoginLoginForm
      :display-forget-password-wording="displayForgetPasswordWording"
      @to-panel="(name) => $emit('to-panel', name)"
      @login-success="$emit('login-success')"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import LoginInfo from '../components/LoginInfo.vue'
import LoginLoginForm from '../components/LoginLoginForm.vue'

export default {
  components: {
    LoginInfo,
    LoginLoginForm,
  },
  props: {
    displayForgetPasswordWording: {
      type: Boolean,
      required: true,
    },
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

export interface Props {
  displayForgetPasswordWording: boolean
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.LoginPanelLogin {
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
