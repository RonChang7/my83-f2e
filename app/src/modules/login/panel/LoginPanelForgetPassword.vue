<template>
  <div class="LoginPanelForgetPassword">
    <div class="LoginPanelForgetPassword__title">
      忘記密碼了？
    </div>

    <div class="LoginPanelForgetPassword__info">
      請輸入註冊時所填寫的 E-Mail 或 Facebook 註冊的 E-mail，MY83
      將會寄重置密碼信到您的信箱。
    </div>

    <label for="email">
      電子信箱
    </label>
    <BaseInputText
      :value.sync="form.email"
      :state="errors.email ? errors.email.state : ''"
      name="email"
      type="email"
      placeholder="hello@my83.com.tw"
      @blur="validate('email', form.email)"
    />
    <BaseInputMessage :msg="errors.email ? errors.email.message : ''" />

    <BaseButton
      :is-full-width="true"
      :state="state"
      size="l-b"
      class="LoginPanelForgetPassword__button"
      @click.native="submit"
    >
      寄送密碼重設信
    </BaseButton>

    <BaseInputMessage
      text-align="center"
      :msg="errors.api ? errors.api.message : ''"
    />

    <LoginFooter @to-panel="(name) => $emit('to-panel', name)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { rule } from '../validate-rule'
import LoginFooter from '../components/LoginFooter.vue'
import { Validator, ValidateMessage } from '@/services/validator/Validator'
import BaseInputText from '@/components/my83-ui-kit/input/BaseInputText.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'
import { forgetPassword } from '@/api/login/login'

export default {
  components: {
    LoginFooter,
    BaseInputText,
    BaseButton,
    BaseInputMessage,
  },
  data() {
    return {
      form: {
        email: '',
      },
      errors: {},
      state: '',
    }
  },
  methods: {
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

      await this.sendForgetPassword()
    },
    async sendForgetPassword() {
      this.state = 'loading'

      try {
        await forgetPassword(this.form.email, window.location.href)
      } catch (error) {
        this.state = ''

        const { message } = error.response.data

        this.$set(this.errors, 'api', {
          message,
          state: 'error',
        })
        return
      }

      this.$emit('send-forget-password-success')
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
  errors: Errors<Form>
  state: string
}

export interface Methods {
  validate(): void
  submit(): void
  sendForgetPassword(): void
}

export interface Computed {}

export interface Props {}

type Errors<T> = {
  [P in keyof T]: ValidateMessage
}

interface Form {
  email: string
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.LoginPanelForgetPassword {
  display: flex;
  flex-direction: column;
  width: 320px;
  margin: 0 60px;
  color: $gray-primary;

  @include max-media('lg') {
    width: 100%;
    margin: 0;
  }

  &__title {
    margin-bottom: 15px;
    font-size: 1.375rem;
    font-weight: 500;
    text-align: center;

    @include max-media('lg') {
      margin-top: 40px;
    }
  }

  &__info {
    margin-bottom: 30px;
  }

  &__button {
    margin-top: 40px;
  }

  label {
    margin-bottom: 5px;
  }
}
</style>
