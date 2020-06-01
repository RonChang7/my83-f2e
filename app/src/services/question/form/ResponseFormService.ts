export class ResponseFormService {
  public form: ResponseFormData

  public constructor() {
    this.form = this._createFormData()
  }

  public reset() {
    this.form = this._createFormData()
  }

  private _createFormData(): ResponseFormData {
    const form: ResponseFormData = {
      nickname: '',
      content: '',
    }

    return form
  }
}

export interface ResponseFormData {
  nickname: string
  content: string
}
