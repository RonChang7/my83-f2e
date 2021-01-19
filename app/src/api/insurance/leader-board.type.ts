import { LinkButton, PageResponse } from '../type'

export type LeaderBoardResponse = PageResponse<LeaderBoard>

export interface LeaderBoard {
  title: string
  description: string
  sections: Section[]
}

export interface Section {
  id: string
  title: string
  description: string
  image_url: string
  products: Product[]
  blog: LinkButton
}

export interface Product {
  name: string
  company: string
  btn: LinkButton
  features: string[]
  pageviews: number
}

export type SortType = 'recommend'
