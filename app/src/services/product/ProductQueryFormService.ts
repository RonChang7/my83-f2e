import _ from 'lodash'
import {
  PremiumConfig,
  Plan,
  IntervalType,
  OptionValueType,
  Option,
  OptionType,
} from '@/api/insurance/product.type'
import { Option as SelectOption } from '@/components/my83-ui-kit/input/type'

export const enum InputType {
  NUMBER = 'NUMBER',
  TEXT = 'TEXT',
  RADIO = 'RADIO',
  OPTION = 'OPTION',
}

export enum JobLevel {
  LEVEL_1 = '職等1（內勤人員、教師、家管等）',
  LEVEL_2 = '職等2（外勤人員、業務、廚師或技師等）',
  LEVEL_3 = '職等3（司機、一般軍警等）',
  LEVEL_4 = '職等4（模板工、水電工等）',
  LEVEL_5 = '職等5（刑警、焊接工、高樓外部清潔工等）',
  LEVEL_6 = '職等6（消防隊隊員、機上服務員等）',
}

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

    return this.filedList.reduce<FieldOption<OptionValueType>[]>(
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

export type Scheme<T> = T extends IntervalType ? IntervalScheme : OptionScheme

export type FieldListObject = {
  id: string
  name: string
  unit?: string
  validateMsg?: string
}

export type FieldOption<T> = Scheme<T> & FieldListObject

export interface OptionScheme {
  type: InputType.OPTION | InputType.RADIO
  options?: SelectOption[]
}

export interface IntervalScheme {
  type: InputType.NUMBER
  min?: number
  max?: number
}
