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
        v-if="!openEditor"
        :size="addAnswerButtonSize"
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
        @close="panelDisplayHandler(false)"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { AvatarMap } from './helpers/reply-default-avatar'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import { User, UserRole } from '@/services/user/user'
import { QuestionVuexState } from '@/views/question/page/Index.vue'
import {
  OPEN_LOGIN_PANEL,
  UPDATE_AFTER_LOGIN_EVENT,
} from '@/store/global/global.type'
import DeviceMixin, {
  Computed as DeviceMixinComputed,
} from '@/mixins/device/device-mixins'
const AnswerEditor = () => import('./answer/AnswerEditor.vue')
const user = User.getInstance()

export default {
  mixins: [DeviceMixin],
  components: {
    BaseButton,
    AnswerEditor,
  },
  data() {
    return {
      openEditor: false,
      editorIsLoaded: false,
    }
  },
  methods: {
    showLoginPanel() {
      this.$store.dispatch(`global/${OPEN_LOGIN_PANEL}`, 'login')
      this.$store.dispatch(`global/${UPDATE_AFTER_LOGIN_EVENT}`, () => {
        window.location.reload()
      })
    },
    panelDisplayHandler(status) {
      if (status && !user.isLogin()) {
        this.showLoginPanel()
        return
      }

      this.openEditor = status
    },
  },
  computed: {
    nickname() {
      return (
        this.$store.state.header.headerPersonalized?.personalize.nickname || ''
      )
    },
    questionId() {
      return this.$store.state.question.question?.question_id
    },
    addAnswerButtonSize() {
      return this.isDesktop ? 'xl' : 'l-b'
    },
    userRole() {
      return (
        this.$store.state.header.headerPersonalized?.personalize.role || 'guest'
      )
    },
    avatar() {
      return this.userRole ? AvatarMap[this.userRole] : ''
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

export interface Instance extends Vue {
  $store: Store<QuestionVuexState>
}

export interface Data {
  openEditor: boolean
  editorIsLoaded: boolean
}

export interface Methods {
  showLoginPanel(): void
  panelDisplayHandler(status: boolean): void
}

export interface Computed extends DeviceMixinComputed {
  nickname: string
  questionId: number
  addAnswerButtonSize: string
  userRole: UserRole
  avatar: string
}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/rwd.scss';

.AddAnswerSection {
  display: flex;
  justify-content: center;
  margin: 20px 0;

  @include max-media('xl') {
    margin: 10px 0;
  }

  &.openEditor,
  &.sales {
    margin-top: 0;

    @include max-media('xl') {
      &.sales,
      &.openEditor {
        margin: 10px 0 20px;
      }
    }
  }
}
</style>
