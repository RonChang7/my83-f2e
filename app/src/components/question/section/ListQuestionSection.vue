<template>
  <BaseCard class="ListQuestionSection">
    <template v-slot>
      <template v-if="list.length">
        <ListQuestion
          v-for="question in list"
          :key="question.question_id"
          :question="question"
        />
      </template>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import ListQuestion from '../list/ListQuestion.vue'
import { QuestionListVuexState } from '@/views/question/list/CreateQuestionListPage'
import { QuestionListData } from '@/api/question/list.type'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'

const options: ComponentOption = {
  components: {
    BaseCard,
    ListQuestion,
  },
  computed: {
    list() {
      return this.$store.state.questionList.list || []
    },
  },
}

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
  $store: Store<QuestionListVuexState>
}

export interface Data {}

export interface Methods {}

export interface Computed {
  list: QuestionListData[]
}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/rwd.scss';

.ListQuestionSection {
  margin-bottom: 20px;
  padding: 0 10px;

  @include max-media('xl') {
    margin-bottom: 0;
  }
}
</style>
