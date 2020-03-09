export interface EmailLoginResponse {
  status?: number
  success: boolean
  message?: string
}

export interface FacebookLoginResponse {
  status?: number
  success: boolean
  is_my83_user?: boolean
  message?: string
}

export interface ForgetPasswordResponse {
  success: boolean
  message?: string
}

export interface LogoutResponse {
  success: boolean
}
