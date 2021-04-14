<template>
  <LinkListSection
    v-if="relatedBlogs.length"
    :list-data="relatedBlogs"
    :max-post="maxPost"
    title="相關文章"
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
    const relatedBlogs = computed(() => store.state.question.relatedBlogs || [])
    const tracking = (index: number) => {
      analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: '點擊文章區塊',
        action: relatedBlogs.value[index].link.path,
        label: '討論區單則',
      })
    }

    return {
      relatedBlogs,
      tracking,
    }
  },
})
</script>
