<template>
  <BaseModal :visible="visible" :lock-scroll="true" @close="closePanel">
    <div class="ReportPanel">
      <BaseClose class="ReportPanel__close" @click.native="closePanel" />
      <div class="ReportPanel__title">
        檢舉
      </div>
      <div class="ReportPanel__description">
        除了向 MY83
        檢舉，您也可試試「訴諸社群的力量」，若您認為此留言有問題，直接留言說明此留言不正確之處，提醒其他人，也讓您的論點得到更多人支持。
      </div>
      <div class="ReportPanel__form">
        <div class="ReportPanel__reason">
          <span class="mr-3">檢舉原因</span>
          <BaseSelect
            class="dropdown"
            :options="dropdownOptions"
            :value.sync="form.reason"
            placeholder="請選擇範例"
          />
        </div>
        <div class="ReportPanel__comment">
          <BaseInputTextarea
            :value.sync="form.comment"
            height="100px"
            placeholder="說明原因"
            :state="errors.comment ? errors.comment.state : ''"
          />
          <BaseInputErrorMessage
            :msg="errors.comment ? errors.comment.message : ''"
          />
        </div>
      </div>
      <div class="ReportPanel__function">
        <BaseButton
          :size="buttonSize"
          type="secondary"
          :is-full-width="true"
          @click.native="closePanel"
        >
          取消
        </BaseButton>
        <BaseButton
          :size="buttonSize"
          :is-full-width="true"
          :state="state"
          @click.native="submit"
        >
          送出
        </BaseButton>
      </div>
      <BaseInputErrorMessage
        :msg="errors.submit ? errors.submit.message : ''"
        text-align="center"
      />
    </div>
  </BaseModal>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseModal from '@/components/base/modal/BaseModal.vue'
import BaseClose from '@/components/base/icon/24/BaseClose.vue'
import BaseSelect, {
  Option,
} from '@/components/my83-ui-kit/input/BaseSelect.vue'
import BaseInputTextarea from '@/components/my83-ui-kit/input/BaseInputTextarea.vue'
import BaseButton, {
  Props as BaseButtonProps,
} from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseInputErrorMessage from '@/components/my83-ui-kit/input/BaseInputErrorMessage.vue'
import { CLOSE_REPORT_PANEL, ADD_REPORT } from '@/store/question/question.type'
import { SimpleResponse } from '@/api/type'
import DeviceMixin, {
  Computed as DeviceMixinComputed,
} from '@/mixins/device/device-mixins'

export const enum ValidateState {
  Success = 'success',
  Error = 'error',
}

export default {
  mixins: [DeviceMixin],
  components: {
    BaseModal,
    BaseClose,
    BaseSelect,
    BaseButton,
    BaseInputTextarea,
    BaseInputErrorMessage,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        comment: '',
        reason: '',
      },
      errors: {},
      dropdownOptions: [
        {
          text: '非保險相關討論',
          value: 'related',
        },
        {
          text: '提及聯絡方式',
          value: 'contact',
        },
        {
          text: '其他',
          value: 'other',
        },
      ],
      state: '',
    }
  },
  computed: {
    buttonSize() {
      return this.isDesktop ? 'xl' : 'l-a'
    },
  },
  methods: {
    closePanel() {
      this.$store.dispatch(`question/${CLOSE_REPORT_PANEL}`)
    },
    validate() {
      const result = {
        state: '',
        message: '',
      }

      if (!this.form.comment.length) {
        result.state = ValidateState.Error
        result.message = '請說明檢舉原因'
      } else {
        result.state = ValidateState.Success
      }

      this.$set(this.errors, 'comment', result)

      return result.state === 'success'
    },
    async submit() {
      if (!this.validate()) return

      this.state = 'loading'
      const result = await this.$store.dispatch(
        `question/${ADD_REPORT}`,
        this.form.comment
      )

      if (typeof result === 'boolean' && result) {
        this.closePanel()
      } else {
        this.$set(this.errors, 'submit', {
          state: ValidateState.Error,
          message: (result as SimpleResponse).message,
        })
      }

      this.state = ''
    },
  },
  watch: {
    'form.reason'(val) {
      const option = this.dropdownOptions.find((option) => option.value === val)

      if (option) {
        this.form.comment =
          option.value !== 'other' ? option.text : this.form.comment
      }
    },
  },
} as ComponentOption

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
  form: Form
  errors: Errors<Form>
  dropdownOptions: Option[]
  state: string
}

export interface Methods {
  closePanel(): void
  validate(): boolean
  submit(): void
}

export interface Computed extends DeviceMixinComputed {
  buttonSize: BaseButtonProps['size']
}

export interface Props {
  visible: boolean
}

type Errors<T> = {
  [P in keyof T]: ValidateMessage
}

interface Form {
  comment: string
  reason: string
}

export interface ValidateMessage {
  state: ValidateState
  message: string
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ReportPanel {
  @include card-primary;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 482px;
  color: $gray-primary;
  padding: 40px;

  @include max-media('md') {
    width: calc(100vw - 24px);
    padding: 30px;
  }

  &__close {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
  }

  &__title {
    font-size: 1.375rem;
    font-weight: 500;
    margin-bottom: 20px;
    text-align: center;
  }

  &__description {
    margin-bottom: 20px;
    text-align: center;
  }

  &__reason {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .dropdown {
      flex: 1 1 auto;
    }
  }

  &__comment {
    margin-bottom: 40px;

    @include max-media('md') {
      margin-bottom: 30px;
    }

    &::v-deep textarea {
      font-size: 0.875rem;
    }
  }

  &__function {
    display: flex;

    > button:not(:last-child) {
      margin-right: 14px;
    }
  }
}
</style>
