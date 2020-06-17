<template>
  <div class="AnswerEditor">
    <div class="AnswerEditor__header">
      <img class="AnswerEditor__avatar" :src="avatar" />
      <div
        class="AnswerEditor__nickname"
        :class="{ AnswerEditor__nickname__input: !nickname }"
      >
        <template v-if="nickname">
          {{ nickname }}
        </template>
        <BaseInputText
          v-else
          placeholder="設定你的暱稱"
          :value.sync="form.nickname"
          :state="nicknameError ? 'error' : ''"
        />
        <div v-if="!nickname" class="AnswerEditor__nickname__inputInfo">
          暱稱設定後不可修改
        </div>
      </div>
    </div>
    <div class="AnswerEditor__content">
      <BaseRickTextEditor :content.sync="form.content" @paste="paste" />
    </div>
    <div class="AnswerEditor__function">
      <BaseButton size="m" type="secondary" @click.native="cancel">
        取消
      </BaseButton>
      <BaseButton
        size="m"
        :is-disabled="disableSubmit"
        :state="submitState"
        @click.native="submit"
      >
        留言
      </BaseButton>
    </div>
    <BaseInputMessage :msg="errMsg" text-align="right" />
    <div v-if="userRole === 'sales'" class="AnswerEditor__function">
      <BaseCheckbox :checked.sync="form.acceptRule" label="我同意遵守版規" />
    </div>
    <div v-if="userRole === 'sales'" class="AnswerEditor__rule">
      <AnswerSalesRule />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { CancelAnswerDialogContent } from './cancel-answer-dialog-info'
import BaseRickTextEditor from '@/components/my83-ui-kit/editor/BaseRickTextEditor.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'
import { ADD_ANSWER } from '@/store/question/question.type'
import { GlobalDialogContent } from '@/store/global/index'
import { FETCH_HEADER_PERSONALIZED_DATA } from '@/store/header/header.type'
import {
  OPEN_GLOBAL_DIALOG,
  UPDATE_GLOBAL_DIALOG,
} from '@/store/global/global.type'
import {
  AnswerFormService,
  AnswerFormData,
} from '@/services/question/form/AnswerFormService'
import { AddAnswerResponse } from '@/api/question/question.type'
import { scrollTo } from '@/utils/element'
import { htmlStrip } from '@/utils/text-parser'
import { UserRole } from '@/services/user/user'
const BaseCheckbox = () =>
  import('@/components/my83-ui-kit/input/BaseCheckbox.vue')
const BaseInputText = () =>
  import('@/components/my83-ui-kit/input/BaseInputText.vue')
const AnswerSalesRule = () => import('./AnswerSalesRule.vue')

export default {
  components: {
    BaseInputText,
    BaseRickTextEditor,
    BaseButton,
    BaseCheckbox,
    BaseInputMessage,
    AnswerSalesRule,
  },
  props: {
    avatar: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    questionId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      form: null,
      errMsg: '',
      submitState: '',
      nicknameError: false,
    }
  },
  methods: {
    paste() {
      this.errMsg = '請檢查從外部貼上的文字，確認格式正常再送出喔！'
    },
    validate() {
      const result = this.answerForm.validate()
      this.errMsg = this.answerForm.errorMessage
      return result
    },
    async submit() {
      if (!this.validate()) return

      const payload = {
        questionId: this.questionId,
        nickname: this.nickname ? this.nickname : this.form.nickname,
        content: this.form.content,
      }

      this.submitState = 'loading'

      const response = await this.$store.dispatch(
        `question/${ADD_ANSWER}`,
        payload
      )

      if (typeof response === 'number') {
        this.$emit('close')

        // Scroll to new post after answer editor closed
        setTimeout(() => {
          this.scrollToNewPost(response)
        }, 200)

        if (!this.nickname) {
          this.$store.dispatch(`header/${FETCH_HEADER_PERSONALIZED_DATA}`)
        }
      } else {
        const { success, message } = response as AddAnswerResponse
        this.errMsg = success ? '' : message

        if (this.errMsg === '此匿名已被使用') {
          this.nicknameError = true
        }
      }

      this.submitState = ''
    },
    reset() {
      this.answerForm.reset()
      this.form = this.answerForm.form
    },
    cancel() {
      if (this.form.content.length) {
        const payload: GlobalDialogContent = {
          ...CancelAnswerDialogContent,
          rightConfirmFn: () => this.$emit('close'),
        }

        this.$store.dispatch(`global/${UPDATE_GLOBAL_DIALOG}`, payload)
        this.$store.dispatch(`global/${OPEN_GLOBAL_DIALOG}`)
        return
      }

      this.$emit('close')
    },
    scrollToNewPost(id) {
      const el = document.querySelector(`#answer-${id}`) as HTMLElement
      el && scrollTo(el, window)
    },
    isContentEmpty(content: string) {
      /**
       * 移除 HTML tag
       * 移除換行
       * 移除空白
       */
      return !!htmlStrip(content)
        .replace(/\n|\r\n?/g, '')
        .replace(/&nbsp;/g, '')
        .trim()
    },
  },
  computed: {
    disableSubmit() {
      const nickname = this.nickname || this.form.nickname
      return !(nickname && this.isContentEmpty(this.form.content))
    },
  },
  created() {
    this.answerForm = new AnswerFormService(this.userRole)
    this.form = this.answerForm.form
  },
  mounted() {
    this.reset()
    this.$emit('is-loaded')
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

export interface Instance extends Vue {
  answerForm: AnswerFormService
}

export interface Data {
  form: AnswerFormData
  errMsg: string
  submitState: string
  nicknameError: boolean
}

export interface Methods {
  paste(): void
  validate(): boolean
  submit(): void
  reset(): void
  cancel(): void
  scrollToNewPost(id: number): void
  isContentEmpty(content: string): boolean
}

export interface Computed {
  disableSubmit: boolean
}

export interface Props {
  avatar: string
  nickname: string
  userRole: UserRole
  questionId: number
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.AnswerEditor {
  @include card-primary;
  width: 100%;
  padding: 30px;

  @include max-media('xl') {
    padding: 20px;
  }

  &__header {
    display: flex;
  }

  &__content,
  &__rule {
    margin-top: 10px;
  }

  &__function {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
    padding-bottom: 10px;

    > [type='button'] {
      white-space: nowrap;
    }

    > [type='button']:not(:last-child) {
      margin-right: 10px;
    }
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }

  &__nickname {
    display: flex;
    justify-content: center;
    flex-direction: column;
    color: $gray-primary;

    &__input {
      width: 220px;
    }

    &__inputInfo {
      font-size: 0.875rem;
      color: $gray-secondary;
      margin-top: 4px;
    }
  }
}
</style>
