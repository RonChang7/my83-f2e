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
      <GlobalLink
        v-if="shouldShowAskingButton"
        :to="{ name: 'questionAsking' }"
      >
        <AskingRoundButton />
      </GlobalLink>
      <div v-if="shouldShowHeaderHeadline" class="MobileHeader__headerHeadline">
        {{ headerHeadline }}
      </div>
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
import BaseMenu from '@/components/base/icon/24/BaseMenu.vue'
import BaseClose from '@/components/base/icon/24/BaseClose.vue'
import { UserRole } from '@/services/user/user'

export default {
  components: {
    GlobalLink,
    AskingRoundButton,
    BaseMenu,
    BaseClose,
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
    headerHeadline: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isMounted: false,
    }
  },
  computed: {
    shouldShowAskingButton() {
      if (process.server || !this.isMounted) return false

      return (
        this.userRole === 'sales' &&
        (this.$route.name === 'questionList' ||
          this.$route.name === 'questionSearch')
      )
    },
    showCloseMenu() {
      return this.$route.name === 'headerMenu'
    },
    shouldShowHeaderHeadline() {
      return !!this.headerHeadline && this.userRole !== 'sales'
    },
  },
  methods: {
    closeMenuHandler() {
      this.$router.go(-1)
    },
    openMenuHandler() {
      this.$router.push('/header-menu')
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
}

export type Methods = {
  closeMenuHandler(): void
  openMenuHandler(): void
}

export interface Computed {
  shouldShowAskingButton: boolean
  showCloseMenu: boolean
  shouldShowHeaderHeadline: boolean
}

export interface Props {
  enableRwd: boolean
  userRole: UserRole
  headerHeadline: string
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

    &::v-deep > *:not(:last-child) {
      margin-right: 15px;
    }
  }

  &__headerHeadline {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    color: $primary-color;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: left;
  }

  .logo {
    width: 148px;
    height: 34px;
    margin-right: 15px;
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
