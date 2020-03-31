export class PostDataFactory {
  public form: PostData

  private type: PostType

  public constructor(type: PostType) {
    this.type = type
    this.form = this.createFormData()
  }

  public reset() {
    this.form = this.createFormData()
  }

  private createFormData(): PostData {
    switch (this.type) {
      case 'question':
        return this.createQuestionPostData()
      case 'answer':
        return this.createAnswerPostData()
      case 'response':
        return this.createResponsePostData()
    }
  }

  private createAnswerPostData(): AnswerPostData {
    return {
      nickname: '',
      content: '',
    }
  }

  private createResponsePostData(): ResponsePostData {
    return {
      nickname: '',
      content: '',
    }
  }

  private createQuestionPostData(): QuestionPostData {
    return {}
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

export interface QuestionPostData {}

type PostData = AnswerPostData | ResponsePostData | QuestionPostData
