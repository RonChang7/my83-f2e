export const jwtParser = (token: string | undefined): Response<boolean> => {
  if (!token)
    return {
      success: false,
      message: 'Invalid token.',
    }

  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )

    return {
      success: true,
      ...JSON.parse(jsonPayload),
    }
  } catch (e) {
    return {
      success: false,
      message: 'Invalid token.',
    }
  }
}

export type Response<T> = T extends true ? JwtToken : Error

interface JwtToken {
  success: boolean
  iss: string
  iat: number
  exp: number
  nbf: number
  jti: string
  sub: JwtTokenSub
  prv: string
}

interface JwtTokenSub {
  uid: number
  role: string
  role_code: number
}

interface Error {
  success: boolean
  message: string
}
