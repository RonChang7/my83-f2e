<template>
  <ProductPromotion
    v-slot="{ getFormattedFee, openModal }"
    @open-modal="$emit('open-modal')"
  >
    <div class="ProductFee">
      <div class="ProductFee__content" :style="{ height: `${cardHeight}px` }">
        <transition name="fade" mode="out-in">
          <div :key="fee" class="ProductFee__fee">
            {{ getFormattedFee(fee) }}
          </div>
        </transition>
        <div class="ProductFee__action">
          <BaseButton
            size="l-a"
            type="quaternary"
            to="/insured"
            @click.native="tracking"
          >
            免費諮詢
          </BaseButton>
          <div class="ProductFee__faq" @click="openModal">
            想獲得保險相關建議？
          </div>
        </div>
      </div>
    </div>
  </ProductPromotion>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { EventTypes } from '@/analytics/event-listeners/event.type'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import { useAnalytics } from '@/utils/composition-api'
import ProductPromotion from './ProductPromotion.vue'

export default defineComponent({
  components: {
    ProductPromotion,
    BaseButton,
  },
  props: {
    cardHeight: {
      type: Number,
      default: 0,
    },
    fee: {
      type: Number,
      default: null,
    },
    insuranceType: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const analytics = useAnalytics()
    const tracking = () => {
      analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: '商品頁CTA',
        action: 'click',
        label: props.insuranceType,
      })
    }

    return {
      tracking,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductFee {
  color: #fff;

  &__content {
    background: url('#{$image-bucket-url}/front/insurance/product/bg-product-fee-desktop.png')
      no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 405px;
    padding: 20px 0 20px 50px;

    @include max-media('xl') {
      width: 100vw;
      background: url('#{$image-bucket-url}/front/insurance/product/bg-product-fee-mobile.png')
        no-repeat;
      background-size: 100% 100%;
      max-width: 412px;
      padding: 0;
      padding-top: 15px;
    }

    @include max-media('md') {
      width: 90vw;
    }
  }

  &__fee {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 8px;

    &:before {
      content: '保費';
      display: inline-block;
      font-size: 1.125rem;
      font-weight: 500;
      margin-right: 8px;
    }

    @include max-media('xl') {
      font-size: 1.5rem;

      &:before {
        font-size: 1rem;
      }
    }
  }

  &__action {
    text-align: center;
  }

  &__faq {
    margin-top: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;

    @include hover('_white');
  }

  .fade {
    @include vue-transition-fade($second: 0.2);
  }
}
</style>
