<template>
  <RelatedSection
    v-if="relatedBlogs.length"
    :related-data="relatedBlogs"
    :max-post="maxPost"
    title="相關文章"
    @click-link="tracking"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import RelatedSection from '@/components/base/related/RelatedSection.vue'
import { QuestionVuexState } from '@/views/question/page/Index.vue'
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
