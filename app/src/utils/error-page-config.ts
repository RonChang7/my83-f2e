const DEFAULT_IMAGE = 'error-page@2x.png'

export const errorPageContent: Record<string, ErrorContent> = {
  default: {
    image: DEFAULT_IMAGE,
    title: '我們找不到你尋找的頁面喔',
    content:
      '可能發生了什麼問題或這個頁面已經不存在了\n告訴 MY83管理員發生問題的使用過程，一起讓MY83變得更好',
    buttonText: '回首頁',
    redirectUrl: '/',
    enableZendesk: true,
  },
  question: {
    image: DEFAULT_IMAGE,
    title: '這篇討論不存在喔',
    content: '有保險問題嗎？快到討論區發問，讓專業的業務員來幫你吧！',
    buttonText: '回討論區',
    redirectUrl: '/question',
    enableZendesk: false,
  },
}

export interface ErrorContent {
  image: string
  title: string
  content: string
  buttonText: string
  redirectUrl: string
  enableZendesk: boolean
}
