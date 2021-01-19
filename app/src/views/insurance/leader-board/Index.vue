<script lang="ts">
import { defineComponent, h } from '@nuxtjs/composition-api'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/insurance/leader-board'
import { FETCH_LEADER_BOARD } from '@/store/insurance/leader-board.type'
import { Content } from '@/services/page/Content'
import { ErrorPageType } from '@/config/error-page.config'
const InsuranceLeaderBoard = () => import('./InsuranceLeaderBoard.vue')

export default defineComponent({
  watchQuery: ['sort'],
  scrollToTop: false,
  async asyncData(ctx) {
    const { store, error, query } = ctx
    const fetchPageData: Promise<any>[] = [
      store.dispatch(`insuranceLeaderBoard/${FETCH_LEADER_BOARD}`, query.sort),
    ]

    try {
      await Promise.all([...Content.requests(ctx), ...fetchPageData])
    } catch (err) {
      const statusCode = err.response.status === 404 ? err.response.status : 500
      const message =
        err.response.status === 404
          ? ErrorPageType.DEFAULT
          : ErrorPageType.SERVER

      error({ statusCode, message })
    }
  },
  setup() {
    return () => h(InsuranceLeaderBoard)
  },
})

export interface InsuranceLeaderBoardVuexState extends GlobalVuexState {
  insuranceLeaderBoard: State
}
</script>
