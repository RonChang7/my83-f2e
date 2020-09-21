<template>
  <BaseModal :visible="visible" :lock-scroll="true" @close="closePanel">
    <div class="LoginPanel__wrapper">
      <div class="LoginPanel">
        <LoginHeader
          :display-back-button="currentPanel !== 'login'"
          @close="closePanel"
          @to-panel="toPanel"
        />
        <LoginPanelLogin
          v-if="currentPanel === 'login'"
          :display-forget-password-wording="displayForgetPasswordWording"
          @to-panel="toPanel"
          @login-success="afterLogin"
        />
        <LoginPanelSignUp
          v-if="currentPanel === 'sign-up'"
          @to-panel="toPanel"
        />
        <LoginPanelForgetPassword
          v-if="currentPanel === 'forget-password'"
          @to-panel="toPanel"
          @send-forget-password-success="sendForgetPasswordSuccess"
        />
      </div>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import LoginHeader from './components/LoginHeader.vue'
import LoginPanelLogin from './panel/LoginPanelLogin.vue'
import LoginPanelSignUp from './panel/LoginPanelSignUp.vue'
import LoginPanelForgetPassword from './panel/LoginPanelForgetPassword.vue'
import BaseModal from '@/components/base/modal/BaseModal.vue'
import * as types from '@/store/global/global.type'
import { TargetPanel } from '@/store/global/index'

export default {
  components: {
    BaseModal,
    LoginHeader,
    LoginPanelLogin,
    LoginPanelSignUp,
    LoginPanelForgetPassword,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    currentPanel: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      displayForgetPasswordWording: false,
    }
  },
  computed: {
    ...mapState('global', ['actionAfterLogin', 'actionAfterClosePanel']),
  },
  methods: {
    closePanel() {
      this.$store.dispatch(`global/${types.CLOSE_LOGIN_PANEL}`)
      this.afterClosePanel()
    },
    toPanel(panelName) {
      this.$store.dispatch(`global/${types.NAVIGATE_LOGIN_PANEL}`, panelName)
    },
    afterLogin() {
      this.actionAfterLogin()
    },
    afterClosePanel() {
      if (typeof this.actionAfterClosePanel === 'function') {
        this.actionAfterClosePanel()
        /**
         * 當有設定登入 panel 關閉後 Function，則執行 Function，
         * 並將 Function 從 Store 清空，以確保不會影響到其他使用登入 panel 但未設定 afterClosePanel 的地方
         */
        this.$store.dispatch(
          `global/${types.UPDATE_AFTER_CLOSE_LOGIN_PANEL_EVENT}`,
          null
        )
      }
    },
    sendForgetPasswordSuccess() {
      this.displayForgetPasswordWording = true
      this.toPanel('login')
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
  displayForgetPasswordWording: boolean
}

export type Methods = {
  closePanel(): void
  toPanel(panelName: TargetPanel): void
  afterLogin(): void
  afterClosePanel(): void
  sendForgetPasswordSuccess(): void
}

export interface Computed {
  actionAfterLogin: Function
  actionAfterClosePanel: Function | null
}

export interface Props {
  visible: boolean
  currentPanel: TargetPanel
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';
@import '@/sass/mixins.scss';

.LoginPanel {
  @include card-primary;

  height: 605px;
  padding: 20px;
  overflow: auto;

  @include max-media('lg') {
    width: calc(100vw - 24px);
    height: calc(100% - 14px);
    padding: 15px;
  }

  &__wrapper {
    display: table;
    margin: 0 auto;
    height: calc(100% - 14px);
    margin-top: 14px;

    @include min-media('lg') {
      margin-top: 0;
      min-height: 605px;

      @media (min-height: 605px) {
        margin-top: calc((100vh - 605px) / 2);
        height: calc(605px - (100vh - 605px) / 2);
      }
    }
  }
}
</style>
