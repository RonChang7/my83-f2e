import { Rule } from '@/services/validator/Validator'
import { submitNewQuestion, submitEditQuestion } from '@/api/question/asking'
import {
  SubmitQuestionPayload,
  EditQuestionContent,
} from '@/api/question/asking.type'

export class QuestionFromService {
  public form: QuestionFormData

  private _formType: FormType

  public constructor(type: FormType) {
    this._formType = type
    this.form = this._createFormData(type)
  }

  public get formType() {
    return this._formType
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
          transform(value) {
            return value.trim()
          },
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
          transform(value) {
            return value.trim()
          },
        },
      ],
      images: [
        {
          type: 'array',
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
      removeImages: [
        {
          type: 'array',
        },
      ],
    }
  }

  public setInitContent(data: Partial<EditQuestionContent>) {
    if (this._formType === 'edit') {
      this.form.questionId = data.question_id
    }

    this.form.title = data.title || ''
    this.form.content = data.content || ''
    this.form.purpose = data.purpose_tag_id || 0
    this.form.target = data.target_tag_id
      ? data.target_tag_id
      : data.target_tag_id === null
      ? -1
      : 0
    this.form.insurance = data.insurance_type_tag_ids || []

    return this.form
  }

  public removeEditPostImage(imageSrc: string) {
    if (typeof this.form.removeImages === 'undefined') return
    this.form.removeImages.push(imageSrc)
  }

  public async submit() {
    const payload: SubmitQuestionPayload = {
      title: this.form.title,
      content: this.form.content,
      purpose_tag_id: this.form.purpose,
      target_tag_id: this.form.target,
      insurance_type_tag_ids: this.form.insurance,
      nickname: this.form.nickname,
      images: this.form.images,
      remove_images: this.form.removeImages,
      google_recaptcha: this.form.googleReCaptcha,
    }

    if (this._formType === 'new') {
      const result = await submitNewQuestion(payload)
      return result
    } else {
      const result = await submitEditQuestion(this.form.questionId!, payload)
      return result
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
      form.removeImages = []
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
  removeImages?: string[]
  insurance: number[]
  nickname: string
  googleReCaptcha: string
}
