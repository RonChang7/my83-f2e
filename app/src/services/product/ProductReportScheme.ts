import _ from 'lodash'
import { RuleItem } from 'async-validator'
import { Rule, ValidateMessage } from '@/services/validator/Validator'
import { FormService } from '@/services/form/FormService'
import { FieldFactory } from '@/services/form/FieldFactory'
import { Field, FieldType, InputType } from '@/services/form/field.type'
import { computed, reactive, ref } from '@nuxtjs/composition-api'

class ProductReportScheme {
  public form: FormService

  private fields: Field<FieldType>[] = []

  private validateRules: Rule<string> = {}

  private formData: Record<string, string>

  constructor() {
    const fieldConfig: FieldConfig[] = [
      {
        id: 'content',
        name: '回報問題',
        type: InputType.TEXTAREA,
        placeholder: '說明原因',
        legend:
          '僅接受商品資訊相關的問題回報，與商品無關的問題請透過客服信箱，謝謝。',
        rule: {
          message: '問題內容為必填',
        },
      },
      {
        id: 'refLink',
        name: '參考連結',
        type: InputType.TEXT,
        placeholder: 'https://',
        legend: '有需要的話，可以附上相關連結網址，更明確指示正確資訊。',
        rule: {
          required: false,
          type: 'url',
          message: '連結格式不符',
        },
      },
      {
        id: 'reporter',
        name: '回報人',
        type: InputType.TEXT,
        placeholder: '怎麼稱呼你',
        rule: {
          required: false,
        },
      },
      {
        id: 'reporterContact',
        name: '聯絡資訊',
        type: InputType.TEXT,
        placeholder: '0988888888 / hello@my83.com',
        legend:
          '為方便向你進一步確認資訊，請提供手機或信箱，僅做資訊回報確認使用。',
        rule: {
          required: false,
        },
      },
    ]

    this.fields = fieldConfig.map((config) => {
      const field = new FieldFactory({
        id: config.id,
        name: config.name,
        options: {
          placeholder: config.placeholder,
          length: config.length,
        },
        type: config.type,
        rule: config.rule,
        legend: config.legend,
      })

      this.validateRules = {
        ...this.validateRules,
        ...field.validator,
      }

      return field.field
    })

    this.formData = {
      content: '',
      refLink: '',
      reporter: '',
      reporterContact: '',
    }

    this.form = new FormService(this.fields, this.formData, this.validateRules)
  }
}

interface FieldConfig {
  id: string
  name: string
  type: InputType
  placeholder?: string
  length?: number
  rule?: RuleItem
  legend?: string
}

export const useProductReport = () => {
  const validateState = ref<Record<string, ValidateMessage | null>>({})
  const scheme = new ProductReportScheme()
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
  const update = async (id: string, value: string) => {
    scheme.form.updateFormData(id, value)
    await scheme.form.validate(id)
    validateState.value = reactive(scheme.form.validateState)
  }

  const reset = () => {
    _.forEach(scheme.form.formData, (_, key) => {
      scheme.form.updateFormData(key, '')
    })
    validateState.value = {}
  }

  return {
    scheme,
    validateState,
    validateAll,
    isAllValidated,
    update,
    reset,
  }
}
