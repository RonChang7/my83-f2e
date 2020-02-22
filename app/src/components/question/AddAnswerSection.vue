<template>
  <div
    class="AddAnswerSection"
    :class="{
      openEditor: openEditor && editorIsLoaded,
      sales: userRole === 'sales',
    }"
  >
    <transition mode="out-in">
      <BaseButton
        v-if="!openEditor & editorIsLoaded"
        size="xl"
        @click.native="panelDisplayHandler(true)"
      >
        我要留言
      </BaseButton>
      <AnswerEditor
        v-else
        :avatar="avatar"
        :nickname="nickname"
        :user-role="userRole"
        :question-id="questionId"
        @is-loaded="editorIsLoaded = true"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { AvatarMap } from './helpers/reply-default-avatar'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import { User, Role } from '@/services/user/user'
import { State as HeaderState } from '@/store/header/index'
import { State } from '@/store/question/index'
import {
  OPEN_LOGIN_PANEL,
  UPDATE_AFTER_LOGIN_EVENT,
} from '@/store/global/global.type'
const AnswerEditor = () => import('./answer/AnswerEditor.vue')

const UserRole = User.role

export default {
  components: {
    BaseButton,
    AnswerEditor,
  },
  data() {
    return {
      openEditor: false,
      avatar: AvatarMap[UserRole],
      editorIsLoaded: false,
      userRole: User.role,
    }
  },
  methods: {
    isLogin() {
      return User.role !== 'guest'
    },
    showLoginPanel() {
      this.$store.dispatch(`global/${OPEN_LOGIN_PANEL}`, 'login')
      this.$store.dispatch(`global/${UPDATE_AFTER_LOGIN_EVENT}`, () => {
        window.location.reload()
      })
    },
    panelDisplayHandler(status) {
      if (status && !this.isLogin()) {
        this.showLoginPanel()
        return
      }

      this.openEditor = status
    },
  },
  computed: {
    nickname() {
      const { headerPersonalized } = this.$store.state.header as HeaderState
      return headerPersonalized ? headerPersonalized.personalize.nickname : ''
    },
    questionId() {
      const { question } = this.$store.state.question as State
      return question ? question.question_id : 0
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
  openEditor: boolean
  avatar: string
  editorIsLoaded: boolean
  userRole: Role
}

export interface Methods {
  isLogin: () => boolean
  showLoginPanel: () => void
  panelDisplayHandler: (status: boolean) => void
}

export interface Computed {
  nickname: string
  questionId: number
}

export interface Props {}
</script>

<style lang="scss" scoped>
.AddAnswerSection {
  display: flex;
  justify-content: center;
  margin: 20px 0;

  &.openEditor,
  &.sales {
    margin-top: 0;
  }
}
</style>
