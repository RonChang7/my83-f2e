import { Link, SimpleResponse } from '../type'

export interface QuestionDataResponse {
  data: QuestionData
}

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

export interface AnswerData {
  answer_id: number
  content: string
  created_at: number
  author_info: AuthorInfo
  answer_meta: AnswerMeta
  responses: Response[]
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
  nickname: string
  avatar_url: string
  role: Role
  role_meta: RoleMeta | null
}

export type Role = 0 | 1 | 2

export interface RoleMeta {
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
  liked_count: number
  disliked_count: number
  response_count: number
}

export interface Response {
  response_id: number
  content: string
  author_info: AuthorInfo
  created_at: number
}

export interface QuestionPersonalize {
  is_owner: boolean
  is_reporter: boolean
  is_follower: boolean
}

export interface AnswerPersonalize {
  is_owner: boolean
  is_reporter: boolean
  like_status: -1 | 0 | 1
}
