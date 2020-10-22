<template>
  <ul class="DesktopHeaderNav" :class="{ sales: userRole === 'sales' }">
    <li v-for="(item, index) in headerNavItems" :key="index">
      <component
        :is="item.link ? 'GlobalLink' : 'span'"
        :to="item.link ? item.link.path : null"
        class="DesktopHeaderNav__name"
        :class="{ new: shouldAddNewBadge(item.name) }"
      >
        {{ item.name }}
      </component>
      <BaseArrowDown v-if="item.children" />
      <client-only>
        <HeaderMenuPanel
          v-if="item.children"
          :header-nav-items="item.children"
          class="DesktopHeaderNav__menu"
        />
      </client-only>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import HeaderMenuPanel from '../HeaderMenuPanel.vue'
import { HeaderNavItem } from '@/api/header/header.type'
import BaseArrowDown from '@/components/base/icon/18/BaseArrowDown.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { UserRole } from '@/services/user/user'
import { headerNewBadgeList } from '@/config/header-new-badge-list'

export default {
  components: {
    BaseArrowDown,
    HeaderMenuPanel,
    GlobalLink,
  },
  props: {
    userRole: {
      type: String,
      default: 'guest',
    },
  },
  computed: {
    ...mapState('header', ['headerNavItems']),
  },
  methods: {
    shouldAddNewBadge(text) {
      return headerNewBadgeList.includes(text)
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

export type Methods = {
  shouldAddNewBadge(text: string): boolean
}

export interface Computed {
  headerNavItems: HeaderNavItem[]
}

export interface Props {
  userRole: UserRole
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';
@import '@/sass/elements.scss';

.DesktopHeaderNav {
  $self: &;
  $header-resize-cut-point: 1360px;

  font-weight: 500;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;

  a {
    color: $gray-secondary;

    &:hover {
      color: $primary-color;
    }
  }

  &.sales {
    @media (max-width: $header-resize-cut-point) {
      $base: ($header-resize-cut-point - map-get($grid-breakpoints, 'xl')) / 1px;

      li {
        padding: 0 calc((((100vw - 1200px) / #{$base}) * 8) + 7px);
      }
    }
  }

  li {
    display: flex;
    align-items: center;
    padding: 0 15px;
    cursor: pointer;

    &:hover {
      color: $primary-color;

      &::v-deep svg > path {
        fill: $primary-color;
      }

      #{$self}__menu {
        display: flex;
      }
    }
  }

  &__name {
    display: flex;
    align-items: center;
    height: 60px;

    &.new:after {
      @include header-new-badge;
    }
  }

  &__menu {
    display: none;
    position: absolute;
    top: 54px;
    margin-left: -17px;
    z-index: 10;
  }
}
</style>
