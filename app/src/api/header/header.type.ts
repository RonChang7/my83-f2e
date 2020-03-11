import { Link, Role, RoleCode } from '../type'

export interface HeaderDataResponse {
  header: HeaderNavItem[]
}

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
  role: Role
  role_code: RoleCode
}
