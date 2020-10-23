import { SimpleResponse, Role } from '../type'
import { LandingUrlInfo } from '@/services/user/user'

export interface LoginResponse extends SimpleResponse {
  status?: number
  token?: string
  expired_time?: number
}

export interface FacebookLoginPayload extends LandingUrlInfo {
  fbToken: string
  roleSession?: string
  memberSession?: string
}

export interface FacebookSignUpPayload extends LandingUrlInfo {
  fbToken: string
  role: Role
  roleSession?: string
  memberSession?: string
}

export interface EmailLoginPayload extends LandingUrlInfo {
  email: string
  password: string
  roleSession?: string
  memberSession?: string
}

export interface EmailLoginResponse extends LoginResponse {}

export interface FacebookSignUpResponse extends LoginResponse {}

export interface FacebookLoginResponse extends LoginResponse {}

export interface ForgetPasswordResponse extends SimpleResponse {}

export interface LogoutResponse extends SimpleResponse {}
