<template>
  <div class="ProductPromotionSalesSection">
    <div class="ProductPromotionSalesSection__title">
      想買保險，
      <br />
      但不知道怎麼選？
    </div>
    <div class="ProductPromotionSalesSection__content">
      <div class="ProductPromotionSalesSection__description">
        直接到 MY83
        保險達人榜，免費詢問站上活躍的業務員，讓專業、好評、回覆迅速的業務員來幫你！
      </div>
      <div class="ProductPromotionSalesSection__activeSalesCount">
        {{ activeSalesCountWording }}
      </div>
      <BaseButton
        to="/searchSales"
        size="l-a"
        type="quaternary"
        :is-full-width="false"
        @click.native="tracking"
      >
        找業務員
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import { useAnalytics } from '@/utils/composition-api'
import { GlobalVuexState } from '@/store/global-state'
import { EventTypes } from '@/analytics/event-listeners/event.type'

export default defineComponent({
  components: {
    BaseButton,
  },
  props: {
    pageType: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const store = useStore<GlobalVuexState>()
    const analytics = useAnalytics()
    const activeSalesCount = computed(() => store.state.meta.activeSalesCount)

    const activeSalesCountWording = computed(() => {
      return activeSalesCount.value
        ? `\\ 諮詢 ${activeSalesCount.value} 位活躍業務員 /`
        : ''
    })

    const tracking = () => {
      analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: '業務員廣告版位CTA',
        action: 'click',
        label: props.pageType,
      })
    }

    return {
      activeSalesCountWording,
      tracking,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductPromotionSalesSection {
  @include card-primary;

  display: flex;
  flex-direction: column;
  background: url('#{$image-bucket-url}/front/insurance/bg-ad-sales-desktop-2@2x.png')
    top center/contain no-repeat;
  background-color: #ffccb1;
  padding: 20px;
  border: 0;

  &__title {
    color: #fff;
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 120px;
    text-align: center;
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__description {
    color: $gray-primary;
    font-size: 0.875rem;
    margin-bottom: 12px;
  }

  &__activeSalesCount {
    height: 24px;
    margin: 0 0 6px;
    color: $gray-primary;
    font-size: 0.875rem;
    text-align: center;
  }
}
</style>
