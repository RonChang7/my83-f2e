import {
  FaceBookStatus,
  ResponseGetLoginStatus,
  Status,
  ResponseGetUserDetails,
  AuthResponse,
} from './facebook.type'

export class Facebook {
  private constructor() {
    this.initFacebookSDK().then(() => {
      this.getLoginState()
      Facebook.state.isLoaded = true
    })
  }

  private static instance: Facebook

  public static getInstance(): Facebook {
    if (!Facebook.instance) {
      Facebook.instance = new Facebook()
    }

    return Facebook.instance
  }

  public static state: FaceBookStatus = {
    isLoaded: false,
    accessToken: '',
    accessTokenExpireTime: 0,
    user: {
      id: '',
      name: '',
      avatar: '',
    },
  }

  public login() {
    return new Promise((resolve) =>
      window.FB.login(
        (response: ResponseGetLoginStatus<Status>) => {
          this.updateStatus(response)
          resolve()
        },
        {
          // https://developers.facebook.com/docs/reference/javascript/FB.login/v5.0
          auth_type: 'rerequest',
        }
      )
    )
  }

  private initFacebookSDK() {
    return new Promise((resolve) => {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: process.env.FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v5.0',
        })
      }

      // Facebook JavaScript SDK
      /* eslint-disable */
      ;(function(d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) {
          return
        }
        js = d.createElement(s)
        js.id = id
        js.src = 'https://connect.facebook.net/zh_TW/sdk.js'
        // @ts-ignore
        fjs.parentNode.insertBefore(js, fjs)
        js.onload = () => {
          resolve()
        }
      })(document, 'script', 'facebook-jssdk')
      /* eslint-enable */
    })
  }

  private getLoginState() {
    window.FB.getLoginStatus((response: ResponseGetLoginStatus<Status>) => {
      this.updateStatus(response)
    })
  }

  // 取得 Facebook user detail (name & id)
  private getUserDetails() {
    window.FB.api('/me', (response: ResponseGetUserDetails) => {
      Facebook.state.user.id = response.id
      Facebook.state.user.name = response.name
      Facebook.state.user.avatar = `https://graph.facebook.com/${response.id}/picture`
    })
  }

  private updateStatus(response: ResponseGetLoginStatus<Status>) {
    if (response.status === 'connected') {
      Facebook.state.accessToken = (response.authResponse as AuthResponse<
        'connected'
      >).accessToken
      Facebook.state.accessTokenExpireTime =
        Date.now() +
        (response.authResponse as AuthResponse<'connected'>).expiresIn * 1000
      this.getUserDetails()
    } else {
      Facebook.state.accessToken = ''
      Facebook.state.accessTokenExpireTime = 0
    }
  }
}

declare global {
  interface Window {
    fbAsyncInit: any
    FB: any
  }
}
