<template>
  <BaseCard v-if="recommendProduct" class="DesktopRecommendProductSection">
    <template v-slot:title>{{ recommendProduct.header }}</template>
    <GlobalLink :to="recommendProduct.link.path">
      <div class="DesktopRecommendProductSection__content">
        <div
          v-if="recommendProduct.image"
          class="DesktopRecommendProductSection__icon"
        >
          <BaseLazyImage :image-url="recommendProduct.image" />
        </div>
        {{ recommendProduct.title }}
      </div>
      <BaseButton size="l-a" :is-full-width="true">
        {{ recommendProduct.action_text }}
      </BaseButton>
    </GlobalLink>
  </BaseCard>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import BaseLazyImage from '@/components/base/lazy-load-image/BaseLazyImage.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { QuestionVuexState } from '@/views/question/page/Index.vue'
import { RecommendProduct } from '@/api/question/question.type'

export default {
  components: {
    BaseCard,
    BaseLazyImage,
    BaseButton,
    GlobalLink,
  },
  computed: {
    recommendProduct() {
      return this.$store.state.question.recommendProduct
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

export interface Instance extends Vue {
  $store: Store<QuestionVuexState>
}

export interface Data {}

export interface Methods {}

export interface Computed {
  recommendProduct: RecommendProduct | null
}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.DesktopRecommendProductSection {
  margin-bottom: 20px;
  padding-bottom: 16px;

  &__content {
    display: flex;
    align-items: center;
    color: $gray-primary;
    font-size: 1.375rem;
    padding: 16px 0 18px;
  }

  &__icon {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
}
</style>
