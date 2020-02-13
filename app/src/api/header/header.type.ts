import { Link } from '../type'

export interface HeaderNavItem {
  name: string
  link: Link | null
  description?: string | null
  children?: HeaderNavItem[]
}

export interface HeaderPersonalized {
  personalize: Personalize
  menu: HeaderNavItem[]
}

export interface SalesInfo {
  is_verify: boolean
  vip_countdown: number
  reward_point: number
}

export interface Personalize {
  avatar: string
  username: string
  nickname: string
  notification_count: number
  sales: SalesInfo
}
