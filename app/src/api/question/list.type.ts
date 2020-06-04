import { PaginationResponse } from '../type'
import { RelatedBlog, RelatedQuestion, QuestionData } from './question.type'

export interface QuestionListResponse {
  data: QuestionListData[]
  meta: QuestionListMeta
}

export interface PopularBlogsResponse {
  data: PopularBlog[]
}

export interface PopularQuestionsResponse {
  data: PopularQuestion[]
}

export type QuestionListData = Omit<
  QuestionData,
  'personalize' | 'best_answer_id'
>

export interface QuestionListMeta {
  pagination: PaginationResponse
  sort: QuestionListSortType
}

export type QuestionListSortType = 'latest'

export interface PopularBlog extends RelatedBlog {}

export interface PopularQuestion extends RelatedQuestion {}

export interface FetchQuestionListPayload {
  page: number
  sort: QuestionListSortType
}
