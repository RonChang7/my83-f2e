<template>
  <TooltipCard class="ContractTypeCard" :info="contractTypeInfo" />
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
    const contractTypeInfo = [
      {
        title: '主約',
        content: '可以單獨購買的保險契約。',
      },
      {
        title: '附約',
        content: '不能單獨購買、需搭配著主約一起購買的保險契約。',
      },
    ]

    return {
      contractTypeInfo,
    }
  },
})
</script>
