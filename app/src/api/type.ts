export interface Link {
  path: string
  url: string
}

export interface SimpleResponse {
  success: boolean
  message?: any
}

export type Role = 'client' | 'sales'

export type RoleCode = 0 | 1

export interface PageMeta {
  title: string
  url: string
  keywords: string
  description: string
  image: PageMetaImage | null
}

export interface PageMetaImage {
  url: string
  type: string
  alt: string
  width: number
  height: number
}

export interface GlobalErrorResponse {
  error_message: string
}

export interface PaginationResponse {
  total_page: number
  current_page: number
  total_count: number
}

export interface Pagination {
  totalPage: number
  currentPage: number
  totalCount: number
}

export interface LinkButton {
  text: string
  link: Link
}

export interface RelatedBlog {
  title: string
  link: Link
  view_count: number
}

export interface RelatedQuestion extends RelatedBlog {
  answer_count: number
}
