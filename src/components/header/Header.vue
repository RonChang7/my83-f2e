<template>
  <header>
    <template v-if="this.$ua.isFromPc()">
      <DesktopHeader :enableRwd="true" />
    </template>
    <MobileHeader :enableRwd="this.$ua.isFromPc()" />
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

export default {
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

export interface Computed {}

export interface Props {}
</script>
