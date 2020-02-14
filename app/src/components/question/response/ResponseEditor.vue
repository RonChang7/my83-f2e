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
          />
          <div class="ResponseEditor__nickname__inputInfo">
            暱稱設定後不可修改
          </div>
        </div>
      </div>
      <div class="ResponseEditor__content">
        <BaseInputTextarea
          ref="textarea"
          :value.sync="form.content"
          placeholder="回覆..."
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
          @click.native="submit"
        >
          留言
        </BaseButton>
      </div>
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
import _ from 'lodash'
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseInputTextarea from '@/components/my83-ui-kit/input/BaseInputTextarea.vue'
import BaseInputText from '@/components/my83-ui-kit/input/BaseInputText.vue'

const FormDefault = {
  nickname: '',
  content: '',
}

export default {
  components: {
    BaseInputText,
    BaseInputTextarea,
    BaseButton,
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
  },
  data() {
    return {
      form: _.cloneDeep(FormDefault),
    }
  },
  methods: {
    closePanel() {
      this.$emit('close-editor')
    },
    activePanelHandler(status) {
      this.$emit('update:activePanel', status)
    },
    submit() {},
    cancel() {
      this.form = _.cloneDeep(FormDefault)
      this.activePanelHandler(false)
    },
    focusHandler(status) {
      this.$emit('update:isFocus', status)
    },
    autoFocusHelper() {
      this.$nextTick(() => {
        ;(this.$refs.textarea as Vue).$el.querySelector('textarea')!.focus()
      })
    },
  },
  computed: {
    disableSubmit() {
      const nickname = this.nickname || this.form.nickname
      return !(nickname && this.form.content)
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
  form: {
    nickname: string
    content: string
  }
}

export interface Methods {
  closePanel: () => void
  activePanelHandler: (status: boolean) => void
  submit: () => void
  autoFocusHelper: () => void
  focusHandler: () => void
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

  &.hasResponse {
    margin-left: 30px;
  }

  &__header {
    display: flex;
  }

  &__content {
    margin-top: 10px;

    &::v-deep textarea {
      min-height: 60px;
      line-height: 1.5;
    }
  }

  &__function {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;

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
    &__input {
      width: 220px;
    }

    &__inputInfo {
      font-size: 0.875rem;
      color: $gray-secondary;
      line-height: 1.5;
      margin-top: 4px;
    }
  }
}
</style>
