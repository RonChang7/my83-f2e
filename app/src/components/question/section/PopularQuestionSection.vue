<template>
  <LinkListSection
    v-if="popularQuestions.length"
    :list-data="popularQuestions"
    :max-post="maxPost"
    title="人氣問答"
    @click-link="tracking"
  />
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import LinkListSection from '@/components/my83-ui-kit/list/link/LinkListSection.vue'
import { QuestionListVuexState } from '@/views/question/list/CreateQuestionListPage'
import { useAnalytics } from '@/utils/composition-api'
import { EventTypes } from '@/analytics/event-listeners/event.type'

export default defineComponent({
  components: {
    LinkListSection,
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
