import _ from 'lodash'
import AsyncValidator, { RuleItem, Rules } from 'async-validator'

export const enum ValidateState {
  Success = 'success',
  Error = 'error',
}

export class Validator<T> {
  private _rules: Rule<keyof T>

  public constructor(rules: Rule<keyof T>) {
    this._rules = Object.assign({}, rules)
  }

  public validate(key: string, value: any) {
    return new Promise<Record<string, ValidateMessage>>((resolve) => {
      const rule = _.pick(this._rules, key) as Rules
      const validator = new AsyncValidator(rule)
      const messages: Record<string, ValidateMessage> = {}

      return validator.validate(
        {
          [key]: value,
        },
        {
          firstFields: true,
          suppressWarning: true,
        },
        (errors) => {
          messages[key] = {
            state: errors ? ValidateState.Error : ValidateState.Success,
            message: errors && errors[0] ? errors[0].message : '',
          }

          resolve(messages)
        }
      )
    })
  }

  public validateAll(form: Record<string, any>) {
    return new Promise<Record<string, ValidateMessage>>((resolve, reject) => {
      const rules = _.pick(this._rules, _.keys(form)) as Rules
      const validator = new AsyncValidator(rules)
      const messages: Record<string, ValidateMessage> = {}

      return validator.validate(form, { suppressWarning: true }, (errors) => {
        let hasError = false
        if (errors) {
          errors.forEach((error) => {
            if (!error.field) return
            if (!hasError) hasError = true

            messages[error.field] = {
              state: ValidateState.Error,
              message: error.message,
            }
          })
        }

        hasError ? reject(messages) : resolve(messages)
      })
    })
  }
}

export interface ValidateMessage {
  state: ValidateState
  message: string
}

export type Rule<T extends string | number | symbol> = Record<
  T,
  RuleItem | RuleItem[]
>
