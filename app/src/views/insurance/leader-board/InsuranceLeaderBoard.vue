<template>
  <div class="InsuranceLeaderBoard">
    <LeaderBoardHeaderSection ref="header" />

    <div class="InsuranceLeaderBoard__row">
      <LeaderBoardListSection />
    </div>

    <transition name="fade">
      <LeaderBoardPromotionSection v-if="shouldShowPromotionSection" />
    </transition>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
} from '@nuxtjs/composition-api'
import LeaderBoardHeaderSection from '@/components/insurance/section/LeaderBoardHeaderSection.vue'
import LeaderBoardListSection from '@/components/insurance/section/LeaderBoardListSection.vue'
import LeaderBoardPromotionSection from '@/components/insurance/section/LeaderBoardPromotionSection.vue'
import { useDevice } from '@/mixins/device/device-mixins'

export default defineComponent({
  components: {
    LeaderBoardHeaderSection,
    LeaderBoardListSection,
    LeaderBoardPromotionSection,
  },
  setup(_, ctx) {
    const { isMobile } = useDevice()
    const header = computed(() => ctx.refs.header as Vue)

    const shouldShowPromotionSection = ref(!isMobile.value)
    let promotionSectionObserver: IntersectionObserver | null

    onMounted(() => {
      if (!isMobile.value) return

      promotionSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          shouldShowPromotionSection.value = entry.boundingClientRect.bottom < 0
        })
      })

      promotionSectionObserver &&
        promotionSectionObserver.observe(header.value.$el)
    })

    onBeforeUnmount(() => {
      promotionSectionObserver && promotionSectionObserver.disconnect()
      promotionSectionObserver = null
    })

    return {
      shouldShowPromotionSection,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.InsuranceLeaderBoard {
  display: flex;
  flex-direction: column;
  padding-top: 40px;
  background: url('#{$image-bucket-url}/front/insurance/leader-board/bg-cloud-desktop.png')
    center top no-repeat;
  background-color: $primary-bg;

  @include max-media('sm') {
    padding-top: 20px;
    background: url('#{$image-bucket-url}/front/insurance/leader-board/bg-cloud-mobile.png')
      center top no-repeat;
    background-color: $primary-bg;
  }

  @include max-media('xl') {
    padding-bottom: 60px;
  }

  &__row {
    margin: 64px auto 0;
    width: 1140px;

    @include max-media('xl') {
      margin: 20px auto 0;
      width: 100%;
    }
  }

  .fade {
    @include vue-transition-fade($second: 0.2, $reverse: true);
  }
}
</style>
