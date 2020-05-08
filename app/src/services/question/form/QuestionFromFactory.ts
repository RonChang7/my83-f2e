import { Rule } from '@/services/validator/Validator'

export class QuestionFromFactory {
  public form: QuestionFormData

  public constructor(type: FormType) {
    this.form = this._createFormData(type)
  }

  public get validateRule(): Rule<keyof QuestionFormData> {
    return {
      purpose: [
        {
          required: true,
          type: 'integer',
          validator(rule, value) {
            return value !== 0
          },
          message: '請選擇發問目的',
        },
      ],
      target: [
        {
          required: true,
          type: 'integer',
          validator(rule, value) {
            return value !== 0
          },
          message: '請選擇投保對象',
        },
      ],
      title: [
        {
          required: true,
          message: '請輸入標題',
        },
        {
          max: 50,
          message: '不得超過 50 字',
        },
      ],
      content: [
        {
          required: true,
          message: '請輸入內文',
        },
      ],
      images: [
        {
          type: 'array',
          max: 30,
        },
      ],
      insurance: [
        {
          required: true,
          type: 'array',
          min: 1,
          message: '請選擇符合內文的標籤，至少一個',
        },
      ],
      nickname: [
        {
          required: true,
          message: '請取暱稱',
        },
      ],
      googleReCaptcha: [
        {
          required: true,
          message: '資料送出失敗，請再試一次。\n若問題持續發生，請聯繫客服。',
        },
      ],
      questionId: [
        {
          type: 'integer',
          validator(rule, value) {
            return value > 0
          },
        },
      ],
      remove_images: [
        {
          type: 'array',
        },
      ],
    }
  }

  private _createFormData(type: FormType): QuestionFormData {
    const form: QuestionFormData = {
      purpose: 0,
      target: 0,
      title: '',
      content: '',
      images: [],
      insurance: [],
      nickname: '',
      googleReCaptcha: '',
    }

    if (type === 'edit') {
      form.questionId = 0
      form.remove_images = []
    }

    return form
  }
}

type FormType = 'new' | 'edit'

export interface QuestionFormData {
  questionId?: number
  purpose: number
  target: number
  title: string
  content: string
  images: string[]
  remove_images?: string[]
  insurance: number[]
  nickname: string
  googleReCaptcha: string
}
