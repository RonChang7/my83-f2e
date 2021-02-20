<template>
  <RelatedSection
    v-if="popularBlogs.length"
    :related-data="popularBlogs"
    :max-post="maxPost"
    title="熱門文章"
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
