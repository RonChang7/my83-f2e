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
        />
        <div class="AnswerEditor__nickname__inputInfo">暱稱設定後不可修改</div>
      </div>
    </div>
    <div class="AnswerEditor__content">
      <BaseRickTextEditor :content.sync="form.content" />
    </div>
    <div class="AnswerEditor__function">
      <BaseButton size="m" type="secondary" @click.native="cancel">
        取消
      </BaseButton>
      <BaseButton size="m" :is-disabled="disableSubmit" @click.native="submit">
        留言
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseRickTextEditor from '../base/BaseRickTextEditor.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
const BaseInputText = () =>
  import('@/components/my83-ui-kit/input/BaseInputText.vue')

const FormDefault = {
  nickname: '',
  content: '',
}

export default {
  components: {
    BaseInputText,
    BaseRickTextEditor,
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
    submit() {},
    cancel() {
      this.form = _.cloneDeep(FormDefault)
    },
  },
  computed: {
    disableSubmit() {
      const nickname = this.nickname || this.form.nickname
      return !(nickname && this.form.content)
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
  submit: () => void
}

export interface Computed {
  disableSubmit: boolean
}

export interface Props {
  avatar: string
  nickname: string
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

  &__header {
    display: flex;
  }

  &__content {
    margin-top: 10px;
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
