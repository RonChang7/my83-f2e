<script lang="ts">
import { defineComponent, h } from '@nuxtjs/composition-api'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/insurance/leader-board'
import { FETCH_LEADER_BOARD } from '@/store/insurance/leader-board.type'
import { Content } from '@/services/page/Content'
import { ErrorPageType } from '@/config/error-page.config'
import { isAxiosError } from '@/api/helper'
const InsuranceLeaderBoard = () => import('./InsuranceLeaderBoard.vue')

export default defineComponent({
  scrollToTop: false,
  setup() {
    return () => h(InsuranceLeaderBoard)
  },
  async asyncData(ctx) {
    const { store, error, query } = ctx
    const fetchPageData: Promise<any>[] = [
      store.dispatch(`insuranceLeaderBoard/${FETCH_LEADER_BOARD}`, query.sort),
    ]

    try {
      await Promise.all([...Content.requests(ctx), ...fetchPageData])
    } catch (err) {
      if (!isAxiosError(err)) throw err

      const statusCode =
        err.response?.status === 404 ? err.response.status : 500
      const message =
        statusCode === 404 ? ErrorPageType.DEFAULT : ErrorPageType.SERVER

      error({ statusCode, message })
    }
  },
  watchQuery: ['sort'],
})

export interface InsuranceLeaderBoardVuexState extends GlobalVuexState {
  insuranceLeaderBoard: State
}
</script>
