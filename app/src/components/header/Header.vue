<template>
  <header>
    <template v-if="isDesktop">
      <DesktopHeader :enable-rwd="true" />
    </template>
    <MobileHeader :enable-rwd="isDesktop" />
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import DesktopHeader from './desktop/DesktopHeader.vue'
import MobileHeader from './mobile/MobileHeader.vue'
import * as types from '@/store/header/header.type'
import { User } from '@/services/user/user'
import DeviceMixin, {
  Computed as DeviceMixinComputed,
} from '@/mixins/device/device-mixins'

export default {
  mixins: [DeviceMixin],
  components: {
    DesktopHeader,
    MobileHeader,
  },
  mounted() {
    if (User.role === 'sales') {
      this.$store.dispatch(`header/${types.FETCH_HEADER_NAV_DATA}`)
    }

    if (User.role !== 'guest') {
      this.$store.dispatch(`header/${types.FETCH_HEADER_PERSONALIZED_DATA}`)
    }
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

export interface Data {}

export interface Methods {}

export interface Computed extends DeviceMixinComputed {}

export interface Props {}
</script>
