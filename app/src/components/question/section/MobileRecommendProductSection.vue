<template>
  <div
    v-if="recommendProduct"
    ref="recommendProduct"
    class="MobileRecommendProductSection"
  >
    <div class="MobileRecommendProductSection__header">
      {{ recommendProduct.header }}
    </div>
    <div class="MobileRecommendProductSection__wrapper">
      <GlobalLink
        class="MobileRecommendProductSection__content"
        :class="{ fixed: shouldFixBanner }"
        :to="recommendProduct.link.path"
      >
        <div
          v-if="recommendProduct.image_url"
          class="MobileRecommendProductSection__icon"
        >
          <BaseLazyImage :image-url="recommendProduct.image_url" />
        </div>
        <div class="MobileRecommendProductSection__title">
          {{ recommendProduct.title }}
          <span
            v-if="promotionConsultationCount"
            class="MobileRecommendProductSection__count"
          >
            {{ promotionConsultationCount }}
          </span>
        </div>
        <div class="MobileRecommendProductSection__button">
          <BaseButton size="l-a" :is-full-width="true">
            {{ recommendProduct.action_text }}
          </BaseButton>
        </div>
      </GlobalLink>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseLazyImage from '@/components/base/lazy-load-image/BaseLazyImage.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { QuestionVuexState } from '@/views/question/page/Index.vue'
import { RecommendProductTransform } from '@/api/question/question.type'

export default {
  components: {
    BaseLazyImage,
    BaseButton,
    GlobalLink,
  },
  data() {
    return {
      recommendProductObserver: null,
      shouldFixBanner: false,
    }
  },
  computed: {
    recommendProduct() {
      return this.$store.state.question.recommendProduct
    },
    promotionConsultationCount() {
      if (
        !this.recommendProduct ||
        !this.recommendProduct.consultations_count ||
        this.recommendProduct.consultations_count <= 50
      ) {
        return ''
      }
      return `已經有 ${this.recommendProduct.consultations_count} 人購買`
    },
  },
  mounted() {
    if (!this.recommendProduct) return

    this.recommendProductObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.shouldFixBanner = entry.boundingClientRect.bottom < 0
      })
    })

    this.recommendProductObserver.observe(this.$refs.recommendProduct)
  },
  beforeDestroy() {
    if (this.recommendProductObserver) {
      this.recommendProductObserver.disconnect()
      this.recommendProductObserver = null
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

export interface Instance extends Vue {
  $store: Store<QuestionVuexState>
  $refs: {
    recommendProduct: Element
  }
}

export interface Data {
  recommendProductObserver: IntersectionObserver | null
  shouldFixBanner: boolean
}

export type Methods = {}

export interface Computed {
  recommendProduct: RecommendProductTransform | null
  promotionConsultationCount: string
}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.MobileRecommendProductSection {
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

    @include max-media('xs') {
      font-size: 1rem;
    }
  }

  &__count {
    display: block;
    font-size: 0.75rem;
    color: $gray-secondary;
  }

  &__button {
    width: 76px;
    flex: 0 0 auto;
  }
}
</style>
