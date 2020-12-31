import _ from 'lodash'
import { FieldOption, OptionScheme, InputType } from './field.type'
import { PremiumConfigOption } from '@/api/insurance/insurance.type'
import { Option as SelectOption } from '@/components/my83-ui-kit/input/type'

// @TODO: refactor
export class InsuranceFilterFormService {
  private fieldList: FieldListObject[] = [
    {
      id: 'gender',
      name: '性別',
    },
    {
      id: 'vehicle_type',
      name: '車種',
    },
  ]

  private _options: FieldOption<OptionScheme>[]

  constructor(options: Record<string, PremiumConfigOption>) {
    this._create(options)
  }

  private static getOptionType(
    type: string
  ): InputType.RADIO | InputType.OPTION | undefined {
    switch (type) {
      case 'radio':
        return InputType.RADIO
      case 'option':
        return InputType.OPTION
      default:
        return undefined
    }
  }

  private _create(options: Record<string, PremiumConfigOption>) {
    const optionKeys = _.keys(options)
    this._options = optionKeys.reduce<FieldOption<OptionScheme>[]>(
      (acc, key) => {
        const optionType = InsuranceFilterFormService.getOptionType(
          options[key].type
        )

        if (!optionType) return acc

        const selectOptions = options[key].values.map<SelectOption>(
          ({ key, value }) => {
            return {
              text: value,
              value: key,
            }
          }
        )

        const fieldOption: FieldOption<OptionScheme> = {
          ..._.find(this.fieldList, { id: key })!,
          type: optionType,
          options: selectOptions,
        }

        acc.push(fieldOption)

        return acc
      },
      []
    )
  }

  public get options() {
    return this._options
  }
}

interface FieldListObject {
  id: string
  name: string
}
