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
      v-else-if="shouldShowCountdown"
      class="HeaderSalesDetail__vipCountdown"
      to="/pricing"
    >
      限時優惠 VIP 只剩 {{ countdownDisplay.day }} 日
      <br class="wrap" />
      <div class="digital">{{ countdownDisplay.hour }}</div>
      :
      <div class="digital">{{ countdownDisplay.min }}</div>
      :
      <div class="digital">{{ countdownDisplay.sec }}</div>
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
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { SalesInfo } from '@/api/header/header.type'
import { padLeft } from '@/utils/digital'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'

export default {
  components: {
    GlobalLink,
  },
  data() {
    return {
      countdown: 0,
      countdownDisplay: {
        day: '0',
        hour: '0',
        min: '0',
        sec: '0',
      },
    }
  },
  props: {
    salesInfo: {
      type: Object,
      required: true,
    },
  },
  methods: {
    setCountdown() {
      this.countdownTransformer(this.countdown)

      const timer = window.setInterval(() => {
        this.countdown -= 1
        this.countdownTransformer(this.countdown)

        if (this.countdown <= 0) {
          window.clearInterval(timer)
        }
      }, 1000)
    },
    countdownTransformer(sec) {
      const day = Math.floor(sec / (3600 * 24))
      sec -= day * (3600 * 24)
      const hour = Math.floor(sec / 3600)
      sec -= hour * 3600
      const min = Math.floor(sec / 60)
      sec -= min * 60
      sec = Math.floor(sec % 60)
      this.countdownDisplay.day = padLeft(day, 2)
      this.countdownDisplay.hour = padLeft(hour, 2)
      this.countdownDisplay.min = padLeft(min, 2)
      this.countdownDisplay.sec = padLeft(sec, 2)
    },
  },
  computed: {
    shouldShowCountdown() {
      return this.salesInfo.vip_countdown * 1000 >= Date.now()
    },
  },
  mounted() {
    if (this.salesInfo.is_verify && this.shouldShowCountdown) {
      this.countdown =
        this.salesInfo.vip_countdown - Math.round(Date.now() / 1000)

      this.setCountdown()
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
  countdown: number
  countdownDisplay: {
    day: string
    hour: string
    min: string
    sec: string
  }
}

export type Methods = {
  setCountdown(): void
  countdownTransformer(sec: number): void
}

export interface Computed {
  shouldShowCountdown: boolean
}

export interface Props {
  salesInfo: SalesInfo
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.HeaderSalesDetail {
  text-align: center;

  &__notVerify,
  &__vipCountdown {
    color: $primary-color;

    &:hover {
      color: $primary-hover-color;
    }
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
    color: $gray-primary;

    > span {
      color: $primary-color;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 4px;
    }

    &:hover {
      color: $primary-hover-color;
    }
  }

  .digital {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    border: 1px solid $primary-light-color;
    width: 24px;
    height: 24px;
    margin: 0 4px;
  }
}
</style>
