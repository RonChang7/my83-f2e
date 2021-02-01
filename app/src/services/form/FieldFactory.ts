import _ from 'lodash'
import { Field, FieldType, InputType } from '@/services/form/field.type'
import { Rule } from '@/services/validator/Validator'
import {
  Option,
  OptionValue,
  OptionValueType,
  IntervalType,
} from '@/api/insurance/product.type'

export class FieldFactory<T extends FieldType> {
  field: Field<T>

  validator: Rule<string>

  constructor(payload: FieldFactoryPayload<OptionValueType>) {
    this.createField(payload)
  }

  private createField({
    id,
    name,
    options,
    type,
    unit,
  }: FieldFactoryPayload<OptionValueType>) {
    switch (type) {
      case InputType.NUMBER: {
        const [min, max] = options.values as OptionValue<IntervalType>

        const field: Field<FieldType.INTERVAL> = {
          id,
          name,
          type,
          min,
          max,
          postfix: unit,
          range:
            unit && !_.isUndefined(max) && !_.isUndefined(min)
              ? unit
                ? `(${min} ~ ${max} ${unit})`
                : `(${min} ~ ${max})`
              : undefined,
        }
        this.field = field as Field<T>

        this.validator = {
          [id]: {
            type: 'integer',
            min,
            max,
            message: `${name}不符`,
          },
        }
        break
      }
    }
  }
}

export interface FieldFactoryPayload<T extends OptionValueType> {
  id: string
  name: string
  options: Option<T>
  type: InputType
  unit?: string
}
