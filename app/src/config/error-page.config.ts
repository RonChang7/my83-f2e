const DEFAULT_IMAGE = 'error-page@2x.png'

export const ErrorPageType = {
  PRODUCT: 'PRODUCT',
  QUESTION: 'QUESTION',
  SERVER: 'SERVER',
  DEFAULT: 'DEFAULT',
}

export const errorPageContent: Record<string, ErrorContent> = {
  [ErrorPageType.DEFAULT]: {
    image: DEFAULT_IMAGE,
    title: '我們找不到你尋找的頁面喔',
    content:
      '可能發生了什麼問題或這個頁面已經不存在了\n告訴 MY83管理員發生問題的使用過程，一起讓MY83變得更好',
    buttonText: '回首頁',
    redirectUrl: '/',
    enableZendesk: true,
  },
  [ErrorPageType.SERVER]: {
    image: DEFAULT_IMAGE,
    title: '伺服器發生問題，請稍後再試',
    content:
      '可能發生了什麼問題\n告訴 MY83管理員發生問題的使用過程，一起讓MY83變得更好',
    buttonText: '重新整理',
    redirectUrl: '',
    enableZendesk: true,
  },
  [ErrorPageType.QUESTION]: {
    image: DEFAULT_IMAGE,
    title: '這篇討論不存在喔',
    content: '有保險問題嗎？快到討論區發問，讓專業的業務員來幫你吧！',
    buttonText: '回討論區',
    redirectUrl: '/question',
    enableZendesk: false,
  },
  [ErrorPageType.PRODUCT]: {
    image: DEFAULT_IMAGE,
    title: '這支保險商品不存在喔',
    content:
      '想知道最熱門的保險商品有哪些嗎？快去看看我們的推薦，有問題就交給業務員馬上解答！',
    buttonText: '回保險商品排行榜',
    redirectUrl: '/product/leaderboard',
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
