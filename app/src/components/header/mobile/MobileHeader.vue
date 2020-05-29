<template>
  <div
    :class="{ 'no-shadow': showCloseMenu, rwd: enableRwd }"
    class="MobileHeader"
  >
    <GlobalLink to="/">
      <img
        :src="`${$imageUrl}/front/common/my83-logo.svg`"
        alt="MY83"
        class="logo"
      />
    </GlobalLink>
    <BaseClose v-if="showCloseMenu" @click.native="closeMenuHandler" />
    <BaseMenu v-else @click.native="openMenuHandler" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseMenu from '@/components/base/icon/24/BaseMenu.vue'
import BaseClose from '@/components/base/icon/24/BaseClose.vue'

export default {
  components: {
    GlobalLink,
    BaseMenu,
    BaseClose,
  },
  props: {
    enableRwd: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showCloseMenu: false,
    }
  },
  methods: {
    closeMenuHandler() {
      this.$router.go(-1)
    },
    openMenuHandler() {
      this.$router.push('/header-menu')
    },
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler(val) {
        this.showCloseMenu = val === '/header-menu'
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
  showCloseMenu: boolean
}

export interface Methods {
  closeMenuHandler(): void
  openMenuHandler(): void
}

export interface Computed {}

export interface Props {
  enableRwd: boolean
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.MobileHeader {
  @include shadow-02;
  background: $default-bg;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 15px;

  .logo {
    width: 148px;
    height: 34px;
    margin-right: 30px;
  }

  &.no-shadow {
    box-shadow: none;
  }

  &.rwd {
    @include min-media('xl') {
      display: none;
    }
  }
}
</style>
