import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Vue as VuePropertyDecorator, Component } from 'vue-property-decorator'
import { UserRole } from '@/services/auth/auth'

@Component
export default class UserMetaMixin extends VuePropertyDecorator {
  // this.$auth 這個 plugin 不會在 server side 進行注入，所以要額外進行判斷
  get nickname() {
    return process.client ? this.$auth.userState.nickname : ''
  }

  get userRole(): UserRole {
    return process.client ? this.$auth.userState.role : 'guest'
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
