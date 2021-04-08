import _ from 'lodash'
import { RuleItem } from 'async-validator'
import {
  computed,
  getCurrentInstance,
  reactive,
  ref,
} from '@nuxtjs/composition-api'
import { Rule, ValidateMessage } from '@/services/validator/Validator'
import { FormService } from '@/services/form/FormService'
import { FieldFactory } from '@/services/form/FieldFactory'
import { Field, FieldType, InputType } from '@/services/form/field.type'
import { FilterOption, FilterValue } from '@/api/insurance/insurance.type'
import { UpdateInsuranceListFilterPayload } from '@/store/insurance/insurance'
export class InsuranceFilterScheme {
  private static requiredFields = [
    'insurance_type',
    'condition',
    'contract',
    'promotion',
    'online_status',
    'company',
  ]

  form: FormService

  private fields: Field<FieldType>[] = []

  private formData: Record<string, any>

  private validators: Record<string, Rule<string>>

  constructor(
    premiumConfig: Record<string, FilterOption> | null,
    defaultPremiumConfig: FilterValue | null
  ) {
    if (!premiumConfig || !defaultPremiumConfig) return

    _.forEach(premiumConfig, (value, key) => {
      const rule: RuleItem = {
        required: InsuranceFilterScheme.requiredFields.includes(key),
        message: '至少選取一項，才會篩選出符合的商品喔！',
      }
      const field = new FieldFactory({
        id: key,
        name: value.name,
        options: value.values,
        type: InsuranceFilterScheme.getOptionType(value.type)!,
        rule,
      })

      this.fields.push(field.field)
      this.validators = { ...this.validators, ...field.validator } as Record<
        string,
        Rule<string>
      >
    })

    this.formData = _.cloneDeep(defaultPremiumConfig)

    this.form = new FormService(this.fields, this.formData, this.validators)
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

export const useInsuranceFilterForm = (
  config: Record<string, FilterOption> | null,
  initData: FilterValue | null
) => {
  const instance = getCurrentInstance()!
  const scheme = new InsuranceFilterScheme(config, initData)
  scheme.form.setSubmit(() => {
    instance.emit('submit')
  })

  const fields = ref(scheme.form.fields)
  const formData = ref(scheme.form.formData)
  const validateState = ref<Record<string, ValidateMessage | null>>({})
  const validateAll = async () => {
    const result = await scheme.form.validateAll()
    validateState.value = reactive(scheme.form.validateState)
    return result
  }

  const isAllValidated = computed(() =>
    _.every(validateState.value, (state) => {
      if (state && state.state === 'error') return false
      return true
    })
  )

  const update = async ({ id, value }: UpdateInsuranceListFilterPayload) => {
    scheme.form.updateFormData(id, value)
    await scheme.form.validate(id)
    validateState.value = reactive(scheme.form.validateState)
  }

  return {
    fields,
    formData,
    validateState,
    update,
    validateAll,
    isAllValidated,
  }
}
