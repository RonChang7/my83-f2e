<template>
  <div class="HeaderPersonalize">
    <ul
      v-if="checkItemEmpty(menu) && checkItemEmpty(personalize)"
      class="HeaderPersonalize__unauthorized"
    >
      <li>
        <GlobalLink to="/signup/sales" class="HeaderPersonalize__name">
          我是業務員
        </GlobalLink>
      </li>
      <li>
        <span class="HeaderPersonalize__name" @click="showLoginPanel">
          登入/註冊
        </span>
      </li>
    </ul>

    <ul v-else class="HeaderPersonalize__authorized">
      <li v-if="personalize.sales">
        <HeaderSalesDetail
          class="HeaderPersonalize__name"
          :sales-info="personalize.sales"
        />
      </li>
      <li>
        <GlobalLink to="/notification/center" class="HeaderPersonalize__name">
          <BaseNotification class="HeaderPersonalize__notificationIcon" />
          <BaseBadge
            v-if="notificationCount"
            class="HeaderPersonalize__notification"
          >
            {{ notificationCount }}
          </BaseBadge>
        </GlobalLink>
      </li>
      <li class="HeaderPersonalize__admin" @click="menuToggle">
        <span class="HeaderPersonalize__name">
          <img
            :src="personalize.avatar"
            class="HeaderPersonalize__avatar"
            alt="avatar"
          />
          <BaseArrowRight v-if="!(screenWidth >= 1200) && !shouldShowMenu" />
          <BaseArrowDown
            v-if="screenWidth >= 1200 || shouldShowMenu"
            class="ml-1"
          />
        </span>
        <HeaderMenuPanel
          :header-nav-items="menu"
          :class="{ 'HeaderPersonalize__menu--show': shouldShowMenu }"
          class="HeaderPersonalize__menu"
          @logout="logout"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import _ from 'lodash'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import HeaderMenuPanel from './HeaderMenuPanel.vue'
import HeaderSalesDetail from './HeaderSalesDetail.vue'
import { GlobalVuexState } from '@/store/global-state'
import { HeaderNavItem, Personalize } from '@/api/header/header.type'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseNotification from '@/assets/icon/24/BaseNotification.svg'
import BaseBadge from '@/components/my83-ui-kit/badge/BaseBadge.vue'
import BaseArrowDown from '@/assets/icon/18/BaseArrowDown.svg'
import BaseArrowRight from '@/assets/icon/18/BaseArrowRight.svg'
import * as types from '@/store/global/global.type'
import { logout } from '@/api/login/login'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'

export default {
  mixins: [DeviceMixin],
  components: {
    GlobalLink,
    HeaderSalesDetail,
    BaseNotification,
    BaseBadge,
    BaseArrowDown,
    BaseArrowRight,
    HeaderMenuPanel,
  },
  props: {
    fromHeaderMenu: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      shouldShowMenu: false,
      screenWidth: 0,
    }
  },
  methods: {
    checkItemEmpty(item) {
      return _.isEmpty(item)
    },
    menuToggle() {
      if (this.screenWidth >= 1200) return

      this.shouldShowMenu = !this.shouldShowMenu
    },
    // 取得螢幕寬度
    getScreenWidth() {
      this.screenWidth = window.innerWidth
    },
    reloadHandler() {
      return this.fromHeaderMenu
        ? this.$emit('reload')
        : window.location.reload()
    },
    showLoginPanel() {
      this.$store.dispatch(`global/${types.OPEN_LOGIN_PANEL}`, 'login')
      this.$store.dispatch(`global/${types.UPDATE_AFTER_LOGIN_EVENT}`, () => {
        this.reloadHandler()
      })
    },
    async logout() {
      try {
        await logout()
      } catch (err) {
      } finally {
        this.$auth.logout()
        this.reloadHandler()
      }
    },
  },
  computed: {
    personalize() {
      return this.$store.state.header.headerPersonalized?.personalize
    },
    notificationCount() {
      const count = _.isEmpty(this.personalize)
        ? 0
        : this.personalize.notification_count

      return count > 99 ? '99+' : count
    },
    menu() {
      const menu = this.$store.state.header.headerPersonalized?.menu || []

      if (_.isEmpty(menu)) {
        return menu
      }

      return [
        ...menu,
        {
          name: '登出',
          link: null,
          clickEvent: 'logout',
        },
      ]
    },
  },
  mounted() {
    this.getScreenWidth()
    this.isDesktop && window.addEventListener('resize', this.getScreenWidth)
  },
  beforeDestroy() {
    this.isDesktop && window.removeEventListener('resize', this.getScreenWidth)
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
    Omit<DeviceMixinComponentInstance, keyof Vue> {
  $store: Store<GlobalVuexState>
}

export interface Data {
  shouldShowMenu: boolean
  screenWidth: number
}

export type Methods = {
  reloadHandler: Function
  checkItemEmpty(item: Personalize | Menu): boolean
  menuToggle(): void
  getScreenWidth(): void
  showLoginPanel(): void
  logout(): void
}

export interface Computed {
  personalize: Personalize
  notificationCount: number | string
  menu: Menu
}

export interface Props {
  fromHeaderMenu: boolean
}

interface Menu extends HeaderNavItem {
  clickEvent?: string
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.HeaderPersonalize {
  $self: &;
  font-weight: 500;
  flex: 0 0 auto;

  a {
    @include hover('_gray-secondary-lighter');

    @include max-media('xl') {
      &:active {
        color: $primary-color;
      }
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;

    @include max-media('xl') {
      flex-direction: column;
    }

    li {
      display: flex;
      cursor: pointer;

      @include max-media('xl') {
        min-height: 45px;
      }
    }
  }

  &__unauthorized {
    li {
      padding: 0 15px;

      @include max-media('xl') {
        padding: 0 25px;
      }
    }
  }

  &__authorized {
    li {
      padding: 0 10px;

      @include min-media('xl') {
        &:first-child {
          padding-left: 0;
        }

        &:last-child {
          padding-right: 0;
        }
      }

      @include max-media('xl') {
        padding: 0 25px;
      }
    }
  }

  &__name {
    display: flex;
    align-items: center;
    min-height: 60px;

    @include max-media('xl') {
      min-height: 45px;

      &:active {
        color: $primary-color;

        &::v-deep #{$self}__notification {
          background: $primary-hover-color;
        }

        &::v-deep #{$self}__notificationIcon > path {
          fill: $gray-primary;
        }

        &::v-deep svg > path {
          fill: $primary-color;
        }
      }
    }

    @include min-media('xl') {
      &:hover {
        color: $primary-color;

        &::v-deep #{$self}__notification {
          background: $primary-hover-color;
        }

        &::v-deep #{$self}__notificationIcon > path {
          fill: $gray-primary;
        }

        &::v-deep svg > path {
          fill: $primary-color;
        }
      }
    }
  }

  &__notification {
    margin: -18px 0px 0px -12px;
  }

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 16px;
  }

  &__admin {
    @include max-media('xl') {
      min-height: 45px;
      flex-wrap: wrap;

      #{$self}__name {
        width: 100%;
        justify-content: space-between;
      }
    }
  }

  @include min-media('xl') {
    &__admin:hover {
      #{$self}__menu {
        display: flex;
      }
    }
  }

  &__menu {
    display: none;

    @include min-media('xl') {
      position: absolute;
      top: 54px;
      right: 30px;
    }

    @include max-media('xl') {
      flex: 1 0 100%;

      &--show {
        display: flex;
      }
    }
  }
}
</style>
