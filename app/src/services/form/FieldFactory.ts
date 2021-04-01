import _ from 'lodash'
import { Field, FieldType, InputType } from '@/services/form/field.type'
import { Rule } from '@/services/validator/Validator'
import {
  Option as ProductOption,
  OptionValue,
  OptionValueType,
  IntervalType,
} from '@/api/insurance/product.type'
import { Option as InsuranceOption } from '@/api/insurance/insurance.type'

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
        const [min, max] = (options as ProductOption<OptionValueType>)
          .values as OptionValue<IntervalType>

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
            required: true,
            type: 'integer',
            min,
            max,
            message: `${name}不符`,
          },
        }
        break
      }
      case InputType.CHECKBOX:
      case InputType.RADIO:
      case InputType.OPTION: {
        const transformOptions = (options as InsuranceOption[]).map(
          (option) => {
            return {
              text: option.value,
              value: option.key,
            }
          }
        )

        const field: Field<FieldType.OPTION> = {
          id,
          name,
          type,
          options: transformOptions,
        }
        this.field = (field as unknown) as Field<T>

        this.validator = {
          [id]: {
            required: true,
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
  options: ProductOption<T> | InsuranceOption[]
  type: InputType
  unit?: string
}
