<template>
  <div class="HeaderPersonalize">
    <ul
      v-if="isEmpty(menu) && isEmpty(personalize)"
      class="HeaderPersonalize__unauthorized"
    >
      <li>
        <GlobalLink to="/signup/sales" class="HeaderPersonalize__name">
          我是業務員
        </GlobalLink>
      </li>
      <li>
        <span @click="showLoginPanel" class="HeaderPersonalize__name">
          登入/註冊
        </span>
      </li>
    </ul>

    <ul v-else class="HeaderPersonalize__authorized">
      <li v-if="personalize.sales">
        <HeaderSalesDetail :salesInfo="personalize.sales" />
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
      <li @click="menuToggle" class="HeaderPersonalize__admin">
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
          :headerNavItems="menu"
          :class="{ 'HeaderPersonalize__menu--show': shouldShowMenu }"
          @logout="logout"
          class="HeaderPersonalize__menu"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import HeaderMenuPanel from './HeaderMenuPanel.vue'
import HeaderSalesDetail from './HeaderSalesDetail.vue'
import { State } from '@/store/header/index'
import { HeaderNavItem, Personalize } from '@/api/header/header.type'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseNotification from '@/components/base/icon/24/BaseNotification.vue'
import BaseBadge from '@/components/my83-ui-kit/badge/BaseBadge.vue'
import BaseArrowDown from '@/components/base/icon/18/BaseArrowDown.vue'
import BaseArrowRight from '@/components/base/icon/18/BaseArrowRight.vue'
import * as types from '@/store/global/global.type'
import { logout } from '@/api/login/login'

export default {
  components: {
    GlobalLink,
    HeaderSalesDetail,
    BaseNotification,
    BaseBadge,
    BaseArrowDown,
    BaseArrowRight,
    HeaderMenuPanel,
  },
  data() {
    return {
      shouldShowMenu: false,
      screenWidth: 0,
    }
  },
  methods: {
    isEmpty(item) {
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
    showLoginPanel() {
      this.$store.dispatch(`global/${types.OPEN_LOGIN_PANEL}`, 'login')
      this.$store.dispatch(`global/${types.UPDATE_AFTER_LOGIN_EVENT}`, () => {
        location.reload()
      })
    },
    async logout() {
      const result = await logout()
      result && location.reload()
    },
  },
  computed: {
    personalize() {
      const { headerPersonalized } = this.$store.state.header as State
      return headerPersonalized ? headerPersonalized.personalize : {}
    },
    notificationCount() {
      const count = _.isEmpty(this.personalize)
        ? 0
        : this.personalize.notification_count

      return count > 99 ? '99+' : count
    },
    menu() {
      const { headerPersonalized } = this.$store.state.header as State
      const menu = headerPersonalized ? headerPersonalized.menu : []

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
    this.$ua.isFromPc() &&
      window.addEventListener('resize', this.getScreenWidth)
  },
  beforeDestroy() {
    this.$ua.isFromPc() &&
      window.removeEventListener('resize', this.getScreenWidth)
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
  shouldShowMenu: boolean
  screenWidth: number
}

export interface Methods {
  isEmpty: () => boolean
  menuToggle: () => void
  getScreenWidth: () => void
  logout: () => void
}

export interface Computed {
  personalize: Personalize
  notificationCount: number | string
  menu: Menu
}

export interface Props {}

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

  a {
    color: $gray-secondary;

    @include min-media('xl') {
      &:hover {
        color: $primary-color;
      }
    }

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
      align-items: center;
      cursor: pointer;
      min-height: 60px;

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
