<template>
  <!-- eslint-disable-next-line vue/require-component-is -->
  <component :is="htmlTag" v-bind="props" v-on="$listeners">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { RawLocation, Location } from 'vue-router'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

export default {
  props: {
    to: {
      type: [String, Object],
      default: '',
    },
  },
  methods: {
    checkRouteMatched() {
      if (!this.$router) {
        return false
      }

      const matches = this.$router.getMatchedComponents(this.to)

      return !_.isEmpty(matches)
    },
    checkAbsoluteLink() {
      if (_.isNil(this.href)) {
        return false
      }

      return /^https?:\/\//.test(this.href as string)
    },
  },
  computed: {
    href() {
      if (_.isString(this.to)) {
        return this.to
      } else if (_.isObject(this.to) && !_.isNil((this.to as Location).path)) {
        return (this.to as Location).path
      }
    },
    htmlTag() {
      if (!this.checkAbsoluteLink() && this.checkRouteMatched()) {
        return 'nuxt-link'
      }

      return 'a'
    },
    props() {
      switch (this.htmlTag) {
        case 'a':
          return { href: this.href, ...this.$attrs }

        case 'nuxt-link':
          return { to: this.to, ...this.$attrs }
      }
    },
  },
} as ComponentOption

type GlobalLinkTag = 'a' | 'nuxt-link'

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

export interface Methods {
  checkRouteMatched: () => boolean
  checkAbsoluteLink: () => boolean
}

export interface Computed {
  href: string | undefined
  htmlTag: GlobalLinkTag
  props: { [key: string]: any }
}

export interface Props {
  to: RawLocation
}
</script>
