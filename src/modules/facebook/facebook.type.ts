export interface FaceBookStatus {
  isLoaded: boolean
  accessToken: string
  accessTokenExpireTime: number
  user: FacebookUser
}

export interface FacebookUser {
  id: string
  name: string
  avatar: string
}

export interface ResponseGetLoginStatus<T> {
  status: Status
  authResponse: AuthResponse<T> | null
}

export interface ResponseGetUserDetails {
  name: string
  id: string
}

export type Status = 'connected' | 'not_authorized' | 'unknown'

export type AuthResponse<T> = T extends 'connected'
  ? {
      accessToken: string
      expiresIn: number
      data_access_expiration_time: number
      signedRequest: string
      userID: string
    }
  : null
