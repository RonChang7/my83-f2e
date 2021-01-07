import { LeaderBoardResponse, SortType } from './leader-board.type'
import request from '@/api/request'
import { decorateSeoQueryString } from '@/api/decorate-seo-to-api'

export const fetchLeaderBoard = async (
  sort?: SortType
): Promise<LeaderBoardResponse> => {
  const { data } = await request.get(
    decorateSeoQueryString(`/api/insurance/leaderboard`),
    {
      params: {
        sort,
      },
    }
  )

  return data
}
