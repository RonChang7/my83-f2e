import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { GlobalVuexState } from '@/store/global-state'
import { UserAgent } from '@/store/global/index'

export default {
  computed: {
    isDesktop() {
      const { userAgent } = this.$store.state.global
      return userAgent ? userAgent.isDesktop : null
    },
    isMobile() {
      const { userAgent } = this.$store.state.global
      return userAgent ? userAgent.isMobile : null
    },
    isTablet() {
      const { userAgent } = this.$store.state.global
      return userAgent ? userAgent.isTablet : null
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

export interface Instance extends Vue {
  $store: Store<GlobalVuexState>
}

export interface Data {}

export interface Methods {}

export interface Computed extends UserAgent {}

export interface Props {}
