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
    <div class="InsuranceLinkSection__disclaimer">
      本平台呈現資料僅供參考，實際情況會依據個人需求而不同，最終費率與資訊請以各家官方網站為主。
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { defineComponent, Ref, ref, watch } from '@nuxtjs/composition-api'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { HeaderNavItem } from '@/api/header/header.type'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseArrowRight from '@/assets/icon/18/BaseArrowRight.svg'
import { useRoute, useStore } from '@/utils/composition-api'

export default defineComponent({
  components: {
    GlobalLink,
    BaseArrowRight,
  },
  setup() {
    const store = useStore<InsuranceVuexState>()
    const route = useRoute()
    const insuranceLink: Ref<HeaderNavItem[] | null> = ref(null)

    const findHeaderNavItemById = (
      headerNavItems: HeaderNavItem[],
      id: string
    ) => {
      let path: string[] = []

      for (let index = 0; index < headerNavItems.length; index++) {
        if (headerNavItems[index].id === id) {
          path.push(index.toString(), 'children')
          break
        }

        if (headerNavItems[index].children) {
          const childPath = findHeaderNavItemById(
            headerNavItems[index].children!,
            id
          )

          if (childPath.length) {
            path = path.concat([index.toString(), 'children'], childPath)
          }
        }
      }

      return path
    }

    const removeLink = (headerNavItem: HeaderNavItem[] | null) => {
      if (headerNavItem === null) return null

      return headerNavItem.filter(
        (item) => item.link?.path !== route.value.path
      )
    }

    watch(
      () => store.state.header.headerNavItems,
      (val) => {
        const path = findHeaderNavItemById(val, 'insurance')
        insuranceLink.value = removeLink(_.get(val, path, null))
      },
      {
        immediate: true,
      }
    )

    return {
      insuranceLink,
    }
  },
})
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

    @include hover('_gray-primary');

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

      @include hover('_gray-secondary-darker', $has-svg: true);
    }
  }

  &__disclaimer {
    margin-top: 20px;
    color: $gray-tertiary;
    font-size: 0.75rem;
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

    &__disclaimer {
      padding: 0 19px 0 20px;
    }
  }
}
</style>
