<template>
  <div class="ResponseEditor" :class="{ hasResponse }">
    <template v-if="activePanel">
      <div class="ResponseEditor__header">
        <img class="ResponseEditor__avatar" :src="avatar" />
        <div
          class="ResponseEditor__nickname"
          :class="{ ResponseEditor__nickname__input: !nickname }"
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
          <div v-if="!nickname" class="ResponseEditor__nickname__inputInfo">
            暱稱設定後不可修改
          </div>
        </div>
      </div>
      <div class="ResponseEditor__content">
        <BaseInputTextarea
          ref="textarea"
          :value.sync="form.content"
          placeholder="回覆..."
          height="60px"
          :auto-grow="true"
          :auto-grow-max-height="200"
          @blur="focusHandler(false)"
        />
      </div>
      <div class="ResponseEditor__function">
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
    </template>
    <div v-else class="ResponseEditor__placeholder">
      <BaseInputText
        :value.sync="form.content"
        placeholder="回覆..."
        @focus="activePanelHandler(true)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { CancelResponseDialogContent } from './cancel-response-dialog-info'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseInputTextarea from '@/components/my83-ui-kit/input/BaseInputTextarea.vue'
import BaseInputText from '@/components/my83-ui-kit/input/BaseInputText.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'
import { AddResponseResponse } from '@/api/question/question.type'
import { ADD_RESPONSE } from '@/store/question/question.type'
import { GlobalDialogContent } from '@/store/global/index'
import { FETCH_HEADER_PERSONALIZED_DATA } from '@/store/header/header.type'
import {
  OPEN_LOGIN_PANEL,
  UPDATE_AFTER_LOGIN_EVENT,
  OPEN_GLOBAL_DIALOG,
  UPDATE_GLOBAL_DIALOG,
} from '@/store/global/global.type'
import {
  ResponseFormService,
  ResponseFormData,
} from '@/services/question/form/ResponseFormService'
import { scrollToElement } from '@/utils/scroll'
import { nl2br } from '@/utils/text-parser'
import { User } from '@/services/user/user'

const user = User.getInstance()

export default {
  components: {
    BaseInputText,
    BaseInputTextarea,
    BaseButton,
    BaseInputMessage,
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
    hasResponse: {
      type: Boolean,
      required: true,
    },
    activePanel: {
      type: Boolean,
      required: true,
    },
    isFocus: {
      type: Boolean,
      default: false,
    },
    questionId: {
      type: Number,
      required: true,
    },
    answerId: {
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
    showLoginPanel() {
      this.$store.dispatch(`global/${OPEN_LOGIN_PANEL}`, 'login')
      this.$store.dispatch(`global/${UPDATE_AFTER_LOGIN_EVENT}`, () => {
        window.location.reload()
      })
    },
    closePanel() {
      this.$emit('close-editor')
    },
    activePanelHandler(status) {
      if (status && !user.isLogin()) {
        this.showLoginPanel()
        return
      }

      this.$emit('update:activePanel', status)
    },
    async submit() {
      const payload = {
        questionId: this.questionId,
        answerId: this.answerId,
        nickname: this.nickname ? this.nickname : this.form?.nickname,
        content: nl2br(this.form!.content.trim()), // @TODO: 相容舊版，所以新增 response 要補上 <br />
      }

      this.submitState = 'loading'

      const response = await this.$store.dispatch(
        `question/${ADD_RESPONSE}`,
        payload
      )

      if (typeof response === 'number') {
        this.$nextTick(() => {
          this.scrollToNewPost(response)
        })

        if (!this.nickname) {
          this.$store.dispatch(`header/${FETCH_HEADER_PERSONALIZED_DATA}`)
        }

        this.reset()
      } else {
        const { success, message } = response as AddResponseResponse
        this.errMsg = success ? '' : message

        if (this.errMsg === '此匿名已被使用') {
          this.nicknameError = true
        }
      }

      this.submitState = ''
    },
    reset() {
      this.responseForm.reset()
      this.form = this.responseForm.form
      this.errMsg = ''
      this.activePanelHandler(false)
    },
    cancel() {
      if (this.form?.content.length) {
        const payload: GlobalDialogContent = {
          ...CancelResponseDialogContent,
          rightConfirmFn: () => this.reset(),
        }

        this.$store.dispatch(`global/${UPDATE_GLOBAL_DIALOG}`, payload)
        this.$store.dispatch(`global/${OPEN_GLOBAL_DIALOG}`)
        return
      }

      this.reset()
    },
    scrollToNewPost(id) {
      const el = document.querySelector(`#response-${id}`) as HTMLElement
      el &&
        scrollToElement({
          el,
          vertical: true,
        })
    },
    focusHandler(status) {
      this.$emit('update:isFocus', status)
    },
    autoFocusHelper() {
      this.$nextTick(() => {
        this.$refs.textarea.$el.querySelector('textarea')!.focus()
      })
    },
  },
  computed: {
    disableSubmit() {
      const nickname = this.nickname || this.form?.nickname
      return !(nickname && this.form?.content.trim())
    },
  },
  watch: {
    activePanel: {
      immediate: true,
      handler(val) {
        if (val) {
          this.autoFocusHelper()
        }
      },
    },
    isFocus: {
      immediate: true,
      handler(val) {
        if (val) {
          this.autoFocusHelper()
        }
      },
    },
  },
  created() {
    this.responseForm = new ResponseFormService()
    this.form = this.responseForm.form
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
  responseForm: ResponseFormService
  $refs: {
    textarea: Vue
  }
}

export interface Data {
  form: ResponseFormData | null
  errMsg: string
  submitState: string
  nicknameError: boolean
}

export type Methods = {
  showLoginPanel(): void
  closePanel(): void
  activePanelHandler(status: boolean): void
  submit(): void
  reset(): void
  cancel(): void
  scrollToNewPost(id: number): void
  autoFocusHelper(): void
  focusHandler(status: boolean): void
}

export interface Computed {
  disableSubmit: boolean
}

export interface Props {
  avatar: string
  nickname: string
  hasResponse: boolean
  activePanel: boolean
  isFocus: boolean
  questionId: number
  answerId: number
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ResponseEditor {
  padding: 16px 0;
  border-top: 1px solid $gray-quaternary;
  font-size: 0.875rem;

  @include max-media('xl') {
    padding: 12px 0;
  }

  &.hasResponse {
    margin-left: 30px;
  }

  &__header {
    display: flex;
  }

  &__content {
    margin-top: 10px;
  }

  &__function {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;

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
