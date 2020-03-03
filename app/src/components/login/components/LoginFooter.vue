<template>
  <div class="LoginFooter">
    <hr />
    <div class="LoginFooter__content">
      還不是MY83會員嗎？
    </div>
    <a @click.prevent="$emit('to-panel', 'sign-up')">我是保戶</a>
    <GlobalLink to="/signup/sales">
      我是業務員
    </GlobalLink>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'

export default {
  components: {
    GlobalLink,
  },
  mounted() {
    if (this.$ua.isFromPc() || window.innerWidth >= 1200) return
    const el = this.$el as HTMLElement
    const offsetTop = el.offsetTop
    const offsetHeight = el.offsetHeight

    if (window.innerHeight < offsetTop + offsetHeight) return

    el.style.marginTop = `calc(100vh - ${offsetTop}px - ${offsetHeight}px - 30px - 28px - 2px)`
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

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.LoginFooter {
  font-weight: 500;
  text-align: center;

  &__content {
    color: $gray-primary;
    margin-bottom: 10px;
  }

  hr {
    margin: 20px 0;
  }

  a {
    margin-left: 50px;

    &:first-of-type {
      margin-left: 0;
    }
  }
}
</style>
