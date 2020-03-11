<template>
  <header>
    <template v-if="isDesktop">
      <DesktopHeader :enable-rwd="true" :user-role="userRole" />
    </template>
    <MobileHeader :enable-rwd="isDesktop" />
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import DesktopHeader from './desktop/DesktopHeader.vue'
import MobileHeader from './mobile/MobileHeader.vue'
import * as types from '@/store/header/header.type'
import { GlobalVuexState } from '@/store/global-state'
import { UserRole } from '@/services/user/user'
import DeviceMixin, {
  Computed as DeviceMixinComputed,
} from '@/mixins/device/device-mixins'

export default {
  mixins: [DeviceMixin],
  components: {
    DesktopHeader,
    MobileHeader,
  },
  computed: {
    userRole() {
      const { headerPersonalized } = this.$store.state.header
      return headerPersonalized ? headerPersonalized.personalize.role : 'guest'
    },
  },
  watch: {
    userRole(val: UserRole) {
      if (val === 'sales') {
        this.$store.dispatch(`header/${types.FETCH_HEADER_NAV_DATA}`)
      }
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

export interface Computed extends DeviceMixinComputed {}

export interface Props {
  userRole: UserRole
}
</script>
