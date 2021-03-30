<template>
  <div class="LeaderBoardListSection">
    <LeaderBoardCard
      v-for="section in sections"
      :key="section.id"
      :section="section"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import { InsuranceLeaderBoardVuexState } from '@/views/insurance/leader-board/Index.vue'
import LeaderBoardCard from '../product/LeaderBoardCard.vue'

export default defineComponent({
  components: {
    LeaderBoardCard,
  },
  setup() {
    const store = useStore<InsuranceLeaderBoardVuexState>()
    const sections = computed(() => store.state.insuranceLeaderBoard.sections)

    return {
      sections,
    }
  },
})
</script>

<style lang="scss" scoped>
.LeaderBoardListSection {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
