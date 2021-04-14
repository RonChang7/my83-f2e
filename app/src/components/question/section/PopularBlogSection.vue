<template>
  <LinkListSection
    v-if="popularBlogs.length"
    :list-data="popularBlogs"
    :max-post="maxPost"
    title="熱門文章"
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
    const popularBlogs = computed(
      () => store.state.questionList.popularBlogs || []
    )
    const tracking = (index: number) => {
      analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: '點擊文章區塊',
        action: popularBlogs.value[index].link.path,
        label: '討論區列表',
      })
    }

    return {
      popularBlogs,
      tracking,
    }
  },
})
</script>
