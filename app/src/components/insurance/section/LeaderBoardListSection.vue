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
import { computed, defineComponent } from '@nuxtjs/composition-api'
import LeaderBoardCard from '../product/LeaderBoardCard.vue'
import { useStore } from '@/utils/composition-api'
import { InsuranceLeaderBoardVuexState } from '@/views/insurance/leader-board/Index.vue'

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
