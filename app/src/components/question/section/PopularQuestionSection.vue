<template>
  <RelatedSection
    v-if="popularQuestions.length"
    :related-data="popularQuestions"
    :max-post="maxPost"
    title="人氣問答"
    @click-link="tracking"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import RelatedSection from '@/components/base/related/RelatedSection.vue'
import { QuestionListVuexState } from '@/views/question/list/CreateQuestionListPage'
import { useAnalytics, useStore } from '@/utils/composition-api'
import { EventTypes } from '@/analytics/event-listeners/event.type'

export default defineComponent({
  components: {
    RelatedSection,
  },
  props: {
    maxPost: {
      type: Number,
      default: 10,
    },
  },
  setup() {
    const store = useStore<QuestionListVuexState>()
    const analytics = useAnalytics()
    const popularQuestions = computed(
      () => store.state.questionList.popularQuestions || []
    )

    const tracking = (index: number) => {
      analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: '點擊討論區塊',
        action: popularQuestions.value[index].link.path,
        label: '討論區列表',
      })
    }

    return {
      popularQuestions,
      tracking,
    }
  },
})
</script>
