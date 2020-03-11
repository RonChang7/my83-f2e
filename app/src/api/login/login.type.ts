import { SimpleResponse } from '../type'

export interface LoginResponse extends SimpleResponse {
  status?: number
  token?: string
  expired_time?: number
}

export interface EmailLoginResponse extends LoginResponse {}

export interface FacebookSignUpResponse extends LoginResponse {}

export interface FacebookLoginResponse extends LoginResponse {}

export interface ForgetPasswordResponse extends SimpleResponse {}

export interface LogoutResponse extends SimpleResponse {}
