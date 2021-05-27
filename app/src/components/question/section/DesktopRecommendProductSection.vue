<template>
  <DesktopRecommendProductCard :recommend-product="recommendProduct" />
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import DesktopRecommendProductCard from '@/components/my83-ui-kit/card/RecommendProductCard/DesktopRecommendProductCard.vue'
import { QuestionVuexState } from '@/views/question/page/Index.vue'

export default defineComponent({
  components: {
    DesktopRecommendProductCard,
  },
  setup() {
    const store = useStore<QuestionVuexState>()
    const recommendProduct = computed(
      () => store.state.question.recommendProduct
    )

    return {
      recommendProduct,
    }
  },
})
</script>
