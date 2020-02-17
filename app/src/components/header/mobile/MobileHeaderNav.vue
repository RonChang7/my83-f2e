<template>
  <ul class="MobileHeaderNav">
    <li
      v-for="(item, index) in headerNavItems"
      :key="index"
      @click="menuToggle(index)"
    >
      <component
        :is="item.link ? 'GlobalLink' : 'span'"
        :to="item.link ? item.link.path : ''"
        class="MobileHeaderNav__name"
      >
        {{ item.name }}
      </component>
      <BaseArrowRight v-if="item.children && !shouldShowMenu(index)" />
      <BaseArrowDown v-if="item.children && shouldShowMenu(index)" />
      <client-only>
        <HeaderMenuPanel
          v-if="item.children"
          :header-nav-items="item.children"
          :class="{ 'MobileHeaderNav__menu--show': shouldShowMenu(index) }"
          class="MobileHeaderNav__menu"
        />
      </client-only>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { mapState } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import HeaderMenuPanel from '../HeaderMenuPanel.vue'
import { HeaderNavItem } from '@/api/header/header.type'
import BaseArrowRight from '@/components/base/icon/18/BaseArrowRight.vue'
import BaseArrowDown from '@/components/base/icon/18/BaseArrowDown.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'

export default {
  components: {
    BaseArrowRight,
    BaseArrowDown,
    HeaderMenuPanel,
    GlobalLink,
  },
  data() {
    return {
      displayMenu: [],
    }
  },
  methods: {
    menuToggle(index) {
      if (this.shouldShowMenu(index)) {
        const removeIndex = _.indexOf(this.displayMenu, index)
        this.displayMenu.splice(removeIndex, 1)
      } else {
        this.displayMenu.push(index)
      }
    },
    shouldShowMenu(index) {
      return _.includes(this.displayMenu, index)
    },
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

export interface Data {
  displayMenu: Array<number>
}

export interface Methods {
  menuToggle: (index: number) => void
  shouldShowMenu: (index: number) => boolean
}

export interface Computed {
  headerNavItems: HeaderNavItem[]
}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.MobileHeaderNav {
  $self: &;

  font-weight: 500;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  color: $gray-secondary;

  &:after {
    content: '';
    width: calc(100% - 50px);
    margin: 10px 0 10px 25px;
    border-bottom: 1px solid $secondary-bg;
  }

  a {
    color: $gray-secondary;

    &:active {
      color: $primary-color;
    }
  }

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 25px;
    cursor: pointer;

    &:active {
      color: $primary-color;
    }
  }

  &__name {
    display: flex;
    align-items: center;
    height: 45px;
  }

  &__menu {
    display: none;
    flex: 1 0 100%;

    &--show {
      display: flex;
    }
  }
}
</style>
