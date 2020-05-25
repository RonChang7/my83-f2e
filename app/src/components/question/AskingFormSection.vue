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
        `範例：32歲 男 辦公室上班族 \n預算約：3 萬 \n保障需求：重疾癌症、殘廢殘扶險、壽險`
      "
      legend="建議包含「年齡、性別、職業、相關家庭責任、大概收入狀況」，可以得到更完整的保險建議唷～"
      :err-msg="errors.content ? errors.content.message : ''"
    />
    <AskingFormUploadImageField
      ref="uploadImageField"
      class="AskingFormSection__field"
      title="保單照片"
      :edit-post-images="editPostPreviewImages"
      :init-id="uploadImageInitId"
      :size-limit="7"
      :err-msg="errors.images ? errors.images.message : ''"
      @validate="imageUploadValidate"
      @convert-images-size="payloadSizeValidate"
      @remove-edit-post-image="removeEditPostImage"
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
      class="AskingFormSection__field restrict nickname"
      title="暱稱"
      :required="true"
      :value.sync="form.nickname"
      placeholder="設定你的暱稱"
      legend="暱稱設定後不可修改"
      :err-msg="errors.nickname ? errors.nickname.message : ''"
    />
    <AskingFormBaseField
      v-else
      class="AskingFormSection__field"
      title="暱稱"
      :required="true"
    >
      {{ nickname }}
    </AskingFormBaseField>
    <div class="AskingFormSection__row">
      <BaseButton
        :size="buttonSize"
        :state="submitState"
        @click.native="submit"
      >
        送出
      </BaseButton>
    </div>
    <BaseInputMessage :msg="formErrMsg" text-align="center" />
  </BaseCard>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { Store } from 'vuex'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import AskingFormBaseField from './asking/AskingFormBaseField.vue'
import AskingFormInputField from './asking/AskingFormInputField.vue'
import AskingFormTextareaField from './asking/AskingFormTextareaField.vue'
import AskingFormSelectField from './asking/AskingFormSelectField.vue'
import AskingFormUploadImageField, {
  ComponentInstance as AskingFormUploadImageFieldComponentInstance,
} from './asking/AskingFormUploadImageField.vue'
import AskingFormTagSelectField, {
  Props as InsuranceOption,
} from './asking/AskingFormTagSelectField.vue'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'
import {
  QuestionFromService,
  QuestionFormData,
} from '@/services/question/form/QuestionFromService'
import { PreviewImage } from '@/services/question/UploadImageService'
import {
  TransformFormOption,
  InsuranceTagOption,
} from '@/views/question/asking/AskingPage.vue'
import {
  EditQuestionContent,
  ErrorResponse,
  SubmitQuestionPayload,
} from '@/api/question/asking.type'
import {
  UPDATE_GLOBAL_DIALOG,
  OPEN_GLOBAL_DIALOG,
} from '@/store/global/global.type'
import {
  UPDATE_QUESTION_DATA,
  FETCH_PAGE_DATA_AFTER_POST,
} from '@/store/question/question.type'
import { UPDATE_PAGE_META } from '@/store/seo/seo.type'
import { GlobalDialogContent } from '@/store/global/index'
import { QuestionVuexState } from '@/views/question/page/Index.vue'
import {
  IsUserSuspectDialogContent,
  IsDuplicatedPostDialogContent,
} from '@/config/question-asking-dialog-info'
import { Option as SelectOption } from '@/components/my83-ui-kit/input/BaseSelect.vue'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'
import UserMetaMixin, {
  ComponentInstance as UserMetaMixinComponentInstance,
} from '@/mixins/user/user-meta'
import { Validator, ValidateMessage } from '@/services/validator/Validator'

// 單位：MB
const MAX_IMAGE_PAYLOAD_SIZE_LIMIT = 20

const options: ComponentOption = {
  components: {
    BaseCard,
    BaseButton,
    BaseInputMessage,
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
    initContent: {
      type: Object as PropType<Props['initContent']>,
      default: () => {},
    },
  },
  data() {
    return {
      isMounted: false,
      isEditContentUpdated: false,
      editPostImages: [],
      uploadImageInitId: 0,
      form: null,
      errors: {},
      submitErrMsg: '',
      submitState: '',
    }
  },
  computed: {
    editPostPreviewImages() {
      return _.isArray((this.form as QuestionFormData).removeImages)
        ? _.filter(
            this.editPostImages,
            (image) =>
              !_.includes(
                (this.form as QuestionFormData).removeImages,
                image.src
              )
          )
        : this.editPostImages
    },
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
      const expandAllPanel = this.questionForm.formType === 'edit'

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
                isExpanded: expandAllPanel || option.isOpen,
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
                isExpanded: expandAllPanel || option.isOpen,
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
    formErrMsg() {
      if (this.errors.payload) {
        return this.errors.payload.message
      } else if (
        this.errors.googleReCaptcha &&
        _.keys(this.errors).length === 1
      ) {
        return this.errors.googleReCaptcha.message
      }
      return this.submitErrMsg
    },
  },
  methods: {
    setInitContent() {
      if (this.questionForm.formType === 'new') {
        /**
         * 新發問透過 query string 設定分類，
         * 需要觸發 watch，得以正確出現可選擇之分類
         */
        this.isEditContentUpdated = true
      }

      if (!_.isEmpty(this.initContent)) {
        this.form = this.questionForm.setInitContent(this.initContent)

        if ((this.initContent as EditQuestionContent).images) {
          this.editPostImages = (this
            .initContent as EditQuestionContent).images.map((image, index) => {
            return {
              id: index,
              src: image,
            }
          })
          this.uploadImageInitId = this.editPostImages.length
        }
      }

      this.$nextTick(() => {
        this.isEditContentUpdated = true
      })
    },
    removeEditPostImage(id: number) {
      if (typeof (this.form as QuestionFormData).removeImages === 'undefined') {
        ;(this.form as QuestionFormData).removeImages = []
      }

      const removeImage = this.editPostImages.find((image) => image.id === id)
      if (typeof removeImage === 'undefined') return
      ;(this.form as QuestionFormData).removeImages!.push(removeImage.src)
    },
    imageUploadValidate(msg: string) {
      if (msg) {
        this.$set(this.errors, 'images', {
          message: msg,
          state: 'error',
        })
      } else {
        this.$delete(this.errors, 'images')
      }
    },
    payloadSizeValidate(size: number) {
      if (size > MAX_IMAGE_PAYLOAD_SIZE_LIMIT) {
        this.$set(this.errors, 'payload', {
          message: '整份檔案超過尺寸限制，請再精簡一下喔！',
          state: 'error',
        })
      } else {
        this.$delete(this.errors, 'payload')
      }
    },
    async submit() {
      if (!this.form) return

      this.submitState = 'loading'

      this.form.googleReCaptcha = await this.getGoogleReCaptcha()
      if (!this.form.nickname && this.nickname) {
        this.form.nickname = this.nickname
      }
      this.form.images = (await this.$refs.uploadImageField.convert()) || []
      const validateResult = await this.validate(this.form)

      if (validateResult) {
        this.submitErrMsg = ''
        try {
          const { data, page_meta } = await this.questionForm.submit()
          this.$store.commit(`question/${UPDATE_QUESTION_DATA}`, data)
          this.$store.commit(`pageMeta/${UPDATE_PAGE_META}`, page_meta)
          await this.$store.dispatch(
            `question/${FETCH_PAGE_DATA_AFTER_POST}`,
            data.question_id
          )
          this.$router.push(`/question/${data.question_id}`)
        } catch (error) {
          this.submitErrorHandler(error)
        }
      }
      this.submitState = ''
    },
    submitErrorHandler(error: any) {
      const status = error.response.status
      const err = error.response.data as ErrorResponse
      if (status === 422) {
        const validateError: Partial<Record<
          keyof SubmitQuestionPayload,
          ValidateMessage
        >> = _.mapValues(err.data!.validator, (value) => {
          return {
            state: 'error',
            message: value[0],
          } as ValidateMessage
        })
        const convertValidateError: Partial<Record<
          keyof QuestionFormData,
          ValidateMessage
        >> = {
          title: validateError.title,
          content: validateError.content,
          purpose: validateError.purpose_tag_id,
          target: validateError.target_tag_id,
          insurance: validateError.insurance_type_tag_ids,
          nickname: validateError.nickname,
          images: validateError.images,
          googleReCaptcha: validateError.google_recaptcha,
        }
        this.$set(this, 'errors', convertValidateError)
      } else if (status === 413) {
        this.submitErrMsg = '整份檔案超過尺寸限制，請再精簡一下喔！'
      } else if (err.user_meta) {
        this.updateGlobalDialogContent({
          isSuspect: err.user_meta.is_suspect,
          isDuplicatedPost: err.user_meta.is_duplicated_post,
        })
        this.$store.dispatch(`global/${OPEN_GLOBAL_DIALOG}`)
      } else if (err.error_message) {
        this.submitErrMsg = err.error_message
      } else {
        this.submitErrMsg =
          '資料送出失敗，請再試一次。\n若問題持續發生，請聯繫客服。'
        console.error(error)
      }
    },
    updateGlobalDialogContent({ isSuspect, isDuplicatedPost }) {
      let payload = {}

      // @TODO: Change path after migrate to Nuxt.js
      if (isSuspect) {
        payload = {
          ...IsUserSuspectDialogContent,
          rightConfirmFn: () => {
            window.location.href = '/question'
          },
          closeFn: () => {
            window.location.href = '/question'
          },
        } as GlobalDialogContent
      } else if (isDuplicatedPost) {
        payload = {
          ...IsDuplicatedPostDialogContent,
        } as GlobalDialogContent
      }

      this.$store.dispatch(`global/${UPDATE_GLOBAL_DIALOG}`, payload)
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
        const result = await this.validator.validateAll(form)
        this.$set(this, 'errors', {
          images: this.errors.images,
          payload: this.errors.payload,
          ...result,
        })
      } catch (error) {
        this.$set(this, 'errors', {
          images: this.errors.images,
          payload: this.errors.payload,
          ...error,
        })
      }

      if (typeof this.errors.images === 'undefined') {
        this.$delete(this.errors, 'images')
      }

      if (typeof this.errors.payload === 'undefined') {
        this.$delete(this.errors, 'payload')
      }

      return !_.keys(this.errors).length
    },
  },
  watch: {
    'form.purpose'(val) {
      // 避免透過 query string 送過來的 purpose_tag_id 不合法
      if (
        this.form &&
        typeof _.find(this.purposeOption, ['value', val]) === 'undefined'
      ) {
        this.form.purpose = 0
        return
      }

      if (!this.isEditContentUpdated) return

      if (this.form) {
        // 0: 尚未選擇, -1: 無選項可以選擇
        this.form.target = val && !this.targetOption.length ? -1 : 0
        this.form.insurance = []
      }
    },
    'form.target'() {
      if (!this.isEditContentUpdated) return

      if (this.form) {
        this.form.insurance = []
      }
    },
    formOption() {
      this.setInitContent()
    },
  },
  created() {
    const { id } = this.$route.params
    const formType = id ? 'edit' : 'new'

    this.questionForm = new QuestionFromService(formType)
    this.form = this.questionForm.form
  },
  async mounted() {
    this.isMounted = true
    this.validator = new Validator(this.questionForm.validateRule)
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
  questionForm: QuestionFromService
  validator: Validator<QuestionFormData>
  $refs: {
    uploadImageField: AskingFormUploadImageFieldComponentInstance
  }
  $store: Store<QuestionVuexState>
}

export interface Data {
  isMounted: boolean
  isEditContentUpdated: boolean
  editPostImages: PreviewImage[]
  uploadImageInitId: number
  form: QuestionFormData | null
  errors: Partial<Record<keyof QuestionFormData | 'payload', ValidateMessage>>
  submitErrMsg: string
  submitState: string
}

export interface Methods {
  setInitContent(): void
  removeEditPostImage(id: number): void
  imageUploadValidate(msg: string): void
  payloadSizeValidate(size: number): void
  submit(): void
  submitErrorHandler(error: any): void
  updateGlobalDialogContent(payload: {
    isSuspect?: boolean
    isDuplicatedPost?: boolean
  }): void
  getGoogleReCaptcha(): Promise<string>
  validate(form: QuestionFormData): Promise<boolean>
}

export interface Computed {
  editPostPreviewImages: PreviewImage[]
  targetOptionPlaceholder: string
  purposeOption: SelectOption[]
  targetOption: SelectOption[]
  insuranceOption: InsuranceOption['options']
  buttonSize: 'xl' | 'l-b'
  formErrMsg: string
}

export interface Props {
  formOption: TransformFormOption
  initContent: EditQuestionContent | {}
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

    &.nickname {
      @include max-media('xl') {
        width: 220px;
      }
    }
  }

  &__row {
    display: flex;
    justify-content: center;
    margin-top: 70px;
  }
}
</style>
