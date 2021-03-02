<template>
  <div :class="{ rwd: enableRwd }" class="DesktopHeader">
    <GlobalLink to="/">
      <img
        :src="`${$imageBucketUrl}/front/common/my83-logo.svg`"
        alt="MY83"
        class="logo"
      />
    </GlobalLink>
    <nav>
      <DesktopHeaderNav :user-role="userRole" />
      <HeaderAnnouncement v-if="announcement" :announcement="announcement" />
      <HeaderPersonalize />
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import HeaderPersonalize from '../HeaderPersonalize.vue'
import HeaderAnnouncement from '../HeaderAnnouncement.vue'
import DesktopHeaderNav from './DesktopHeaderNav.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { UserRole } from '@/services/auth/auth'

export default defineComponent({
  components: {
    GlobalLink,
    DesktopHeaderNav,
    HeaderPersonalize,
    HeaderAnnouncement,
  },
  props: {
    enableRwd: {
      type: Boolean,
      default: false,
    },
    userRole: {
      type: String as () => UserRole,
      default: 'guest',
    },
    announcement: {
      type: Object,
      default: null,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.DesktopHeader {
  $header-resize-cut-point: 1360px;

  @include shadow('02');

  background: $default-bg;
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 30px;

  .logo {
    width: 148px;
    height: 34px;
    margin-right: 30px;

    @media (max-width: $header-resize-cut-point) {
      $base: ($header-resize-cut-point - map-get($grid-breakpoints, 'xl')) / 1px;

      margin-right: calc((((100vw - 1200px) / #{$base}) * 20) + 10px);
    }
  }

  nav {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  &.rwd {
    @include max-media('xl') {
      display: none;
    }
  }
}
</style>
