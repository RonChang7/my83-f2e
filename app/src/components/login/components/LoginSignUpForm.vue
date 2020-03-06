<template>
  <div class="LoginSignUpForm">
    <div class="LoginSignUpForm__title">
      註冊 只需 1 分鐘就能完成！
    </div>
    <FacebookLoginButton
      :state="state"
      text="以 Facebook 註冊"
      @login="facebookSignUp"
    />
    <BaseInputErrorMessage text-align="center" :msg="message" />

    <div class="LoginSignUpForm__info">
      為確保用戶真實性，僅提供 Facebook 註冊
      <br />
      註冊即代表你已閱讀並同意
      <GlobalLink to="/terms">服務條款</GlobalLink>
      及
      <GlobalLink to="/privacy">隱私權政策</GlobalLink>
    </div>
    <a @click.prevent="$emit('to-panel', 'login')">我要登入</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import FacebookLoginButton from './FacebookLoginButton.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseInputErrorMessage from '@/components/my83-ui-kit/input/BaseInputErrorMessage.vue'
import { facebookSignUp } from '@/api/login/login'
import { User } from '@/services/user/user'

export default {
  components: {
    FacebookLoginButton,
    GlobalLink,
    BaseInputErrorMessage,
  },
  data() {
    return {
      state: '',
      message: '',
    }
  },
  methods: {
    async facebookSignUp(fbToken) {
      const user = User.getInstance()
      this.state = 'loading'

      try {
        await facebookSignUp({
          fbToken,
          role: 'client',
          ...user.landingUrl,
        })

        // @todo: Change path after migrate to Nuxt.js
        window.location.href = '/clientCenter'
      } catch (error) {
        const { success, message } = error.response.data

        if (!success && message) {
          this.state = 'error'
          this.message = message
        }
      }
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

export interface Data {
  state: string
  message: string
}

export interface Methods {
  facebookSignUp(fbToken: string): void
}

export interface Computed {}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.LoginSignUpForm {
  display: flex;
  flex-direction: column;
  width: 320px;
  color: $gray-primary;
  text-align: center;

  @include max-media('lg') {
    width: 100%;
  }

  &__title {
    font-size: 1.375rem;
    font-weight: 500;
    margin-bottom: 36px;

    @include max-media('lg') {
      margin-top: 12px;
    }
  }

  &__info {
    font-size: 0.75rem;
    margin: 20px 0 48px;
    line-height: 1.4;

    @include max-media('lg') {
      margin-bottom: 30px;
    }
  }

  a {
    font-weight: 500;
  }
}
</style>
