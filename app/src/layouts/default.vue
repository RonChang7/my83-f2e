<template>
  <div>
    <client-only>
      <LoginPanel
        v-if="loginPanel.display"
        :visible="loginPanel.display"
        :current-panel="loginPanel.targetPanel"
      />
      <BaseDialog v-if="globalDialogVisible" />
    </client-only>
    <Header v-if="shouldShowHeader" />
    <nuxt />
    <Footer v-if="shouldShowFooter" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

import Header from '@/components/header/Header.vue'
import Footer from '@/components/footer/Footer.vue'
import { LoginPanelState } from '@/store/global/index'
import PageMetaMixin, {
  Computed as PageMetaMixinComputed,
} from '@/mixins/seo/page-meta'
const LoginPanel = () => import('@/modules/login/LoginPanel.vue')
const BaseDialog = () => import('@/components/base/dialog/BaseDialog.vue')

export default {
  name: 'DefaultLayout',
  mixins: [PageMetaMixin],
  components: {
    Header,
    Footer,
    LoginPanel,
    BaseDialog,
  },
  data() {
    return {
      shouldShowFooter: true,
      shouldShowHeader: true,
    }
  },
  head() {
    return {
      ...this.seoData,
    }
  },
  computed: {
    ...mapState('global', ['loginPanel', 'globalDialogVisible']),
  },
  watch: {
    '$route.meta.hideFooter': {
      immediate: true,
      handler(val) {
        this.shouldShowFooter = !val
      },
    },
    '$route.meta.hideHeader': {
      immediate: true,
      handler(val) {
        this.shouldShowHeader = !val
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
  shouldShowFooter: boolean
  shouldShowHeader: boolean
}

export interface Methods {}

export interface Computed extends PageMetaMixinComputed {
  loginPanel: LoginPanelState
  globalDialogVisible: boolean
}

export interface Props {}
</script>
