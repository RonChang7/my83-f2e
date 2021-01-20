import Vue from 'vue'
import { Store } from 'vuex'
import { computed } from '@nuxtjs/composition-api'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Vue as VuePropertyDecorator, Component } from 'vue-property-decorator'
import { GlobalVuexState } from '@/store/global-state'
import { UserAgent } from '@/store/global/index'
import { useStore } from '@/utils/composition-api'

@Component
export default class DeviceMixin extends VuePropertyDecorator {
  get isDesktop() {
    const { userAgent } = (this.$store.state as GlobalVuexState).global
    return userAgent ? userAgent.isDesktop : null
  }

  get isMobile() {
    const { userAgent } = (this.$store.state as GlobalVuexState).global
    return userAgent ? userAgent.isMobile : null
  }

  get isTablet() {
    const { userAgent } = (this.$store.state as GlobalVuexState).global
    return userAgent ? userAgent.isTablet : null
  }
}

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

export type Methods = {}

export interface Computed extends UserAgent {}

export interface Props {}

export const useDevice = () => {
  const store = useStore<GlobalVuexState>()

  return {
    isDesktop: computed(() => store.state.global.userAgent?.isDesktop || null),
    isMobile: computed(() => store.state.global.userAgent?.isMobile || null),
    isTablet: computed(() => store.state.global.userAgent?.isTablet || null),
  }
}
