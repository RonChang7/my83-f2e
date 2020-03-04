import { SimpleResponse } from '../type'

export interface EmailLoginResponse extends SimpleResponse {
  status?: number
}

export interface FacebookSignUpResponse extends SimpleResponse {
  status?: number
}

export interface FacebookLoginResponse extends SimpleResponse {
  status?: number
}

export interface ForgetPasswordResponse extends SimpleResponse {}

export interface LogoutResponse extends SimpleResponse {}
