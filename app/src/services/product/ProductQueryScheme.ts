import { Field, FieldType, InputType } from '@/services/form/field.type'
import { DefaultPremiumConfig, Plan } from '@/api/insurance/product.type'
import { FormService } from '@/services/form/FormService'
import { FieldFactory } from '@/services/form/FieldFactory'
import { Rule, ValidateMessage } from '@/services/validator/Validator'
import { ZHTWUnitMap } from '@/utils/number-converter'

export class VariableRateScheme {
  form: FormService

  private fields: Field<FieldType>[]

  private formData: Record<string, any>

  private validateRules: Record<string, Rule<string>> = {}

  private plans: Plan[]

  private amountUnit: string | undefined

  constructor({
    plans,
    defaultPremiumConfig,
    amountUnit,
  }: {
    plans: Plan[]
    defaultPremiumConfig: DefaultPremiumConfig
    amountUnit?: number
  }) {
    this.plans = plans
    if (amountUnit) {
      this.amountUnit = this.amountUnitTransform(amountUnit)
    }

    const defaultPlanId = defaultPremiumConfig.plan_id
    this._initForm(defaultPlanId, defaultPremiumConfig)
  }

  static age(plans: Plan[], planId: number) {
    const plan = plans.find((plan) => plan.plan_id === planId)
    if (!(plan && plan.age)) return

    return new FieldFactory<FieldType.INTERVAL>({
      id: 'age',
      name: '年齡',
      options: plan.age,
      type: InputType.NUMBER,
      unit: '歲',
    })
  }

  static gender() {
    return new BuildGenderField()
  }

  static period(plans: Plan[]) {
    return new BuildPlanField({ plans, name: '年期' })
  }

  static amount(plans: Plan[], planId: number, amountUnit?: string) {
    const plan = plans.find((plan) => plan.plan_id === planId)
    if (!(plan && plan.amount)) return

    return new FieldFactory<FieldType.INTERVAL>({
      id: 'amount',
      name: '保額',
      options: plan.amount,
      type: InputType.NUMBER,
      unit: amountUnit,
    })
  }

  static jobLevel(plans: Plan[], planId: number) {
    return new BuildJobLevelField(plans, planId)
  }

  updateForm(planId: number) {
    this._createFields(planId)
    this.form = new FormService(this.fields, this.formData, this.validateRules)
    return this.form
  }

  private _initForm(
    planId: number,
    defaultPremiumConfig: DefaultPremiumConfig
  ) {
    this._createFields(planId)

    this.formData = this.fields.reduce((formData, field) => {
      formData[field.id] = defaultPremiumConfig[field.id]
      return formData
    }, {})

    this.form = new FormService(this.fields, this.formData, this.validateRules)
    return this.form
  }

  private _createFields(planId: number) {
    this.fields = [
      VariableRateScheme.age(this.plans, planId),
      VariableRateScheme.gender(),
      VariableRateScheme.period(this.plans),
      VariableRateScheme.amount(this.plans, planId, this.amountUnit),
      VariableRateScheme.jobLevel(this.plans, planId),
    ]
      .map((fieldFactory) => {
        const id = fieldFactory?.field?.id
        const validator = fieldFactory?.['validator']

        if (id && validator) {
          this.validateRules = {
            ...this.validateRules,
            ...validator,
          }
        }
        return fieldFactory?.field
      })
      .filter((_) => _) as Field<FieldType>[]
  }

  private amountUnitTransform(amountUnit: number) {
    return amountUnit ? ZHTWUnitMap[amountUnit] || '元' : undefined
  }
}

export class FixedRateScheme {
  form: FormService

  private fields: Field<FieldType>[]

  private formData: Record<string, any>

  private validateRules: Record<string, Rule<string>> = {}

  private validateState: Record<string, ValidateMessage> = {}

  private plans: Plan[]

  constructor({
    plans,
    defaultPremiumConfig,
  }: {
    plans: Plan[]
    defaultPremiumConfig: DefaultPremiumConfig
  }) {
    this.plans = plans

    const defaultPlanId = defaultPremiumConfig.plan_id
    this._initForm(defaultPlanId, defaultPremiumConfig)
  }

  static age(plans: Plan[], planId: number) {
    const plan = plans.find((plan) => plan.plan_id === planId)
    if (!plan) return

    return new FieldFactory<FieldType.INTERVAL>({
      id: 'age',
      name: '年齡',
      options: plan.age,
      type: InputType.NUMBER,
      unit: '歲',
    })
  }

  static gender() {
    return new BuildGenderField()
  }

  static period(plans: Plan[], planId: number) {
    return new BuildPeriodField(plans, planId)
  }

  static planId(plans: Plan[]) {
    return new BuildPlanField({ plans, name: '計畫' })
  }

  static jobLevel(plans: Plan[], planId: number) {
    return new BuildJobLevelField(plans, planId)
  }

  updateForm(planId: number) {
    this._createFields(planId)
    this.form = new FormService(this.fields, this.formData, this.validateRules)
    return this.form
  }

  private _initForm(
    planId: number,
    defaultPremiumConfig: DefaultPremiumConfig
  ) {
    this._createFields(planId)

    this.formData = this.fields.reduce((formData, field) => {
      formData[field.id] = defaultPremiumConfig[field.id]
      return formData
    }, {})

    this.form = new FormService(this.fields, this.formData, this.validateRules)
    return this.form
  }

  private _createFields(planId: number) {
    this.fields = [
      FixedRateScheme.age(this.plans, planId),
      FixedRateScheme.gender(),
      FixedRateScheme.period(this.plans, planId),
      FixedRateScheme.planId(this.plans),
      FixedRateScheme.jobLevel(this.plans, planId),
    ]
      .map((fieldFactory) => {
        const id = fieldFactory?.field?.id
        const validator = fieldFactory?.['validator']

        if (id && validator) {
          this.validateRules = {
            ...this.validateRules,
            ...validator,
          }
        }
        return fieldFactory?.field
      })
      .filter((_) => _) as Field<FieldType>[]
  }
}

enum JobLevel {
  LEVEL_1 = '職等1（內勤人員、教師、家管等）',
  LEVEL_2 = '職等2（外勤人員、業務、廚師或技師等）',
  LEVEL_3 = '職等3（司機、一般軍警等）',
  LEVEL_4 = '職等4（模板工、水電工等）',
  LEVEL_5 = '職等5（刑警、焊接工、高樓外部清潔工等）',
  LEVEL_6 = '職等6（消防隊隊員、機上服務員等）',
}

class BuildGenderField {
  field: Field<FieldType.OPTION>

  constructor() {
    this.createField()
  }

  private createField() {
    this.field = {
      id: 'gender',
      name: '性別',
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
  }
}

class BuildPeriodField {
  field: Field<FieldType.TEXT>

  constructor(plans: Plan[], planId: number) {
    this.createField(plans, planId)
  }

  private createField(plans: Plan[], planId: number) {
    this.field = {
      id: 'period',
      name: '年期',
      type: InputType.TEXT,
      placeholder: plans.find((plan) => plan.plan_id === planId)
        ?.payment_years_wording,
      disabled: true,
    }
  }
}

class BuildPlanField {
  field: Field<FieldType.OPTION>

  constructor({ plans, name }: { plans: Plan[]; name: string }) {
    this.createField(plans, name)
  }

  private createField(plans: Plan[], name: string) {
    this.field = {
      id: 'plan_id',
      name,
      type: InputType.OPTION,
      options: plans.map((plan) => {
        return {
          text: plan.name,
          value: plan.plan_id,
        }
      }),
    }
  }
}

class BuildJobLevelField {
  field: Field<FieldType.OPTION>

  constructor(plans: Plan[], planId: number) {
    this.createField(plans, planId)
  }

  private createField(plans: Plan[], planId: number) {
    const plan = plans.find((plan) => plan.plan_id === planId)
    if (!(plan && plan.job_level)) return

    this.field = {
      id: 'job_level',
      name: '職等',
      type: InputType.OPTION,
      options: plan.job_level.values.map((value) => {
        return {
          text: JobLevel[`LEVEL_${value}`],
          value,
        }
      }),
    }
  }
}
