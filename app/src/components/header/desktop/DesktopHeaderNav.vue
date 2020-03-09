<template>
  <ul class="DesktopHeaderNav">
    <li v-for="(item, index) in headerNavItems" :key="index">
      <component
        :is="item.link ? 'GlobalLink' : 'span'"
        :to="item.link ? item.link.path : ''"
        class="DesktopHeaderNav__name"
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

export default {
  components: {
    BaseArrowDown,
    HeaderMenuPanel,
    GlobalLink,
  },
  computed: {
    ...mapState('header', ['headerNavItems']),
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

export interface Props {
  headerNavItems: HeaderNavItem[]
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.DesktopHeaderNav {
  $self: &;

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

  li {
    display: flex;
    align-items: center;
    padding: 0 15px;
    cursor: pointer;

    @media (max-width: 1451px) {
      padding: 0 19px 0 0;
    }

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
