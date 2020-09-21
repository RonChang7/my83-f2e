import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { GlobalVuexState } from '@/store/global-state'
import { UserRole } from '@/services/user/user'

const options: ComponentOption = {
  computed: {
    nickname() {
      return (
        this.$store.state.header.headerPersonalized?.personalize.nickname || ''
      )
    },
    userRole() {
      return (
        this.$store.state.header.headerPersonalized?.personalize.role || 'guest'
      )
    },
  },
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

export default options
