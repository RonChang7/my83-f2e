import { Link } from '../type'

export interface HeaderNavItem {
  name: string
  link: Link | null
  description?: string | null
  children?: HeaderNavItem[]
}

export interface HeaderPersonalizedData {
  avatar: string
  notification_count: number
  sales: SalesInfo
  menu: HeaderNavItem[]
}

export interface SalesInfo {
  is_verify: boolean
  vip_countdown: number
  reward_point: number
}
