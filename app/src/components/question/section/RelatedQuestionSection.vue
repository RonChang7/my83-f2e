<template>
  <LinkListSection
    v-if="relatedQuestions.length"
    :list-data="relatedQuestions"
    :max-post="maxPost"
    title="相關問答"
    @click-link="tracking"
  />
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import LinkListSection from '@/components/my83-ui-kit/list/link/LinkListSection.vue'
import { QuestionVuexState } from '@/views/question/page/Index.vue'
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
    const store = useStore<QuestionVuexState>()
    const analytics = useAnalytics()
    const relatedQuestions = computed(
      () => store.state.question.relatedQuestions || []
    )
    const tracking = (index: number) => {
      analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: '點擊討論區塊',
        action: relatedQuestions.value[index].link.path,
        label: '討論區單則',
      })
    }

    return {
      relatedQuestions,
      tracking,
    }
  },
})
</script>
