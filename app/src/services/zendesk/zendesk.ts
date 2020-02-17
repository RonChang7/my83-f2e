import initZendesk from '@/libs/zendesk-sdk'

export class Zendesk {
  public static isLoaded: boolean = false

  private static instance: Zendesk

  private constructor(chatId: string) {
    initZendesk(chatId).then(() => {
      this.onLoad()
    })
  }

  public static getInstance(chatId: string): Zendesk {
    if (!Zendesk.instance) {
      Zendesk.instance = new Zendesk(chatId)
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
        window.$zopim.livechat.setLanguage('zh_TW') // 調整預設語言
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
