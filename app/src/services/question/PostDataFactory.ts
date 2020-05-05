export class PostDataFactory {
  public form: PostData

  private _type: PostType

  public constructor(type: PostType) {
    this._type = type
    this.form = this._createFormData()
  }

  public reset() {
    this.form = this._createFormData()
  }

  private _createFormData(): PostData {
    switch (this._type) {
      // @TODO: 改為常數
      case 'question':
        return this._createQuestionPostData()
      case 'answer':
        return this._createAnswerPostData()
      case 'response':
        return this._createResponsePostData()
    }
  }

  private _createAnswerPostData(): AnswerPostData {
    return {
      nickname: '',
      content: '',
    }
  }

  private _createResponsePostData(): ResponsePostData {
    return {
      nickname: '',
      content: '',
    }
  }

  private _createQuestionPostData(): QuestionPostData {
    return {
      purpose: 0,
      target: 0,
      title: '',
      content: '',
      images: [],
      insurance: [],
      nickname: '',
    }
  }
}

export type PostType = 'question' | 'answer' | 'response'

export interface AnswerPostData {
  nickname: string
  content: string
}

export interface ResponsePostData {
  nickname: string
  content: string
}

export interface QuestionPostData {
  purpose: number
  target: number
  title: string
  content: string
  images: string[]
  insurance: number[]
  nickname: string
}

type PostData = AnswerPostData | ResponsePostData | QuestionPostData
