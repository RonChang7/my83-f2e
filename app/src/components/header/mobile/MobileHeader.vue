<template>
  <div
    :class="{ 'no-shadow': showCloseMenu, rwd: enableRwd }"
    class="MobileHeader"
  >
    <GlobalLink to="/">
      <img
        :src="`${$imageBucketUrl}/front/common/my83-logo.svg`"
        alt="MY83"
        class="logo"
      />
    </GlobalLink>
    <div class="MobileHeader__function">
      <HeaderAnnouncement v-if="announcement" :announcement="announcement" />
      <div v-if="shouldShowSearch" class="MobileHeader__search">
        <HeaderSearch @close="disableSearchInput" />
      </div>
      <BaseSearch v-else @click="enableSearchInput" />
      <BaseClose v-if="showCloseMenu" @click.native="closeMenuHandler" />
      <BaseMenu v-else @click.native="openMenuHandler" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import AskingRoundButton from '@/components/my83-ui-kit/button/AskingRoundButton.vue'
import BaseMenu from '@/assets/icon/24/BaseMenu.svg'
import BaseClose from '@/assets/icon/24/BaseClose.svg'
import BaseSearch from '@/assets/icon/24/BaseSearch.svg'
import { UserRole } from '@/services/auth/auth'
import { Announcement } from '@/api/header/header.type'
import HeaderAnnouncement from '../HeaderAnnouncement.vue'
import HeaderSearch from '../HeaderSearch.vue'

export default {
  components: {
    HeaderAnnouncement,
    HeaderSearch,
    GlobalLink,
    AskingRoundButton,
    BaseMenu,
    BaseClose,
    BaseSearch,
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
    announcement: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isMounted: false,
      shouldShowSearch: false,
    }
  },
  computed: {
    showCloseMenu() {
      return this.$route.name === 'headerMenu'
    },
  },
  methods: {
    closeMenuHandler() {
      this.$router.go(-1)
    },
    openMenuHandler() {
      this.$router.push('/header-menu')
    },
    enableSearchInput() {
      this.shouldShowSearch = true
    },
    disableSearchInput() {
      this.shouldShowSearch = false
    },
  },
  mounted() {
    this.isMounted = true
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
  isMounted: boolean
  shouldShowSearch: boolean
}

export type Methods = {
  closeMenuHandler(): void
  openMenuHandler(): void
  enableSearchInput(): void
  disableSearchInput(): void
}

export interface Computed {
  showCloseMenu: boolean
}

export interface Props {
  enableRwd: boolean
  userRole: UserRole
  announcement: Announcement
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.MobileHeader {
  @include shadow('02');
  background: $default-bg;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 15px;

  &__function {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;

    &::v-deep > *:not(:last-child) {
      margin-right: 8px;
    }

    &::v-deep > svg {
      flex: 0 0 auto;
    }
  }

  &__search {
    position: fixed;
    left: 0;
    width: 100vw;
    height: 56px;
    display: flex;
    align-items: center;
    padding: 10px 15px;
    background: #fff;
  }

  .logo {
    width: 148px;
    height: 34px;
    margin-right: 5px;
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
