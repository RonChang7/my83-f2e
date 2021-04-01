import _ from 'lodash'
import { FormService } from '@/services/form/FormService'
import { FieldFactory } from '@/services/form/FieldFactory'
import { Field, FieldType, InputType } from '@/services/form/field.type'
import { InsuranceListData } from '@/api/insurance/insurance.type'

export class InsuranceFilterScheme {
  form: FormService

  private fields: Field<FieldType>[] = []

  private formData: Record<string, any>

  constructor(
    premiumConfig: InsuranceListData['premium_config'],
    defaultPremiumConfig: InsuranceListData['default_premium_config']
  ) {
    if (!premiumConfig || !defaultPremiumConfig) return

    _.forEach(premiumConfig, (value, key) => {
      const field = new FieldFactory({
        id: key,
        name: value.name,
        options: value.values,
        type: InsuranceFilterScheme.getOptionType(value.type)!,
      })

      this.fields.push(field.field)
    })

    this.formData = _.cloneDeep(defaultPremiumConfig)

    this.form = new FormService(this.fields, this.formData, {})
  }

  private static getOptionType(
    type: string
  ): InputType.RADIO | InputType.CHECKBOX | InputType.OPTION | undefined {
    switch (type) {
      case 'radio':
        return InputType.RADIO
      case 'checkbox':
        return InputType.CHECKBOX
      case 'option':
        return InputType.OPTION
      default:
        return undefined
    }
  }
}
