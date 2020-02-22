<template>
  <div class="HotServiceSection">
    <div class="HotServiceSection__header">
      <span>MY83 熱門服務</span>
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
    width: calc(25% - 14px);

    &:not(:last-child) {
      margin-right: 14px;
    }
  }

  @include max-media('xl') {
    @include card-secondary;

    width: 100%;
    padding: 12px 26px;

    &__header {
      display: block;
      text-align: center;

      span:before,
      span:after {
        content: '';
        border-bottom: 2px dashed $primary-color;
        width: 15px;
        display: inline-block;
        position: relative;
        top: -6px;
      }

      span:before {
        left: -10px;
      }

      span:after {
        right: -10px;
      }
    }

    &__title,
    &__content {
      display: none;
    }

    &__card {
      width: calc(25% - 23px);

      &:not(:last-child) {
        margin-right: 30px;
      }
    }
  }
}
</style>
