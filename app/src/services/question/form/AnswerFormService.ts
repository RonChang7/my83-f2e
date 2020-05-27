import { UserRole } from '@/services/user/user'

export class AnswerFormService {
  public form: AnswerFormData

  public errorMessage: string

  private userRole: UserRole

  public constructor(role: UserRole) {
    this.userRole = role
    this.form = this._createFormData()
  }

  public reset() {
    this.form = this._createFormData()
  }

  public validate() {
    if (this.userRole === 'sales' && !this.form.acceptRule) {
      this.errorMessage = '請同意遵守版規'
      return false
    }

    this.errorMessage = ''
    return true
  }

  private _createFormData(): AnswerFormData {
    const form: AnswerFormData = {
      nickname: '',
      content: '',
    }

    if (this.userRole === 'sales') {
      form.acceptRule = false
    }

    return form
  }
}

export interface AnswerFormData {
  nickname: string
  content: string
  acceptRule?: boolean
}
