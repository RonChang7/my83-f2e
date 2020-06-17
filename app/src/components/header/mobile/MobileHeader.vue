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
import UserMetaMixin, {
  ComponentInstance as UserMetaMixinComponentInstance,
} from '@/mixins/user/user-meta'

export default {
  mixins: [UserMetaMixin],
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

export interface Instance
  extends Vue,
    Omit<UserMetaMixinComponentInstance, keyof Vue> {}

export interface Data {
  isMounted: boolean
}

export interface Methods {
  closeMenuHandler(): void
  openMenuHandler(): void
}

export interface Computed {
  shouldShowAskingButton: boolean
  showCloseMenu: boolean
}

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

  &__function {
    display: flex;
    align-items: center;

    &::v-deep > *:not(:last-child) {
      margin-right: 15px;
    }
  }

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
