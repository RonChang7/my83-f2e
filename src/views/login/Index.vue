<template>
  <FacebookLoginButton
    ref="FacebookLoginButton"
    v-slot="{ user, isLoaded, facebookLogin }"
  >
    <button
      @click="login(facebookLogin)"
      :disabled="!isLoaded"
      class="FacebookLoginButton"
    >
      <span class="icon">&#9993;</span>
      <span v-if="user && user.name">以 {{ user.name }} 的身份登入</span>
      <span v-else>以 Facebook 帳號登入</span>
      <div class="FacebookLoginButton__avatar">
        <img v-if="user && user.avatar" :src="user.avatar" />
      </div>
    </button>
  </FacebookLoginButton>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import FacebookLoginButton from './facebook/FacebookLoginButton.vue'

export default {
  components: {
    FacebookLoginButton,
  },
  methods: {
    login(facebookLogin) {
      facebookLogin().then((token) => {
        console.log('token', token)
      })
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

export interface Props {}
</script>

<style lang="scss" scoped>
.FacebookLoginButton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 320px;
  height: 50px;
  padding: 0;
  border: 0;
  background: #4668b2;

  &__avatar {
    width: 50px;
    height: 50px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  span {
    font-size: 18px;
    color: #fff;
  }

  .icon {
    font-size: 36px;
    padding-left: 12px;
  }
}
</style>
