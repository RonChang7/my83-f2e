<template>
  <BaseCard class="AskingFormSection">
    <AskingFormSelectField
      class="AskingFormSection__field restrict"
      title="發問目的"
      :required="true"
      :value.sync="form.purpose"
      :options="purposeOption"
      :disabled="!purposeOption.length"
      :err-msg="errors.purpose ? errors.purpose.message : ''"
    />
    <AskingFormSelectField
      class="AskingFormSection__field restrict"
      title="投保對象"
      :required="true"
      :placeholder="targetOptionPlaceholder"
      :value.sync="form.target"
      :options="targetOption"
      :disabled="!targetOption.length"
      :err-msg="errors.target ? errors.target.message : ''"
    />
    <AskingFormInputField
      class="AskingFormSection__field"
      title="標題"
      :required="true"
      :value.sync="form.title"
      :maxlength="50"
      placeholder="範例：32歲 男 保單健檢及規劃"
      :err-msg="errors.title ? errors.title.message : ''"
    />
    <AskingFormTextareaField
      class="AskingFormSection__field"
      title="內文"
      :required="true"
      :value.sync="form.content"
      :auto-grow="true"
      :auto-grow-max-height="500"
      height="100px"
      :placeholder="
        '範例：32歲 男 男 辦公室上班族 \n預算約：3 萬 \n保障需求：重疾癌症、殘廢殘扶險、壽險'
      "
      legend="建議包含「年齡、性別、職業、相關家庭責任、大概收入狀況」，可以得到更完整的保險建議唷～"
      :err-msg="errors.content ? errors.content.message : ''"
    />
    <AskingFormUploadImageField
      class="AskingFormSection__field"
      title="保單照片"
    />
    <AskingFormTagSelectField
      class="AskingFormSection__field"
      title="標籤"
      :required="true"
      :value.sync="form.insurance"
      :options="insuranceOption"
      legend="請選擇「發問目的」與「投保對象」來帶出相關標籤，選擇符合內容的標籤能讓你的文章更容易被找到唷～"
      :err-msg="errors.insurance ? errors.insurance.message : ''"
    />
    <AskingFormInputField
      v-if="!nickname || !isMounted"
      class="AskingFormSection__field restrict"
      title="暱稱"
      :required="true"
      :value.sync="form.nickname"
      placeholder="設定你的暱稱"
      legend="暱稱設定後不可修改"
      :err-msg="errors.nickname ? errors.nickname.message : ''"
    />
    <AskingFormBaseField
      v-else
      class="AskingFormSection__field restrict"
      title="暱稱"
      :required="true"
    >
      {{ nickname }}
    </AskingFormBaseField>
    <div class="AskingFormSection__row">
      <BaseButton :size="buttonSize" @click.native="submit">送出</BaseButton>
    </div>
  </BaseCard>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import AskingFormBaseField from './asking/AskingFormBaseField.vue'
import AskingFormInputField from './asking/AskingFormInputField.vue'
import AskingFormTextareaField from './asking/AskingFormTextareaField.vue'
import AskingFormSelectField from './asking/AskingFormSelectField.vue'
import AskingFormUploadImageField from './asking/AskingFormUploadImageField.vue'
import AskingFormTagSelectField, {
  Props as InsuranceOption,
} from './asking/AskingFormTagSelectField.vue'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import {
  QuestionFromFactory,
  QuestionFormData,
} from '@/services/question/form/QuestionFromFactory'
import {
  transformFormOption,
  InsuranceTagOption,
} from '@/views/question/asking/AskingPage.vue'
import { Option as SelectOption } from '@/components/my83-ui-kit/input/BaseSelect.vue'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'
import UserMetaMixin, {
  ComponentInstance as UserMetaMixinComponentInstance,
} from '@/mixins/user/user-meta'
import { Validator } from '@/services/validator/Validator'

const QuestionForm = new QuestionFromFactory('new')

const options: ComponentOption = {
  components: {
    BaseCard,
    BaseButton,
    AskingFormBaseField,
    AskingFormInputField,
    AskingFormTextareaField,
    AskingFormSelectField,
    AskingFormUploadImageField,
    AskingFormTagSelectField,
  },
  mixins: [DeviceMixin, UserMetaMixin],
  props: {
    formOption: {
      type: Object as PropType<Props['formOption']>,
      required: true,
    },
  },
  data() {
    return {
      isMounted: false,
      form: null,
      errors: {},
    }
  },
  computed: {
    targetOptionPlaceholder() {
      if (!this.form?.purpose) {
        return '請先選擇發問目的'
      } else if (!this.targetOption.length) {
        return '不需選擇投保對象'
      }
      return '請選擇'
    },
    purposeOption() {
      return this.formOption.purpose
    },
    targetOption() {
      return this.form?.purpose ? this.formOption.target[this.form.purpose] : []
    },
    insuranceOption() {
      const options: InsuranceOption['options'] = []

      if (this.form && this.form.purpose > 0) {
        if (this.form && this.form.target === -1) {
          options.push(
            ...(this.formOption.insurance[
              this.form.purpose
            ] as InsuranceTagOption[]).map((option) => {
              return {
                label: option.name,
                options: option.options,
                enableFold: true,
                isExpanded: option.isOpen,
              }
            })
          )
        } else if (this.form && this.form.target > 0) {
          options.push(
            ...(this.formOption.insurance[this.form.purpose] as Record<
              string,
              InsuranceTagOption[]
            >)[this.form.target].map((option) => {
              return {
                label: option.name,
                options: option.options,
                enableFold: true,
                isExpanded: option.isOpen,
              }
            })
          )
        }
      }

      return options
    },
    buttonSize() {
      return this.isDesktop ? 'xl' : 'l-b'
    },
  },
  methods: {
    async submit() {
      if (!this.form) return

      this.form.googleReCaptcha = await this.getGoogleReCaptcha()
      if (!this.form.nickname && this.nickname) {
        this.form.nickname = this.nickname
      }

      const validate = await this.validate(this.form)
      console.log(validate)
    },
    async getGoogleReCaptcha() {
      let token = ''
      try {
        token = await this.$recaptcha.execute('login')
      } catch (error) {
        console.error(error)
      }

      return token
    },
    async validate(form: QuestionFormData) {
      try {
        await this.validator.validateAll(form)
        return true
      } catch (error) {
        this.$set(this, 'errors', error)
        return false
      }
    },
  },
  watch: {
    'form.purpose'(val) {
      if (this.form) {
        // 0: 尚未選擇, -1: 無選項可以選擇
        this.form.target = val && !this.targetOption.length ? -1 : 0
        this.form.insurance = []
      }
    },
    'form.target'() {
      if (this.form) {
        this.form.insurance = []
      }
    },
  },
  created() {
    this.form = QuestionForm.form as QuestionFormData
  },
  async mounted() {
    this.isMounted = true
    this.validator = new Validator(QuestionForm.validateRule)
    await this.$recaptcha.init()
  },
  beforeDestroy() {
    this.$recaptcha.destroy()
  },
}

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export type ComponentInstance = CombinedVueInstance<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export interface Instance
  extends Vue,
    Omit<DeviceMixinComponentInstance, keyof Vue>,
    Omit<UserMetaMixinComponentInstance, keyof Vue> {
  validator: Validator<QuestionFormData>
}

export interface Data {
  isMounted: boolean
  form: QuestionFormData | null
  errors: Partial<Record<keyof QuestionFormData, Record<string, any>>>
}

export interface Methods {
  submit(): void
  getGoogleReCaptcha(): Promise<string>
  validate(form: QuestionFormData): Promise<boolean>
}

export interface Computed {
  targetOptionPlaceholder: string
  purposeOption: SelectOption[]
  targetOption: SelectOption[]
  insuranceOption: InsuranceOption['options']
  buttonSize: 'xl' | 'l-b'
}

export interface Props {
  formOption: transformFormOption
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/rwd.scss';

.AskingFormSection {
  padding: 30px 0;

  &__field {
    margin-bottom: 40px;

    &.restrict {
      width: 250px;

      @include max-media('xl') {
        width: 100%;
      }
    }
  }

  &__row {
    display: flex;
    justify-content: center;
  }
}
</style>
