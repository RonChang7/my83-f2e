import { GlobalDialogContent } from '@/store/global'

export const IsUserSuspectDialogContent: GlobalDialogContent = {
  title: '你的身份可能有問題',
  content:
    '你可能將同帳號用於多重身份使用中，為求公平，你目前不能使用部分 MY83 服務。如果有任何問題，歡迎來信或客服詢問。',
  leftButtonText: '確定',
  leftButtonType: 'primary',
  defaultActionButton: 'left',
}

export const HasDuplicatedPostDialogContent: GlobalDialogContent = {
  title: '10分鐘內禁止重複發問喔！',
  leftButtonText: '確定',
  leftButtonType: 'primary',
  defaultActionButton: 'left',
}
