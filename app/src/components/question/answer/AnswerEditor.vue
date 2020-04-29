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
      <BaseInputErrorMessage :msg="errMsg" text-align="right" class="mr-4" />
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
    <div v-if="userRole === 'sales'" class="AnswerEditor__function">
      <BaseCheckbox :checked.sync="acceptRule" label="我同意遵守版規" />
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
import BaseRickTextEditor from '../base/BaseRickTextEditor.vue'
import { CancelAnswerDialogContent } from './cancel-answer-dialog-info'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseInputErrorMessage from '@/components/my83-ui-kit/input/BaseInputErrorMessage.vue'
import { ADD_ANSWER } from '@/store/question/question.type'
import { GlobalDialogContent } from '@/store/global/index'
import { FETCH_HEADER_PERSONALIZED_DATA } from '@/store/header/header.type'
import {
  OPEN_GLOBAL_DIALOG,
  UPDATE_GLOBAL_DIALOG,
} from '@/store/global/global.type'
import {
  PostDataFactory,
  AnswerPostData,
} from '@/services/question/PostDataFactory'
import { AddAnswerResponse } from '@/api/question/question.type'
import { scrollTo } from '@/utils/element'
import { nl2br, br2nl } from '@/utils/text-parser'
import { UserRole } from '@/services/user/user'
const BaseCheckbox = () =>
  import('@/components/my83-ui-kit/input/BaseCheckbox.vue')
const BaseInputText = () =>
  import('@/components/my83-ui-kit/input/BaseInputText.vue')
const AnswerSalesRule = () => import('./AnswerSalesRule.vue')

const AnswerFormData = new PostDataFactory('answer')

export default {
  components: {
    BaseInputText,
    BaseRickTextEditor,
    BaseButton,
    BaseCheckbox,
    BaseInputErrorMessage,
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
      form: AnswerFormData.form,
      errMsg: '',
      submitState: '',
      acceptRule: false,
      nicknameError: false,
    }
  },
  methods: {
    paste() {
      this.errMsg = '請檢查從外部貼上的文字，確認格式正常再送出喔！'
    },
    validate() {
      if (this.userRole === 'sales' && !this.acceptRule) {
        this.errMsg = '請同意遵守版規'
        return false
      }
      this.errMsg = ''
      return true
    },
    async submit() {
      if (!this.validate()) return

      const payload = {
        questionId: this.questionId,
        nickname: this.nickname ? this.nickname : this.form.nickname,
        content: this.contentTransform(this.form.content),
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
      AnswerFormData.reset()
      this.acceptRule = false
      this.form = AnswerFormData.form as AnswerPostData
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
    contentTransform(content: string) {
      return nl2br(br2nl(content.replace(/&nbsp;/g, ' ')).trim())
    },
  },
  computed: {
    disableSubmit() {
      const nickname = this.nickname || this.form.nickname
      return !(nickname && this.contentTransform(this.form.content))
    },
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

export interface Instance extends Vue {}

export interface Data {
  form: AnswerPostData
  errMsg: string
  submitState: string
  acceptRule: boolean
  nicknameError: boolean
}

export interface Methods {
  paste(): void
  validate(): boolean
  submit(): void
  reset(): void
  cancel(): void
  scrollToNewPost(id: number): void
  contentTransform(content: string): string
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
    margin-top: 10px;

    > button {
      white-space: nowrap;
    }

    > button:not(:last-child) {
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
