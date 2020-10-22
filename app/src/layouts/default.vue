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
    <div class="container">
      <nuxt />
    </div>
    <Footer v-if="shouldShowFooter" />
    <BaseScrollToTopButton
      v-if="activateScrollToTop && shouldShowScrollToTop"
      class="scrollToTop"
      @click="scrollToTop"
    />
  </div>
</template>

<script lang="ts">
import _, { DebouncedFunc } from 'lodash'
import Vue from 'vue'
import { mapState } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import Header from '@/components/header/Header.vue'
import Footer from '@/components/footer/Footer.vue'
import BaseScrollToTopButton from '@/components/my83-ui-kit/button/BaseScrollToTopButton.vue'
import { LoginPanelState } from '@/store/global/index'
import PageMetaMixin, {
  ComponentInstance as PageMetaMixinComponentInstance,
} from '@/mixins/seo/page-meta'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'
import { scrollToElement } from '@/utils/scroll'
const LoginPanel = () => import('@/modules/login/LoginPanel.vue')
const BaseDialog = () => import('@/components/base/dialog/BaseDialog.vue')

export default {
  name: 'DefaultLayout',
  mixins: [PageMetaMixin, DeviceMixin],
  components: {
    Header,
    Footer,
    LoginPanel,
    BaseDialog,
    BaseScrollToTopButton,
  },
  data() {
    return {
      shouldShowFooter: true,
      shouldShowHeader: true,
      scrollToTopConfig: {
        desktop: false,
        mobile: false,
      },
      shouldShowScrollToTop: false,
    }
  },
  head() {
    return {
      ...this.seoData,
    }
  },
  computed: {
    ...mapState('global', ['loginPanel', 'globalDialogVisible']),
    activateScrollToTop() {
      const { desktop, mobile } = this.scrollToTopConfig

      if (desktop && mobile) {
        return true
      }

      if (desktop) {
        return !this.isMobile
      }

      if (mobile) {
        return this.isMobile
      }

      return false
    },
  },
  methods: {
    scrollToTop() {
      const body = document.querySelector('body')
      scrollToElement({
        el: body!,
        vertical: true,
      })
    },
    checkShouldShowScrollToTop: _.debounce(function () {
      const screenInnerHeight = window.innerHeight
      const pageYScroll =
        window.pageYOffset || document.documentElement.scrollTop

      this.shouldShowScrollToTop = pageYScroll >= screenInnerHeight * 2
    }, 200),
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
    '$route.meta.showScrollToTop': {
      immediate: true,
      handler(val: Data['scrollToTopConfig'] | boolean | undefined) {
        if (typeof val === 'boolean' || typeof val === 'undefined') {
          this.scrollToTopConfig = {
            desktop: val ?? false,
            mobile: val ?? false,
          }
          return
        }

        this.scrollToTopConfig = {
          desktop: val.desktop || false,
          mobile: val.mobile || false,
        }
      },
    },
  },
  mounted() {
    window.addEventListener('scroll', this.checkShouldShowScrollToTop, {
      passive: true,
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.checkShouldShowScrollToTop)
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

export interface Instance
  extends Vue,
    Omit<PageMetaMixinComponentInstance, keyof Vue>,
    Omit<DeviceMixinComponentInstance, keyof Vue> {}

export interface Data {
  shouldShowFooter: boolean
  shouldShowHeader: boolean
  scrollToTopConfig: {
    desktop?: boolean
    mobile?: boolean
  }
  shouldShowScrollToTop: boolean
}

export type Methods = {
  checkShouldShowScrollToTop: DebouncedFunc<(this: ComponentInstance) => void>
  scrollToTop(): void
}

export interface Computed {
  loginPanel: LoginPanelState
  globalDialogVisible: boolean
  activateScrollToTop: boolean
}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/rwd.scss';

.container {
  min-height: 100vh;
}

::v-deep .scrollToTop {
  position: fixed;
  bottom: 20px;
  right: 20px;

  @include min-media('xl') {
    width: 56px;
    height: 56px;
    bottom: 40px;
    right: 40px;
  }
}
</style>
