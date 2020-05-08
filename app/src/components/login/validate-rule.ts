import { Rule } from '@/services/validator/Validator'

export const rule: Rule = {
  email: [
    {
      required: true,
      message: '此欄不可為空白',
    },
    {
      type: 'email',
      message: '請輸入正確的信箱格式',
    },
  ],
  password: [
    {
      required: true,
      message: '此欄不可為空白',
    },
  ],
}
