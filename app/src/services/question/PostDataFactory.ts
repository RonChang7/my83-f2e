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
}

export type PostType = 'answer' | 'response'

export interface AnswerPostData {
  nickname: string
  content: string
}

export interface ResponsePostData {
  nickname: string
  content: string
}

type PostData = AnswerPostData | ResponsePostData
