<template>
  <div v-if="options.length" class="QuestionDropdownPanel">
    <BaseDropdownOption
      v-for="(option, index) in options"
      :key="index"
      :text="option.title"
      @click="clickHandler(option.action)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseDropdownOption from '../base/BaseDropdownOption.vue'
import { QuestionVuexState } from '@/views/question/page/Index.vue'
import { Auth } from '@/services/auth/auth'
import {
  OPEN_LOGIN_PANEL,
  UPDATE_AFTER_LOGIN_EVENT,
} from '@/store/global/global.type'

const auth = Auth.getInstance()

export default {
  components: {
    BaseDropdownOption,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    showLoginPanel() {
      this.$store.dispatch(`global/${OPEN_LOGIN_PANEL}`, 'login')
      this.$store.dispatch(`global/${UPDATE_AFTER_LOGIN_EVENT}`, () => {
        window.location.reload()
      })
    },
    clickHandler(action) {
      if (!auth.isLogin) {
        this.showLoginPanel()
        return
      }

      action()
    },
  },
  computed: {
    options() {
      const { dropdownMenu } = this.$store.state.question
      return dropdownMenu.options ? dropdownMenu.options : []
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        if (val) {
          if (process.server) return

          this.$nextTick(() => {
            this.$el.focus()
          })
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

export interface Instance extends Vue {
  $store: Store<QuestionVuexState>
  $el: HTMLElement
}

export interface Data {}

export type Methods = {
  showLoginPanel(): void
  clickHandler(action: Function): void
}

export interface Computed {
  options: QuestionVuexState['question']['dropdownMenu']
}

export interface Props {
  visible: boolean
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.QuestionDropdownPanel {
  @include card-primary;

  position: absolute;
  width: 140px;
  padding: 12px 0;

  &:focus {
    outline: 0;
  }
}
</style>
