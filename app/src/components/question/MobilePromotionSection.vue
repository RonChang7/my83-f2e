<template>
  <div v-if="promotion" ref="promotion" class="MobilePromotionSection">
    <div class="MobilePromotionSection__header">
      保險商品推薦
    </div>
    <div class="MobilePromotionSection__wrapper">
      <GlobalLink
        class="MobilePromotionSection__content"
        :class="{ fixed: shouldFixBanner }"
        :to="promotion.link.path"
      >
        <div v-if="promotion.image" class="MobilePromotionSection__icon">
          <BaseLazyImage :image-url="promotion.image" />
        </div>
        <div class="MobilePromotionSection__title">
          {{ promotion.title }}
        </div>
        <div class="MobilePromotionSection__button">
          <BaseButton size="l-a" :is-full-width="true">
            {{ promotion.action_text }}
          </BaseButton>
        </div>
      </GlobalLink>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseLazyImage from '@/components/base/lazy-load-image/BaseLazyImage.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { State } from '@/store/question/index'
import { Promotion } from '@/api/question/question.type'

export default {
  components: {
    BaseLazyImage,
    BaseButton,
    GlobalLink,
  },
  data() {
    return {
      promotionObserver: null,
      shouldFixBanner: false,
    }
  },
  computed: {
    promotion() {
      const { question } = this.$store.state.question as State
      return question ? question.promotion : null
    },
  },
  mounted() {
    if (!this.promotion) return

    this.promotionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.shouldFixBanner = entry.boundingClientRect.bottom <= 0
      })
    })

    this.promotionObserver.observe(this.$refs.promotion as Element)
  },
  destroyed() {
    if (this.promotionObserver) {
      ;(this.promotionObserver as IntersectionObserver).disconnect()
      this.promotionObserver = null
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
  promotionObserver: IntersectionObserver | null
  shouldFixBanner: boolean
}

export interface Methods {}

export interface Computed {}

export interface Props {
  promotion: Promotion | null
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.MobilePromotionSection {
  @include card-secondary;

  margin-bottom: 10px;

  &__header {
    display: flex;
    align-items: center;
    color: $gray-secondary;
    font-size: 0.875rem;
    height: 36px;
    border-bottom: 1px solid $gray-quaternary;
    padding: 0 20px;
  }

  &__wrapper {
    height: 74px;
  }

  &__content {
    display: flex;
    align-items: center;
    padding: 17px 20px;

    &.fixed {
      position: fixed;
      bottom: 0;
      background: #fff;
      width: 100vw;
      box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.15);
      z-index: 1;
    }
  }

  &__icon {
    width: 36px;
    height: 36px;
    margin-right: 8px;
    flex: 0 0 auto;
  }

  &__title {
    color: $gray-primary;
    font-size: 1.125rem;
    font-weight: 500;
    flex: 1 1 auto;
    margin-right: 8px;
  }

  &__button {
    width: 76px;
    flex: 0 0 auto;
  }
}
</style>
