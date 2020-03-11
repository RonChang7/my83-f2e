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
