<template>
  <div :class="{ rwd: enableRwd }" class="DesktopHeader">
    <GlobalLink to="/">
      <img
        :src="`${$imageBucketUrl}/front/common/my83-logo.svg`"
        alt="MY83"
        class="logo"
      />
    </GlobalLink>
    <nav>
      <DesktopHeaderNav :user-role="userRole" />
      <HeaderPersonalize />
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import HeaderPersonalize from '../HeaderPersonalize.vue'
import DesktopHeaderNav from './DesktopHeaderNav.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { UserRole } from '@/services/auth/auth'

export default {
  components: {
    DesktopHeaderNav,
    HeaderPersonalize,
    GlobalLink,
  },
  props: {
    enableRwd: {
      type: Boolean,
      default: false,
    },
    userRole: {
      type: String,
      default: 'guest',
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

export interface Data {}

export type Methods = {}

export interface Computed {}

export interface Props {
  enableRwd: boolean
  userRole: UserRole
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.DesktopHeader {
  $header-resize-cut-point: 1360px;

  @include shadow('02');

  background: $default-bg;
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 30px;

  .logo {
    width: 148px;
    height: 34px;
    margin-right: 30px;

    @media (max-width: $header-resize-cut-point) {
      $base: ($header-resize-cut-point - map-get($grid-breakpoints, 'xl')) / 1px;

      margin-right: calc((((100vw - 1200px) / #{$base}) * 20) + 10px);
    }
  }

  nav {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  &.rwd {
    @include max-media('xl') {
      display: none;
    }
  }
}
</style>
