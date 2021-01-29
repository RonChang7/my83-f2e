import { Link, Role, RoleCode } from '../type'

export interface HeaderDataResponse {
  header: HeaderNavItem[]
}

export interface HeaderNavItem {
  id?: string
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
  vip_discount_countdown: number | null
  point_discount_countdown: number | null
  reward_point: number
}

export interface Personalize {
  id: number
  avatar: string
  username: string
  nickname: string
  notification_count: number
  sales: SalesInfo
  role: Role
  role_code: RoleCode
}
