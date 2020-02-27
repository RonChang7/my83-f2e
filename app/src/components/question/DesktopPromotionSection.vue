<template>
  <BaseCard v-if="promotion" class="DesktopPromotionSection">
    <template v-slot:title>{{ promotion.header }}</template>
    <GlobalLink :to="promotion.link.path">
      <div class="DesktopPromotionSection__content">
        <div v-if="promotion.image" class="DesktopPromotionSection__icon">
          <BaseLazyImage :image-url="promotion.image" />
        </div>
        {{ promotion.title }}
      </div>
      <BaseButton size="l-a" :is-full-width="true">
        {{ promotion.action_text }}
      </BaseButton>
    </GlobalLink>
  </BaseCard>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import BaseLazyImage from '@/components/base/lazy-load-image/BaseLazyImage.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { State } from '@/store/question/index'
import { Promotion } from '@/api/question/question.type'

export default {
  components: {
    BaseCard,
    BaseLazyImage,
    BaseButton,
    GlobalLink,
  },
  computed: {
    promotion() {
      const { question } = this.$store.state.question as State
      return question ? question.promotion : null
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
  promotion: Promotion | null
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.DesktopPromotionSection {
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
