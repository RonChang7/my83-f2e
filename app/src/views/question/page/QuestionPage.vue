<template>
  <div class="QuestionPage">
    <div class="QuestionPage__column left">
      <QuestionSection />
      <client-only>
        <AddAnswerSection v-if="userRole === 'sales'" />
      </client-only>
      <AnswersSection />
      <client-only>
        <AddAnswerSection v-if="userRole !== 'sales'" />
      </client-only>
    </div>
    <div class="QuestionPage__column">
      <div
        style="width: 360px; height: 100vh; background: black; color: white;"
      >
        MOCK
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import QuestionSection from '@/components/question/QuestionSection.vue'
import AnswersSection from '@/components/question/AnswersSection.vue'
import AddAnswerSection from '@/components/question/AddAnswerSection.vue'
import { User, Role } from '@/services/user/user'

export default {
  components: {
    QuestionSection,
    AnswersSection,
    AddAnswerSection,
  },
  data() {
    return {
      userRole: User.role,
    }
  },
  methods: {
    /**
     * To fit my83-rt with question link to anchor point answer section,
     * e.g. https://my83.com.tw/question/22264#answer-107851
     */
    scrollToAnchorPoint(anchor) {
      const el = document.querySelector(anchor) as HTMLElement
      el && el.scrollIntoView()
    },
  },
  mounted() {
    if (this.$route.hash) {
      this.scrollToAnchorPoint(this.$route.hash)
    }
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
  userRole: Role
}

export interface Methods {
  scrollToAnchorPoint: (anchor: string) => void
}

export interface Computed {}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.QuestionPage {
  display: flex;
  justify-content: center;
  padding: 40px 0 60px;
  background: $primary-bg;

  @include max-media('xl') {
    flex-direction: column;
  }

  &__column {
    display: flex;
    flex-direction: column;
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }

    &.left {
      width: 740px;

      @include max-media('xl') {
        width: 100%;
      }
    }
  }
}
</style>
