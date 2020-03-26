<template>
  <div class="HotServiceSection">
    <div class="HotServiceSection__header">
      <div class="decoration left"></div>
      <span>MY83 熱門服務</span>
      <div class="decoration right"></div>
    </div>
    <div class="HotServiceSection__title">
      幫你解決保險問題的好幫手
    </div>
    <div class="HotServiceSection__content">
      MY83 除了豐富專業的保險知識，還有這些功能幫你解決保險問題喔！
    </div>
    <div class="HotServiceSection__cards">
      <HotServiceCard
        v-for="(item, index) in cards"
        :key="index"
        :item="item"
        class="HotServiceSection__card"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import HotServiceCard from './hot-service/HotServiceCard.vue'
import hotServiceContent, {
  HotServiceContent,
} from './hot-service/hot-service-content'

export default {
  components: {
    HotServiceCard,
  },
  data() {
    return {
      cards: hotServiceContent,
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

export interface Instance extends Vue {}

export interface Data {
  card: HotServiceContent[]
}

export interface Methods {}

export interface Computed {}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.HotServiceSection {
  width: 1120px;
  padding-top: 80px;
  color: $gray-primary;

  &__header {
    display: none;
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 500;
    margin-bottom: 10px;
  }

  &__content {
    font-size: 1.125rem;
    margin-bottom: 35px;
  }

  &__cards {
    display: flex;
  }

  &__card {
    flex: 0 0 auto;
    width: calc(25% - 15px);

    &:not(:last-child) {
      margin-right: 20px;
    }
  }

  @include max-media('xl') {
    @include card-secondary;

    width: 100%;
    padding: 12px 26px;

    &__header {
      display: flex;
      justify-content: center;
      align-items: center;

      .decoration {
        height: 2px;
        width: 14px;
        border-radius: 1px;
        border: 1px solid $primary-color;

        &.left:before,
        &.right:after {
          content: '';
          display: block;
          height: 2px;
          width: 4px;
          border-radius: 1px;
          border: 1px solid $primary-color;
          position: relative;
          top: -1px;
        }

        &.left:before {
          left: -10px;
        }

        &.right:after {
          right: -18px;
        }
      }

      > span {
        margin: 0 10px;
      }
    }

    &__title,
    &__content {
      display: none;
    }

    &__card {
      width: calc(25% - 22.5px);

      &:not(:last-child) {
        margin-right: 30px;
      }
    }
  }
}
</style>
