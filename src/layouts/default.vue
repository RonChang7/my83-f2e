<template>
  <div>
    <Header v-if="shouldShowHeader" />
    <nuxt />
    <Footer v-if="shouldShowFooter" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

import Header from '@/components/header/Header.vue'
import Footer from '@/components/footer/Footer.vue'

export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      shouldShowFooter: true,
      shouldShowHeader: true,
    }
  },
  watch: {
    '$route.meta.hideFooter': {
      immediate: true,
      handler(val) {
        this.shouldShowFooter = !val
      },
    },
    '$route.meta.hideHeader': {
      immediate: true,
      handler(val) {
        this.shouldShowHeader = !val
      },
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

export interface Instance extends Vue {}

export interface Data {
  shouldShowFooter: boolean
  shouldShowHeader: boolean
}

export interface Methods {}

export interface Computed {}

export interface Props {}
</script>
