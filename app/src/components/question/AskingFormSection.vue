<template>
  <BaseCard class="AskingFormSection">
    <AskingFormSelectField
      class="AskingFormSection__field restrict"
      title="發問目的"
      :required="true"
      :value.sync="form.purpose"
      :options="purposeOption"
      :disabled="!purposeOption.length"
    />
    <AskingFormSelectField
      class="AskingFormSection__field restrict"
      title="投保對象"
      :required="true"
      :placeholder="targetOptionPlaceholder"
      :value.sync="form.target"
      :options="targetOption"
      :disabled="!targetOption.length"
    />
    <AskingFormInputField
      class="AskingFormSection__field"
      title="標題"
      :required="true"
      :value.sync="form.title"
      placeholder="範例：32歲 男 保單健檢及規劃"
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
    />
    <AskingFormUploadImageField
      class="AskingFormSection__field"
      title="保單照片"
    />
    <!-- <AskingFormTagSelectField
      class="AskingFormSection__field"
      title="標籤"
      :required="true"
    /> -->
    <AskingFormInputField
      class="AskingFormSection__field restrict"
      title="暱稱"
      :required="true"
      :value.sync="form.nickname"
      placeholder="設定你的暱稱"
      legend="暱稱設定後不可修改"
    />
  </BaseCard>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import AskingFormInputField from './asking/AskingFormInputField.vue'
import AskingFormTextareaField from './asking/AskingFormTextareaField.vue'
import AskingFormSelectField from './asking/AskingFormSelectField.vue'
import AskingFormUploadImageField from './asking/AskingFormUploadImageField.vue'
import AskingFormTagSelectField from './asking/AskingFormTagSelectField.vue'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import {
  PostDataFactory,
  QuestionPostData,
} from '@/services/question/PostDataFactory'
import { transformFormOption } from '@/views/question/asking/AskingPage.vue'
import { Option as SelectOption } from '@/components/my83-ui-kit/input/BaseSelect.vue'

const QuestionFormData = new PostDataFactory('question')

const options: ComponentOption = {
  components: {
    BaseCard,
    AskingFormInputField,
    AskingFormTextareaField,
    AskingFormSelectField,
    AskingFormUploadImageField,
    AskingFormTagSelectField,
  },
  props: {
    formOption: {
      type: Object as PropType<Props['formOption']>,
      required: true,
    },
  },
  data() {
    return {
      form: null,
      error: {},
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
  },
  watch: {
    'form.purpose'() {
      if (this.form) {
        this.form.target = 0
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
    this.form = QuestionFormData.form as QuestionPostData
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

export interface Instance extends Vue {}

export interface Data {
  form: QuestionPostData | null
  error: Partial<Record<keyof QuestionPostData, Record<string, any>>>
}

export interface Methods {}

export interface Computed {
  targetOptionPlaceholder: string
  purposeOption: SelectOption[]
  targetOption: SelectOption[]
}

export interface Props {
  formOption: transformFormOption
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/rwd.scss';

.AskingFormSection {
  padding: 40px 0;

  &__field {
    margin-bottom: 40px;

    &.restrict {
      width: 250px;

      @include max-media('xl') {
        width: 100%;
      }
    }
  }
}
</style>
