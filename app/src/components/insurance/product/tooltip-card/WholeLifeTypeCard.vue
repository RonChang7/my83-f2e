<template>
  <TooltipCard class="WholeLifeTypeCard" :info="wholeLifeTypeInfo" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import TooltipCard from './TooltipCard.vue'

export default defineComponent({
  components: {
    TooltipCard,
  },
  setup() {
    // 不需要響應的資料，不使用 ref, reactive warp
    const wholeLifeTypeInfo = [
      {
        title: '終身險',
        content: '保障終身。通常繳費 20 年後即可不須再繳保費。',
      },
      {
        title: '定期險',
        content:
          '保障一定年期，如：10 年定期壽險，即保障 10 年，到期後契約終止。',
      },
    ]

    return {
      wholeLifeTypeInfo,
    }
  },
})
</script>
