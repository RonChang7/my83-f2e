import { RelatedBlog, RelatedQuestion } from './question.type'

export interface PopularBlogsResponse {
  data: PopularBlog[]
}

export interface PopularQuestionsResponse {
  data: PopularQuestion[]
}

export interface PopularBlog extends RelatedBlog {}

export interface PopularQuestion extends RelatedQuestion {}
