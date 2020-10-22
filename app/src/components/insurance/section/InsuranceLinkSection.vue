<template>
  <div class="InsuranceLinkSection__wrapper">
    <div class="InsuranceLinkSection">
      <div class="InsuranceLinkSection__title">其他險種</div>
      <div class="InsuranceLinkSection__content">
        <GlobalLink
          v-for="(item, index) in insuranceLink"
          :key="index"
          class="InsuranceLinkSection__link"
          :to="item.link.path"
        >
          {{ item.name }}
        </GlobalLink>
      </div>
    </div>
    <div class="InsuranceLinkSection__footer">
      <GlobalLink to="/product/leaderboard">
        看看保險商品熱銷榜
        <BaseArrowRight class="ml-1" />
      </GlobalLink>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { HeaderNavItem } from '@/api/header/header.type'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseArrowRight from '@/components/base/icon/18/BaseArrowRight.vue'

const options: ComponentOption = {
  components: {
    GlobalLink,
    BaseArrowRight,
  },
  data() {
    return {
      insuranceLink: null,
    }
  },
  methods: {
    findHeaderNavItemById(headerNavItems, id) {
      let path: string[] = []

      for (let index = 0; index < headerNavItems.length; index++) {
        if (headerNavItems[index].id === id) {
          path.push(index.toString(), 'children')
          break
        }

        if (headerNavItems[index].children) {
          const childPath = this.findHeaderNavItemById(
            headerNavItems[index].children!,
            id
          )

          if (childPath.length) {
            path = path.concat([index.toString(), 'children'], childPath)
          }
        }
      }

      return path
    },
    removeLink(headerNavItem) {
      if (headerNavItem === null) return null

      return headerNavItem.filter(
        (item) => item.link?.path !== this.$route.path
      )
    },
  },
  watch: {
    '$store.state.header.headerNavItems': {
      immediate: true,
      handler(val) {
        const path = this.findHeaderNavItemById(val, 'insurance')
        this.insuranceLink = this.removeLink(_.get(val, path, null))
      },
    },
  },
}

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

export interface Instance extends Vue {
  $store: Store<InsuranceVuexState>
}

export interface Data {
  insuranceLink: HeaderNavItem[] | null
}

export type Methods = {
  findHeaderNavItemById(item: HeaderNavItem[], id: string): string[]
  removeLink(item: HeaderNavItem[] | null): HeaderNavItem[] | null
}

export interface Computed {}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.InsuranceLinkSection {
  @include card-primary;

  & > * {
    padding: 0 30px;
  }

  &__wrapper {
    margin-bottom: 20px;
  }

  &__title {
    display: flex;
    align-items: center;
    color: $gray-primary;
    height: 50px;
    border-bottom: 1px solid $gray-quaternary;
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__link {
    padding: 16px 0 16px 24px;
    font-size: 1.125rem;
    color: $gray-primary;

    &:hover {
      color: $primary-color;
    }

    &:not(:last-child) {
      border-bottom: 1px solid $gray-quaternary;
    }
  }

  &__footer {
    margin-top: 10px;
    font-size: 0.875rem;
    text-align: right;

    > a {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: $gray-secondary;

      &:hover {
        color: $gray-primary;

        ::v-deep svg > path {
          fill: $gray-primary;
        }
      }
    }
  }

  @include max-media('xl') {
    @include card-secondary;

    & > * {
      padding: 0 20px;
    }

    &__wrapper {
      margin-bottom: 10px;
    }

    &__title {
      color: $gray-secondary;
      font-size: 0.875rem;
      height: 36px;
    }

    &__footer {
      margin-right: 16px;
    }
  }
}
</style>
