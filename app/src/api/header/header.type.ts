import { Link } from '../type'

export interface HeaderNavItem {
  name: string
  link: Link | null
  description?: string | null
  children?: HeaderNavItem[]
}

export interface HeaderPersonalized {
  avatar: string
  notification_count: number
  sales: SalesInfo
  menu: HeaderNavItem[]
}

export type HeaderPersonalizedData = HeaderPersonalized | {}

export interface SalesInfo {
  is_verify: boolean
  vip_countdown: number
  reward_point: number
}
