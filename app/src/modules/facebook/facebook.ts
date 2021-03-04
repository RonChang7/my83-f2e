import {
  FaceBookStatus,
  ResponseGetLoginStatus,
  Status,
  ResponseGetUserDetails,
  AuthResponse,
} from './facebook.type'

export class Facebook {
  private static instance: Facebook

  public facebookState: FaceBookStatus = {
    isLoaded: false,
    accessToken: '',
    accessTokenExpireTime: 0,
    user: {
      id: '',
      name: '',
      avatar: '',
    },
  }

  private appId: string

  private constructor(appId: string) {
    this.appId = appId
    this.initFacebookSDK().then(() => {
      this.getLoginState()
      this.facebookState.isLoaded = true
    })
  }

  public static getInstance(appId: string): Facebook {
    if (!Facebook.instance) {
      Facebook.instance = new Facebook(appId)
    }

    return Facebook.instance
  }

  public login() {
    return new Promise<void>((resolve) =>
      window.FB.login(
        (response: ResponseGetLoginStatus<Status>) => {
          this.updateStatus(response)
          resolve()
        },
        {
          // https://developers.facebook.com/docs/reference/javascript/FB.login/v5.0
          auth_type: 'rerequest',
          scope: 'email',
        }
      )
    )
  }

  private initFacebookSDK() {
    const appId = this.appId
    return new Promise<void>((resolve) => {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId,
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
      this.facebookState.user.id = response.id
      this.facebookState.user.name = response.name
      this.facebookState.user.avatar = `https://graph.facebook.com/${response.id}/picture`
    })
  }

  private updateStatus(response: ResponseGetLoginStatus<Status>) {
    if (response.status === 'connected') {
      this.facebookState.accessToken = (response.authResponse as AuthResponse<
        'connected'
      >).accessToken
      this.facebookState.accessTokenExpireTime =
        Date.now() +
        (response.authResponse as AuthResponse<'connected'>).expiresIn * 1000
      this.getUserDetails()
    } else {
      this.facebookState.accessToken = ''
      this.facebookState.accessTokenExpireTime = 0
    }
  }
}

declare global {
  interface Window {
    fbAsyncInit: any
    FB: any
  }
}
