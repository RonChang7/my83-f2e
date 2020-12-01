<template>
  <Affix placeholder-class="Header__wrapper" content-class="Header__content">
    <header>
      <template v-if="isDesktop">
        <DesktopHeader :enable-rwd="true" :user-role="userRole" />
      </template>
      <MobileHeader :enable-rwd="isDesktop" />
    </header>
  </Affix>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import DesktopHeader from './desktop/DesktopHeader.vue'
import MobileHeader from './mobile/MobileHeader.vue'
import Affix from '@/components/base/affix/Affix.vue'
import * as types from '@/store/header/header.type'
import { GlobalVuexState } from '@/store/global-state'
import { UserRole } from '@/store/user/index'
import DeviceMixin, {
  Computed as DeviceMixinComputed,
} from '@/mixins/device/device-mixins'
import UserMetaMixin, {
  Computed as UserMetaMixinComputed,
} from '@/mixins/user/user-meta'

export default {
  mixins: [DeviceMixin, UserMetaMixin],
  components: {
    DesktopHeader,
    MobileHeader,
    Affix,
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

export type Methods = {}

export interface Computed extends DeviceMixinComputed, UserMetaMixinComputed {}

export interface Props {}
</script>
<style lang="scss" scoped>
@import '@/sass/variables.scss';

.Header {
  &__wrapper {
    width: auto;
  }

  ::v-deep &__content {
    z-index: map-get($z-index, 'header');
  }
}
</style>
