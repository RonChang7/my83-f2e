import { Link } from '../type'

export interface QuestionDataResponse {
  data: QuestionData
}

export interface AnswerDataResponse {
  data: AnswerData[]
}

export interface AnswerData {
  answer_id: number
  content: string
  created_at: number
  author_info: AuthorInfo
  answer_meta: AnswerMeta
  responses: Response[]
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
}

export interface AuthorInfo {
  nickname: string
  avatar_url: string
  role: Role
  role_meta: RoleMeta
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
