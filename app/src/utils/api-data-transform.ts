import { Pagination, PaginationResponse } from '@/api/type'

export const paginationResponseDataTransform = ({
  current_page,
  total_page,
  total_count,
}: PaginationResponse): Pagination => {
  return {
    currentPage: current_page,
    totalCount: total_count,
    totalPage: total_page,
  }
}
