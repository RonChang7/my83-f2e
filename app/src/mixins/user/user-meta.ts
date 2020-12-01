import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Vue as VuePropertyDecorator, Component } from 'vue-property-decorator'
import { GlobalVuexState } from '@/store/global-state'
import { UserRole } from '@/store/user/index'

@Component
export default class UserMetaMixin extends VuePropertyDecorator {
  get nickname() {
    return (this.$store.state as GlobalVuexState).user.nickname
  }

  get userRole() {
    return (this.$store.state as GlobalVuexState).user.role
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

export interface Computed {
  nickname: string
  userRole: UserRole
}

export interface Props {}
