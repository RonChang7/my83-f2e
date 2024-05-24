<template functional>
  <div class="LoginInfo">
    <div class="logo">
      <img
        class="logo"
        :src="`${parent.$imageBucketUrl}/front/common/my83-logo.svg`"
        alt="my83 logo"
      />
    </div>
    <div class="wording">透明自由的保險討論平台</div>
    <img
      class="introduction"
      :src="`${parent.$imageBucketUrl}/front/login/img-brand-feature.png`"
      :srcset="`${parent.$imageBucketUrl}/front/login/img-brand-feature@2x.png 2x`"
      alt="my83 introduction"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { FunctionalComponentOptions } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

export default {
  functional: true,
} as ComponentOption

export type ComponentOption = FunctionalComponentOptions<Props>

export type ComponentInstance = CombinedVueInstance<Instance, {}, {}, {}, Props>

export interface Instance extends Vue {}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.LoginInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  color: $gray-primary;

  .logo,
  .wording {
    width: 260px;
  }

  .logo {
    @include max-media('lg') {
      width: auto;
      height: 44px;
    }
  }

  .wording {
    margin: 5px 0 30px;
    letter-spacing: 7px;

    @include max-media('lg') {
      width: 190px;
      font-size: 0.875em;
      letter-spacing: 3px;
      margin-bottom: 0;
    }
  }

  .introduction {
    width: 340px;

    @include max-media('lg') {
      display: none;
    }
  }
}
</style>
