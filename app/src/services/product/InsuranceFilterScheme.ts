import _ from 'lodash'
import { FormService } from '@/services/form/FormService'
import { FieldFactory } from '@/services/form/FieldFactory'
import { Field, FieldType, InputType } from '@/services/form/field.type'
import { InsuranceListData } from '@/api/insurance/insurance.type'

export class InsuranceFilterScheme {
  private static fieldList: FieldListObject[] = [
    {
      id: 'gender',
      name: '性別',
    },
    {
      id: 'vehicle_type',
      name: '車種',
    },
  ]

  form: FormService

  private fields: Field<FieldType>[] = []

  private formData: Record<string, any>

  constructor(
    premiumConfig: InsuranceListData['premium_config'],
    defaultPremiumConfig: InsuranceListData['default_premium_config']
  ) {
    if (!premiumConfig || !defaultPremiumConfig) return

    _.forEach(premiumConfig, (value, key) => {
      const name = InsuranceFilterScheme.fieldList.find(
        (field) => field.id === key
      )!.name
      const field = new FieldFactory({
        id: key,
        name,
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
}

interface FieldListObject {
  id: string
  name: string
}
