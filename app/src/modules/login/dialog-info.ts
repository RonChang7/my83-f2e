import { GlobalDialogContent } from '@/store/global'

export const FacebookLoginNotMy83User: GlobalDialogContent = {
  title: '註冊 MY83 會員',
  content: '你現在還不是 MY83 會員，請選擇以下身份註冊：',
  leftButtonText: '我是保戶',
  leftButtonType: 'primary',
  rightButtonText: '我是業務員',
  rightButtonType: 'secondary',
  defaultActionButton: 'left',
  checkBeforeAction: true,
  checkBeforeActionText:
    '我已詳細閱讀並同意「<a href="/terms" target="_blank">服務條款</a>」、「<a href="/privacy" target="_blank">隱私權政策</a>」',
  checkBeforeActionErrMsg: '請勾選同意',
}
