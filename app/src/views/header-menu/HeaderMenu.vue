<template>
  <nav class="HeaderMenu">
    <MobileHeaderNav />
    <HeaderPersonalize />
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import MobileHeaderNav from '@/components/header/mobile/MobileHeaderNav.vue'
import HeaderPersonalize from '@/components/header/HeaderPersonalize.vue'

export default {
  beforeRouteEnter(to, from, next) {
    // 如果 client 點選登出，mobile 要回到上一頁並重新整理 (因為 mobile 的選單是獨立 route)
    to.meta.perviousPath = from.path
    return next()
  },
  components: {
    MobileHeaderNav,
    HeaderPersonalize,
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
