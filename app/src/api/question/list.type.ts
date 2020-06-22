import { PaginationResponse, PageMeta } from '../type'
import { RelatedBlog, RelatedQuestion, QuestionData } from './question.type'

export interface QuestionListResponse {
  data: QuestionListData[]
  meta: QuestionListMeta
  page_meta: PageMeta
}

export interface QuestionSearchResponse {
  data: QuestionListData[]
  meta: QuestionListMeta
  page_meta: PageMeta
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
  q?: string
}

export type QuestionListSortType = 'latest'

export interface PopularBlog extends RelatedBlog {}

export interface PopularQuestion extends RelatedQuestion {}

export interface FetchQuestionListPayload {
  page: number
  sort: QuestionListSortType
}

export interface FetchSearchQuestionListPayload {
  page: number
  sort: QuestionListSortType
  q: string
}
