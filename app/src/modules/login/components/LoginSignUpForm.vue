<template>
  <div class="LoginSignUpForm">
    <div class="LoginSignUpForm__title">註冊 只需 1 分鐘就能完成！</div>
    <div class="form-check">
      <input
        type="checkbox"
        class="form-check-input"
        id="agreeCheckbox"
        v-model="privacyCheck"
      />
      <label class="form-check-label" for="agreeCheckbox">
        我已詳細閱讀並同意「
        <GlobalLink to="/terms">服務條款</GlobalLink>
        」、「
        <GlobalLink to="/privacy">隱私權政策</GlobalLink>
        」
      </label>
      <span class="text-danger" v-if="privacyCheckErrorShow">請勾選同意</span>
    </div>
    <FacebookLoginButton
      :state="state"
      :clickable="privacyCheck"
      text="以 Facebook 註冊"
      @login="facebookSignUp"
      @alert="alertPrivacyCheck"
    />
    <BaseInputMessage text-align="center" :msg="message" />

    <div class="LoginSignUpForm__info">
      為確保用戶真實性，僅提供 Facebook 註冊
      <br />
    </div>
    <a @click.prevent="$emit('to-panel', 'login')">我要登入</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'
import { facebookSignUp } from '@/api/login/login'
import FacebookLoginButton from './FacebookLoginButton.vue'

export default {
  components: {
    FacebookLoginButton,
    GlobalLink,
    BaseInputMessage,
  },
  data() {
    return {
      state: '',
      message: '',
      privacyCheck: false,
      privacyCheckErrorShow: false,
    }
  },
  methods: {
    alertPrivacyCheck() {
      this.privacyCheckErrorShow = true
    },
    async facebookSignUp(fbToken) {
      this.state = 'loading'

      try {
        const { token, expired_time } = await facebookSignUp({
          fbToken,
          role: 'client',
          ...this.$auth.landingUrl,
          roleSession: this.$auth.suspectRole,
          memberSession: this.$auth.suspectMemberId,
        })

        this.$auth.login({
          jwtToken: token!,
          expiredTime: expired_time!,
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
  watch: {
    privacyCheck(value) {
      if (value) {
        this.privacyCheckErrorShow = false
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

export type Methods = {
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

  .form-check {
    margin-bottom: 10px;
  }

  .text-danger {
    color: #b40016;
  }
}
</style>
