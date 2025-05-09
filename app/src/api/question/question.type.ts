import {
  Link,
  SimpleResponse,
  Role,
  RelatedBlog,
  RelatedQuestion,
  LinkButton,
  PageResponse,
} from '../type'

export type QuestionDataResponse = PageResponse<QuestionData>

export interface AnswerDataResponse {
  data: AnswerData[]
}

export interface QuestionPersonalizeResponse {
  personalize: QuestionPersonalize
}

export interface AnswerPersonalizeResponse {
  answer_id: number
  personalize: AnswerPersonalize
}

export interface FollowQuestionResponse extends SimpleResponse {}

export interface UnFollowQuestionResponse extends SimpleResponse {}

export interface SetBestAnswerResponse extends SimpleResponse {}

export interface UnsetBestAnswerResponse extends SimpleResponse {}

export interface AddAnswerPayload {
  questionId: number
  nickname?: string
  content: string
}

export interface AddResponsePayload extends AddAnswerPayload {
  answerId: number
  isDislikeResponse: boolean
}

export interface AddAnswerResponse extends SimpleResponse {
  data?: AnswerData
}

export interface AddResponseResponse extends SimpleResponse {
  data?: ResponseData
}

export interface UpdateLikeStatuePayload {
  questionId: number
  answerId: number
  likeStatus: LikeStatus
}

export interface UpdateLikeStatueResponse extends SimpleResponse {
  answer_meta?: AnswerMeta
  like_status?: LikeStatus
  personalize?: {
    response_ids: number[]
  }
}

export interface RelatedBlogsResponse {
  data: RelatedBlog[]
}

export interface RelatedQuestionsResponse {
  data: RelatedQuestion[]
}

export interface RecommendProductResponse {
  recommend_product: RecommendProduct | null
  consultations_count?: number
}

export interface addReportPayload {
  questionId: number
  answerId?: number
  comment: string
}

export interface cancelReportPayload {
  questionId: number
  answerId?: number
}

export interface AnswerData {
  answer_id: number
  content: string
  created_at: number
  author_info: AuthorInfo
  answer_meta: AnswerMeta
  responses: ResponseData[]
  personalize?: AnswerPersonalize
}

export interface QuestionData {
  question_id: number
  subject: string
  content: string
  images: string[]
  created_at: number
  author_info: AuthorInfo
  tags: Tag[]
  target_tag: Tag
  question_meta: QuestionMeta
  companies: Company[]
  personalize?: QuestionPersonalize
  best_answer_id: number | null
}

export interface AuthorInfo {
  id: number | null
  username: string
  nickname: string
  avatar_url: string
  role: Role
  role_meta: RoleMeta | null
}

export interface RoleMeta {
  is_verified: boolean
  level: number
  location: string
  reply_status: string
}

export interface Tag {
  id: number
  name: string
  link: Link
}

export interface QuestionMeta {
  answer_count: number
}

export interface Company {
  id: number
  name: string
  link: Link
}

export interface AnswerMeta {
  like_count: number
  dislike_count: number
  response_count: number
}

export interface ResponseData {
  response_id: number
  content: string
  author_info: AuthorInfo
  created_at: number
  is_dislike: boolean
}

export interface QuestionPersonalize {
  is_owner: boolean
  is_reporter: boolean
  is_follower: boolean
}

export const enum LikeStatus {
  LIKE = 1,
  NONE = 0,
  DISLIKE = -1,
}

export interface AnswerPersonalize {
  is_owner: boolean
  is_reporter: boolean
  like_status: LikeStatus
}

export interface RecommendProduct {
  header: string
  title: string
  description: string
  image_url: string
  btn: LinkButton
}
