<template>
  <div class="AddAnswerSection" :class="{ openEditor }">
    <BaseButton
      v-if="!openEditor"
      size="l-b"
      @click.native="panelDisplayHandler(true)"
    >
      我要留言
    </BaseButton>
    <AnswerEditor
      v-else
      :avatar="avatar"
      :nickname="nickname"
      @close-editor="panelDisplayHandler(false)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import { User } from '@/services/user/user'
import { State } from '@/store/header/index'
const AnswerEditor = () => import('./answer/AnswerEditor.vue')

const UserRole = User.role
const AvatarMap = {
  sales: '/images/avatar/sales_girl4.png',
  client: '/images/avatar/client_girl1.png',
  admin: '/images/avatar/client_girl1.png',
}

export default {
  components: {
    BaseButton,
    AnswerEditor,
  },
  data() {
    return {
      openEditor: false,
      avatar: AvatarMap[UserRole],
    }
  },
  methods: {
    panelDisplayHandler(status) {
      this.openEditor = status
    },
  },
  computed: {
    nickname() {
      const { headerPersonalized } = this.$store.state.header as State
      return headerPersonalized ? headerPersonalized.personalize.nickname : ''
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
}

export interface Methods {
  panelDisplayHandler: (boolean) => void
}

export interface Computed {}

export interface Props {}
</script>

<style lang="scss" scoped>
.AddAnswerSection {
  display: flex;
  justify-content: center;
  padding: 20px 0 80px;

  &.openEditor {
    padding: 0;
  }
}
</style>
