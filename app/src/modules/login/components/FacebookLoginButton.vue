<template>
  <FacebookLogin v-slot="{ user, isLoaded, facebookLogin }">
    <button
      :disabled="!isLoaded || isDisabled"
      class="FacebookLoginButton"
      @click="login(facebookLogin)"
    >
      <span v-if="!isLoading" class="FacebookLoginButton__wrapper">
        <span class="FacebookLoginButton__icon" />
        <span
          :class="{ 'ml-2': user ? !user.avatar : false }"
          class="FacebookLoginButton__content"
        >
          {{ user ? buttonText(user.name) : buttonText() }}
        </span>
        <img
          :src="user ? user.avatar : ''"
          alt=""
          class="FacebookLoginButton__avatar"
        />
      </span>
      <span v-show="isLoading">
        <LoadingIcon size="18px" color="#fff" />
      </span>
    </button>
  </FacebookLogin>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import FacebookLogin, {
  Methods as FacebookLoginMethods,
} from '@/modules/facebook/FacebookLogin.vue'
import LoadingIcon from '@/components/base/loading/LoadingIcon.vue'

export default {
  components: {
    FacebookLogin,
    LoadingIcon,
  },
  data() {
    return {
      isLoading: false,
      isDisabled: false,
    }
  },
  props: {
    text: {
      type: String,
      default: '以 Facebook 登入',
    },
    state: {
      type: String,
      default: '',
    },
    clickable: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    async login(facebookLogin) {
      if (!this.clickable) {
        this.$emit('alert')
        return
      }
      const token = await facebookLogin()
      this.$emit('login', token)
    },
    buttonText(name) {
      return name ? `以 ${name} 的身份繼續` : this.text
    },
  },
  watch: {
    state: {
      immediate: true,
      handler(val) {
        switch (val) {
          case 'loading':
            this.isLoading = true
            this.isDisabled = true
            break
          default:
            this.isLoading = false
            this.isDisabled = false
            break
        }
      },
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
  isLoading: boolean
  isDisabled: boolean
}

export type Methods = {
  login(facebookLogin: FacebookLoginMethods['facebookLogin']): void
  buttonText(name: string): string
}

export interface Computed {}

export interface Props {
  text: string
  state: 'loading' | ''
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.FacebookLoginButton {
  @include button-full-width('xl');

  display: flex;
  justify-content: center;
  align-items: center;
  color: $primary-button-text-color;
  background: #4668b2;
  border: 0;
  overflow: hidden;

  &:hover:not([disabled]) {
    background: $secondary-hover-color;
  }

  &:disabled {
    background: $secondary-disabled-color;
    cursor: not-allowed;
  }

  &__wrapper {
    display: flex;
    align-items: center;
    width: 100%;
  }

  &__icon {
    height: 50px;
    flex: 0 0 44px;
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTEyIDBDNS4zNzMgMCAwIDUuMzk1IDAgMTIuMDVjMCA1Ljk3IDQuMzI2IDEwLjkxMiA5Ljk5OSAxMS44N3YtOS4zNTZINy4xMDR2LTMuMzY2aDIuODk1VjguNzE1YzAtMi44OCAxLjc1Mi00LjQ1IDQuMzEtNC40NSAxLjIyNiAwIDIuMjguMDkyIDIuNTg1LjEzM3YzLjAxbC0xLjc3NS4wMDFjLTEuMzkxIDAtMS42Ni42NjQtMS42NiAxLjYzOHYyLjE0OWgzLjMybC0uNDMyIDMuMzY3SDEzLjQ2VjI0QzE5LjM5NyAyMy4yNzQgMjQgMTguMjA1IDI0IDEyLjA0NyAyNCA1LjM5NSAxOC42MjcgMCAxMiAweiIvPgo8L3N2Zz4K')
      no-repeat 20px 50%;
  }

  &__content {
    width: 100%;
    padding: 0 8px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  &__avatar {
    flex: 0 0 50px;
  }
}
</style>
