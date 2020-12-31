import _ from 'lodash'
import {
  FieldListObject,
  Scheme,
  OptionScheme,
  InputType,
  FieldOption,
  JobLevel,
  IntervalScheme,
  Validator,
} from './field.type'
import {
  PremiumConfig,
  Plan,
  OptionValueType,
  Option,
  OptionType,
} from '@/api/insurance/product.type'
import { Option as SelectOption } from '@/components/my83-ui-kit/input/type'

// @TODO: refactor
export class ProductQueryFormService {
  private plans: Plan[]

  private isFixedRate: boolean

  private filedList: FieldListObject[] = [
    {
      id: 'age',
      name: '年齡',
      validateMsg: '年齡不符',
    },
    {
      id: 'gender',
      name: '性別',
    },
    {
      id: 'period',
      name: '年期',
    },
    {
      id: 'plan',
      name: '計畫',
    },
    {
      id: 'amount',
      name: '保額',
      validateMsg: '保額不符',
    },
    {
      id: 'job_level',
      name: '職等',
    },
  ]

  private option: Record<string, Scheme<OptionValueType>> = {}

  private validateRules: Record<string, Validator> = {}

  constructor(config: PremiumConfig, unit: Record<string, string>) {
    this.plans = config.plans
    this.isFixedRate = config.is_fixed_rate

    _.forEach(unit, (value, key) => {
      const index = this.filedList.findIndex((el) => el.id === key)
      if (index >= 0) {
        this.filedList[index].unit = value
      }
    })

    this.createDefaultFields()
  }

  private get planField(): OptionScheme {
    const options = this.plans.map<SelectOption>((plan) => {
      return {
        value: plan.plan_id,
        text: plan.name,
      }
    })

    return {
      type: InputType.OPTION,
      options,
    }
  }

  getOptions(planId: number): FieldOption<OptionValueType>[] {
    const plan = this.plans.find((plan) => plan.plan_id === planId)!

    _.forEach(plan, (value, key) => {
      if (typeof value === 'object' && _.find(this.filedList, ['id', key])) {
        this.option[key] = this.createField(key, value)
      }
    })

    if (this.isFixedRate) {
      this.option.plan = this.planField
      this.option.period = {
        type: InputType.OPTION,
        options: [
          {
            text: plan.payment_years_wording!,
            value: 0,
          },
        ],
      } as OptionScheme
    } else {
      this.option.period = this.planField
    }

    const options = this.filedList.reduce<FieldOption<OptionValueType>[]>(
      (acc, field) => {
        if (this.option[field.id]) {
          acc.push({
            id: field.id,
            name: field.name,
            unit: field.unit,
            validateMsg: field.validateMsg,
            ...this.option[field.id],
          })
        }
        return acc
      },
      []
    )
    this.createValidateRules(options)

    return options
  }

  validate(id: string, value: number | string) {
    if (!this.validateRules[id]) return true
    return this.validateRules[id](Number(value))
  }

  private createValidateRules(options: FieldOption<OptionValueType>[]) {
    this.validateRules = options.reduce<Record<string, Validator>>(
      (acc, cur) => {
        if (cur.type === InputType.NUMBER) {
          acc[cur.id] = (value) => {
            const range = {
              max: cur.max,
              min: cur.min,
            }

            if (_.isUndefined(range.min) || _.isUndefined(range.max))
              return true

            return !(value < range.min || value > range.max)
          }
        }
        return acc
      },
      {}
    )
  }

  private createDefaultFields() {
    const gender: OptionScheme = {
      type: InputType.RADIO,
      options: [
        {
          text: '男',
          value: 'male',
        },
        {
          text: '女',
          value: 'female',
        },
      ],
    }

    this.option.gender = gender
  }

  private createField(
    key: string,
    option: Option<OptionValueType>
  ): Scheme<OptionValueType> {
    let transformedOption: SelectOption[] = []

    if (option.type === 'option') {
      if (key === 'job_level') {
        transformedOption = (option.values as Option<OptionType>['values']).map(
          (value) => {
            return {
              text: JobLevel[`LEVEL_${value}`],
              value,
            }
          }
        )
      }

      return {
        type: InputType.OPTION,
        options: transformedOption,
      } as OptionScheme
    }

    return {
      type: InputType.NUMBER,
      min: option.values[0],
      max: option.values[1],
    } as IntervalScheme
  }
}
