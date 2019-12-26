import initZendesk from './zendesk-sdk'

export class Zendesk {
  public static isLoaded: boolean = false

  private static instance: Zendesk

  private constructor() {
    initZendesk().then(() => {
      this.onLoad()
    })
  }

  public static getInstance(): Zendesk {
    if (!Zendesk.instance) {
      Zendesk.instance = new Zendesk()
    }

    return Zendesk.instance
  }

  public static hideWidget() {
    return window.$zopim.livechat.hideAll()
  }

  public static showButton() {
    return window.$zopim.livechat.button.show()
  }

  public static hideButton() {
    return window.$zopim.livechat.button.hide()
  }

  public static showChatWindow() {
    return window.$zopim.livechat.window.show()
  }

  public static hideChatWindow() {
    return window.$zopim.livechat.window.hide()
  }

  public onLoad(callback: (() => void) | undefined = undefined) {
    if (Zendesk.isLoaded) {
      callback && callback()
      return
    }

    const id = window.setInterval(() => {
      Zendesk.isLoaded = !!(window.$zopim && window.$zopim.livechat)
      if (Zendesk.isLoaded) {
        Zendesk.isLoaded = true
        callback && callback()
        window.clearInterval(id)
      }
    }, 1000)
  }
}

declare global {
  interface Window {
    $zopim: any
  }
}
