<template>
  <Affix placeholder-class="Header__wrapper" content-class="Header__content">
    <!-- eslint-disable-next-line prettier/prettier -->
    <div class="ie-info">注意：MY83 保險網不支援 Internet Explorer，為了確保良好的服務體驗，建議您使用其他瀏覽器，例如 Google Chrome、Firefox、Safari、Microsoft Edge。</div>
    <header>
      <template v-if="isDesktop">
        <DesktopHeader
          :announcement="announcement"
          :enable-rwd="true"
          :user-role="userRole"
        />
      </template>
      <MobileHeader
        :announcement="announcement"
        :enable-rwd="isDesktop"
        :user-role="userRole"
      />
    </header>
  </Affix>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import Affix from '@/components/base/affix/Affix.vue'
import * as types from '@/store/header/header.type'
import { GlobalVuexState } from '@/store/global-state'
import { UserRole } from '@/services/auth/auth'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'
import UserMetaMixin, {
  ComponentInstance as UserMetaMixinComponentInstance,
} from '@/mixins/user/user-meta'
import { Announcement } from '@/api/header/header.type'
import MobileHeader from './mobile/MobileHeader.vue'
import DesktopHeader from './desktop/DesktopHeader.vue'

export default {
  mixins: [DeviceMixin, UserMetaMixin],
  components: {
    DesktopHeader,
    MobileHeader,
    Affix,
  },
  computed: {
    announcement() {
      return this.$store.state.header.announcement
    },
  },
  watch: {
    userRole(val: UserRole) {
      if (val === 'sales') {
        this.$store.dispatch(`header/${types.FETCH_HEADER_NAV_DATA}`)
      }
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

export interface Instance
  extends Vue,
    Omit<DeviceMixinComponentInstance, keyof Vue>,
    Omit<UserMetaMixinComponentInstance, keyof Vue> {
  $store: Store<GlobalVuexState>
}

export interface Data {}

export type Methods = {}

export interface Computed {
  announcement: Announcement
}

export interface Props {}
</script>
<style lang="scss" scoped>
@import '@/sass/variables.scss';

.Header {
  &__wrapper {
    width: auto;
  }

  ::v-deep &__content {
    z-index: map-get($z-index, 'header');
  }
}

.ie-info {
  @supports (display: grid) {
    display: none;
  }

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: $info-color;
  color: #fff;
  font-size: 0.875rem;
}
</style>
