import _ from 'lodash'
import { reactive, set } from '@nuxtjs/composition-api'
import {
  Validator,
  Rule,
  ValidateMessage,
  ValidateState,
} from '@/services/validator/Validator'
import { Field, InputType } from './field.type'

type FormData = Record<string, any>

export interface Form {
  fields: Field<any>[]
  formData: FormData
  validateState: Record<string, ValidateMessage | null>
  submit(): void
  validate(id: string): void
  validateAll(): void
}

export class FormService implements Form {
  private _submit: Function

  private _validateState: Record<string, ValidateMessage | null>

  private validator: Validator<FormData>

  constructor(
    private _fields: Field<any>[],
    private _formData: Record<string, any>,
    validateRules: Rule<string>
  ) {
    this.validator = new Validator(validateRules)
    this.initValidateState()
    this.normalizedFormData()
  }

  get fields() {
    return this._fields.map((field) => reactive(field))
  }

  get formData() {
    return reactive(this._formData)
  }

  get validateState() {
    return this._validateState
  }

  updateFormData(key, value) {
    _.set(this._formData, key, value)
  }

  setSubmit(func: Function) {
    this._submit = func
  }

  submit() {
    return this._submit()
  }

  async validate(id: string) {
    const result = await this.validator.validate(id, this._formData[id])

    /**
     * ⚠️ set and del workaround for adding and deleting reactive properties
     * ⚠️ Warning: set and del do NOT exist in Vue 3.
     * We provide them as a workaround here, due to the limitation of Vue 2.x reactivity system.
     * Ref: https://github.com/vuejs/composition-api#ref-unwrap
     */
    // @TODO: Should remove in Vue3
    set(this._validateState, id, result[id])
  }

  async validateAll() {
    try {
      const result = await this.validator.validateAll(this._formData)
      set(this, '_validateState', result)
    } catch (errors) {
      set(this, '_validateState', errors)
    }

    return _.every(
      this._validateState,
      (state) => state === null || state.state === ValidateState.Success
    )
  }

  private initValidateState() {
    const initValidateState = _.keys(this._formData).reduce((acc, curr) => {
      acc[curr] = null
      return acc
    }, {})
    this._validateState = reactive(initValidateState)
  }

  private normalizedFormData() {
    this.fields.forEach((field) => {
      if (
        field.type === InputType.CHECKBOX &&
        !_.isArray(this._formData[field.id])
      ) {
        this._formData[field.id] = [this._formData[field.id]]
      }
    })
  }
}
