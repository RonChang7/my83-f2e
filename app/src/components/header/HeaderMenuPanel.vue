<template>
  <div ref="panel" class="HeaderMenuPanel">
    <!-- Panel with multi-column -->
    <template v-if="headerMenuPanelWithMultiColumn">
      <div
        v-for="(column, columnIndex) in headerNavItems"
        ref="column"
        :key="columnIndex"
        class="HeaderMenuPanel__column"
      >
        <div
          v-if="column.children"
          class="HeaderMenuPanel__column__title"
          :class="{ new: shouldAddNewBadge(column.name) }"
        >
          {{ column.name }}
        </div>
        <div
          v-for="(item, itemIndex) in column.children"
          :key="itemIndex"
          class="HeaderMenuPanel__column__link wider"
        >
          <GlobalLink
            v-if="item.link"
            :to="item.link.path"
            :class="{ new: shouldAddNewBadge(item.name) }"
          >
            {{ item.name }}
          </GlobalLink>
          <div
            v-if="item.description"
            class="HeaderMenuPanel__column__description"
          >
            {{ item.description }}
          </div>
        </div>
      </div>
    </template>

    <!-- Panel with single-column -->
    <template v-else>
      <div class="HeaderMenuPanel__column">
        <div
          v-if="headerNavItems.children"
          class="HeaderMenuPanel__column__title"
        >
          {{ headerNavItems.name }}
        </div>
        <div
          v-for="(item, itemIndex) in headerNavItems"
          :key="itemIndex"
          class="HeaderMenuPanel__column__link"
        >
          <GlobalLink
            v-if="item.link"
            :to="item.link.path"
            :class="{ new: shouldAddNewBadge(item.name) }"
          >
            {{ item.name }}
          </GlobalLink>
          <div
            v-if="item.description"
            class="HeaderMenuPanel__column__description"
          >
            {{ item.description }}
          </div>
          <a v-if="item.clickEvent" @click.prevent="$emit(item.clickEvent)">
            {{ item.name }}
          </a>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { HeaderNavItem } from '@/api/header/header.type'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { headerNewBadgeList } from '@/config/header-new-badge-list'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'

export default {
  mixins: [DeviceMixin],
  components: {
    GlobalLink,
  },
  props: {
    headerNavItems: {
      type: Array,
      required: true,
    },
  },
  methods: {
    shouldAddNewBadge(text) {
      return headerNewBadgeList.includes(text)
    },
    columnWidthHandler() {
      if (!this.isDesktop || !this.$refs.column) return
      const columns = this.$refs.column.filter(Boolean)
      const panel = this.$refs.panel
      // 因為 display: none 的 DOM 無法取得寬度 (Child DOM 也是)
      panel.style.display = 'flex'

      const width = columns.reduce((acc, cur) => {
        return acc > cur.offsetWidth ? acc : cur.offsetWidth
      }, 0)

      if (width) {
        columns.forEach((el) => {
          // 預設取到的數值為整數，會捨去小數，故 +1
          el.style.width = `${width + 1}px`
        })
      }

      panel.style.display = ''
    },
  },
  computed: {
    headerMenuPanelWithMultiColumn() {
      return this.headerNavItems.filter((item) => item.children).length
    },
  },
  mounted() {
    if (this.isDesktop) {
      this.columnWidthHandler()
    }
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
  $refs: {
    column: HTMLElement[]
    panel: HTMLElement
  }
}

export interface Data {}

export type Methods = {
  columnWidthHandler(): void
  shouldAddNewBadge(text: string): boolean
}

export interface Computed {
  headerMenuPanelWithMultiColumn: boolean
}

export interface Props {
  headerNavItems: HeaderNavItem[]
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';
@import '@/sass/elements.scss';

.HeaderMenuPanel {
  padding: 20px 35px;
  color: $text-default-color;

  @include min-media('xl') {
    @include card-primary;
  }

  @include max-media('xl') {
    flex-direction: column;
    padding: 5px 15px 0;
  }

  a {
    @include hover('_gray-secondary-lighter');

    @include max-media('xl') {
      &:active {
        color: $primary-color;
      }
    }
  }

  &__column {
    padding-right: 5px;

    @include min-media('xl') {
      margin-right: 25px;

      &:last-child {
        margin-right: 0;
      }
    }

    @include max-media('xl') {
      margin-bottom: 30px;
    }

    &__title {
      display: flex;
      align-items: center;
      padding-bottom: 10px;
      margin-bottom: 15px;
      border-bottom: 1px solid $secondary-bg;
    }

    &__link {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-bottom: 15px;

      @include max-media('xl') {
        min-height: 40px;
        padding: 0 0 15px 10px;
        margin: 0;
      }

      @include min-media('xl') {
        &.wider {
          margin-right: 15px;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    &__description {
      color: $gray-tertiary;
      font-size: 0.875rem;
      margin-top: 4px;
    }
  }

  .new:after {
    @include header-new-badge;
  }
}
</style>
