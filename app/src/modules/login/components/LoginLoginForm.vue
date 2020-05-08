<template>
  <div class="LoginLoginForm">
    <FacebookLoginButton :state="state.facebook" @login="facebookLogin" />
    <BaseInputMessage :msg="errors.facebook ? errors.facebook.message : ''" />

    <hr class="or" />
    <div
      v-if="displayForgetPasswordWording"
      class="LoginLoginForm__resetPasswordWording"
    >
      已發送重設密碼信到您的信箱，請檢查您的信箱喔！
    </div>

    <label for="email">
      電子信箱
    </label>
    <BaseInputText
      :value.sync="form.email"
      :autocomplete="autocomplete ? 'on' : 'off'"
      :state="errors.email ? errors.email.state : ''"
      name="email"
      type="email"
      placeholder="hello@my83.com.tw"
      @blur="validate('email', form.email)"
    />
    <BaseInputMessage :msg="errors.email ? errors.email.message : ''" />

    <div class="LoginLoginForm__password">
      <label for="password">
        密碼
      </label>
      <a @click.prevent="$emit('to-panel', 'forget-password')">忘記密碼</a>
    </div>
    <BaseInputText
      :value.sync="form.password"
      :autocomplete="autocomplete ? 'on' : 'off'"
      :state="errors.password ? errors.password.state : ''"
      name="password"
      type="password"
      placeholder="輸入密碼"
      @blur="validate('password', form.password)"
      @enter="submit"
    />
    <BaseInputMessage :msg="errors.password ? errors.password.message : ''" />

    <BaseCheckbox
      :checked.sync="autocomplete"
      label="記住我"
      class="checkbox"
    />
    <BaseButton
      :is-full-width="true"
      :state="state.email"
      size="l-b"
      @click.native="submit"
    >
      登入
    </BaseButton>
    <BaseInputMessage
      text-align="center"
      :msg="errors.login ? errors.login.message : ''"
    />

    <LoginFooter @to-panel="(name) => $emit('to-panel', name)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { rule } from '../validate-rule'
import { FacebookLoginNotMy83User } from '../dialog-info'
import FacebookLoginButton from './FacebookLoginButton.vue'
import LoginFooter from './LoginFooter.vue'
import { Validator, ValidateMessage } from '@/services/validator/Validator'
import { login } from '@/api/login/login'
import BaseInputText from '@/components/my83-ui-kit/input/BaseInputText.vue'
import BaseCheckbox from '@/components/my83-ui-kit/input/BaseCheckbox.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'
import { User, LandingUrlInfo } from '@/services/user/user'
import * as types from '@/store/global/global.type'
import { GlobalDialogContent } from '@/store/global/index'
import { SimpleResponse, Role } from '@/api/type'
import { Auth } from '@/services/auth/auth'

const auth = Auth.getInstance()

export default {
  components: {
    FacebookLoginButton,
    BaseInputText,
    BaseCheckbox,
    BaseButton,
    LoginFooter,
    BaseInputMessage,
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      autocomplete: false,
      errors: {},
      state: {
        facebook: '',
        email: '',
      },
    }
  },
  props: {
    displayForgetPasswordWording: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    landingUrl() {
      const user = User.getInstance()
      return user.landingUrl
    },
    login(jwtToken, expiredTime) {
      auth.login({
        jwtToken,
        expiredTime,
      })
    },
    async validate(key, value) {
      const error = await this.validator.validate(key, value)
      this.$set(this.errors, key, error[key])
    },
    async submit() {
      try {
        await this.validator.validateAll(this.form)
      } catch (error) {
        this.$set(this, 'errors', error)
        return
      }

      await this.emailLogin()
    },
    async emailLogin() {
      this.state.email = 'loading'
      this.$set(this.errors, 'login', { message: '' })

      try {
        const { token, expired_time } = await login.emailLogin({
          email: this.form.email,
          password: this.form.password,
          ...this.landingUrl(),
        })

        this.login(token!, expired_time!)
        this.$emit('login-success')
      } catch (error) {
        this.state.email = ''

        const { message } = error.response.data as SimpleResponse
        this.$set(this.errors, 'login', {
          message,
          state: 'error',
        })
        this.$set(this.errors, 'email', { state: 'error' })
        this.$set(this.errors, 'password', { state: 'error' })
      }
    },
    async facebookSignUp(fbToken, role) {
      try {
        const { token, expired_time } = await login.facebookSignUp({
          fbToken,
          role,
          ...this.landingUrl(),
        })

        this.login(token!, expired_time!)

        this.newUserRedirect(role)
      } catch (error) {
        this.state.facebook = ''

        const { message } = error.response.data as SimpleResponse

        this.$set(this.errors, 'facebook', {
          message,
          state: 'error',
        })
      }
    },
    async facebookLogin(fbToken) {
      this.state.facebook = 'loading'

      try {
        const { token, expired_time } = await login.facebookLogin({
          fbToken,
          ...this.landingUrl(),
        })

        this.login(token!, expired_time!)

        this.$emit('login-success')
      } catch (error) {
        this.state.facebook = ''

        const { message } = error.response.data as SimpleResponse
        const status = error.response.status

        if (status === 401) {
          this.$store.dispatch(`global/${types.UPDATE_GLOBAL_DIALOG}`, {
            ...FacebookLoginNotMy83User,
            leftConfirmFn: () => this.facebookSignUp(fbToken, 'client'),
            rightConfirmFn: () => this.facebookSignUp(fbToken, 'sales'),
          } as GlobalDialogContent)

          this.$store.dispatch(`global/${types.OPEN_GLOBAL_DIALOG}`)
        } else if (message) {
          this.$set(this.errors, 'facebook', {
            message,
            state: 'error',
          })
        }
      }
    },
    newUserRedirect(role) {
      // @todo: Change path after migrate to Nuxt.js
      window.location.href = role === 'sales' ? '/salesCenter' : '/clientCenter'
    },
  },
  mounted() {
    this.validator = new Validator(rule)
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

export interface Instance extends Vue {
  validator: Validator<Form>
}

export interface Data {
  form: Form
  autocomplete: boolean
  errors: Errors<Form>
  state: {
    facebook: string
    email: string
  }
}

export interface Methods {
  landingUrl(): LandingUrlInfo
  login(jwtToken: string, expiredTime: number): void
  validate(key: string, value: any): void
  submit(): void
  facebookSignUp(fbToken: string, role: Role): void
  facebookLogin(fbToken: string): void
  emailLogin(): void
  newUserRedirect(role: Role): void
}

export interface Computed {}

export interface Props {
  displayForgetPasswordWording: boolean
}

type Errors<T> = {
  [P in keyof T]: ValidateMessage
}

interface Form {
  email: string
  password: string
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.LoginLoginForm {
  display: flex;
  flex-direction: column;
  width: 320px;

  @include max-media('lg') {
    width: 100%;
  }

  &__password {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    a {
      font-size: 0.875rem;
      font-weight: 500;
    }
  }

  &__resetPasswordWording {
    margin-bottom: 20px;
    color: $info-color;
    font-size: 0.875rem;
    white-space: nowrap;
  }

  label {
    color: $gray-primary;
    margin-bottom: 5px;
  }

  hr {
    margin: 30px 0 20px;

    &.or:after {
      content: '或';
      display: block;
      width: 36px;
      position: relative;
      left: calc(50% - 36px / 2);
      top: -10px;
      color: $gray-tertiary;
      background: #fff;
      text-align: center;
    }
  }

  .checkbox {
    margin: 10px 0 20px;
  }
}
</style>
