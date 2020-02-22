<template>
  <GlobalLink class="HotServiceCard" :to="item.url">
    <img
      class="HotServiceCard__image"
      :src="require(`@/assets/images/question/${item.src}`)"
      :srcset="require(`@/assets/images/question/${item.srcset}`)"
      alt="icon"
    />
    <div class="HotServiceCard__title">
      {{ item.title }}
    </div>
    <template v-if="$ua.isFromPc()">
      <div class="HotServiceCard__content">
        {{ item.content }}
      </div>
      <BaseButton size="l-a" :is-full-width="true">
        {{ item.buttonText }}
      </BaseButton>
    </template>
  </GlobalLink>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { HotServiceContent } from './hot-service-content'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'

export default {
  components: {
    BaseButton,
    GlobalLink,
  },
  props: {
    item: {
      type: Object,
      required: true,
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

export interface Methods {}

export interface Computed {}

export interface Props {
  item: HotServiceContent
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.HotServiceCard {
  @include min-media('xl') {
    @include card-primary;

    padding: 36px 28px;
  }

  display: flex;
  flex-direction: column;
  align-items: center;
  color: $gray-primary;
  padding-top: 12px;

  &__image {
    width: 130px;
    height: 130px;

    @include max-media('xl') {
      width: 58px;
      height: 58px;
    }
  }

  &__title {
    font-size: 1.375rem;
    font-weight: 500;
    margin-top: 16px;

    @include max-media('xl') {
      width: 48px;
      font-size: 0.75rem;
      font-weight: 400;
      margin-top: 8px;
      text-align: center;
    }
  }

  &__content {
    margin: 12px 0 28px;
    text-align: center;
    line-height: 1.5;
  }
}
</style>
