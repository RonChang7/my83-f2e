import {
  PaginationResponse,
  Link,
  RelatedBlog,
  RelatedQuestion,
  PageResponse,
} from '../type'
import { QuestionData } from './question.type'

export interface QuestionListResponse extends PageResponse<QuestionListData[]> {
  meta: QuestionListMeta
}

export interface QuestionSearchResponse
  extends PageResponse<QuestionListData[]> {
  meta: QuestionListMeta
}

export interface PopularBlogsResponse {
  data: PopularBlog[]
}

export interface PopularQuestionsResponse {
  data: PopularQuestion[]
}

export interface PromotionsResponse {
  data: {
    header: string
    promotions: Promotion[]
  }
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

export interface Promotion {
  title: string
  image_url: string
  consultations_count: number
  link: Link
}
