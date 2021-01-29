import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Vue as VuePropertyDecorator, Component } from 'vue-property-decorator'
import { GlobalVuexState } from '@/store/global-state'
import { UserRole } from '@/services/auth/auth'

@Component
export default class UserMetaMixin extends VuePropertyDecorator {
  // this.$auth 這個 plugin 不會在 server side 進行注入，所以要額外進行判斷
  get nickname() {
    // @TODO: 先用 work around 方式解決，處理無法正確響應的問題
    return (this.$store.state as GlobalVuexState).header.headerPersonalized
      ? this.$auth.userState.nickname
      : ''
  }

  get userRole(): UserRole {
    // @TODO: 先用 work around 方式解決，處理無法正確響應的問題
    return (this.$store.state as GlobalVuexState).header.headerPersonalized
      ? this.$auth.userState.role
      : 'guest'
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

export interface Instance extends Vue {}

export interface Data {}

export type Methods = {}

export interface Computed {
  nickname: string
  userRole: UserRole
}

export interface Props {}
