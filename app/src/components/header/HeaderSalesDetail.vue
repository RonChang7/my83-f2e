<template>
  <div class="HeaderSalesDetail">
    <GlobalLink
      v-if="!salesInfo.is_verify"
      class="HeaderSalesDetail__notVerify"
      to="/salesCenter/certification"
    >
      尚未通過職業認證
    </GlobalLink>

    <GlobalLink
      v-else-if="countdownConfig"
      class="HeaderSalesDetail__vipCountdown"
      to="/pricing"
    >
      {{ countdownConfig.text }} 只剩 {{ countdown.day }} 日
      <br class="wrap" />
      <div class="digital">{{ countdown.hour }}</div>
      <div class="delimiter">:</div>
      <div class="digital">{{ countdown.min }}</div>
      <div class="delimiter">:</div>
      <div class="digital">{{ countdown.sec }}</div>
    </GlobalLink>

    <GlobalLink
      v-else
      class="HeaderSalesDetail__reward"
      to="/salesCenter/reward"
    >
      紅利
      <span>{{ salesInfo.reward_point }}</span>
      點
    </GlobalLink>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { SalesInfo } from '@/api/header/header.type'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { useCountdownTimer } from '@/utils/composition-api/countdown'

export default defineComponent({
  components: {
    GlobalLink,
  },
  props: {
    salesInfo: {
      type: Object as () => SalesInfo,
      required: true,
    },
  },
  setup(props) {
    const vipDiscountCountdown = computed(
      () => props.salesInfo.vip_discount_countdown || 0
    )
    const pointDiscountCountdown = computed(
      () => props.salesInfo.point_discount_countdown || 0
    )
    const countdownConfig = computed(() => {
      return vipDiscountCountdown.value * 1000 >= Date.now()
        ? {
            text: '限時優惠 VIP',
            discountCountdown: vipDiscountCountdown.value,
          }
        : pointDiscountCountdown.value * 1000 >= Date.now()
        ? {
            text: '限時優惠 5000 點',
            discountCountdown: pointDiscountCountdown.value,
          }
        : null
    })

    const countdown = useCountdownTimer(
      countdownConfig.value?.discountCountdown
    )

    return {
      countdownConfig,
      countdown,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.HeaderSalesDetail {
  text-align: center;

  &__notVerify,
  &__vipCountdown {
    @include hover('_primary');
  }

  &__vipCountdown {
    font-size: 0.875rem;

    @include max-media('xl') {
      .wrap {
        display: none;
      }
    }
  }

  &__reward {
    font-weight: 400;

    > span {
      color: $primary-color;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 4px;
    }

    @include hover('_gray-primary');
  }

  .digital {
    @include countdown-timer-digital;
  }

  .delimiter {
    @include countdown-timer-delimiter;
  }
}
</style>
