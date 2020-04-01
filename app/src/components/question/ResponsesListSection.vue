<template>
  <div v-if="responses.length" class="ResponsesListSection">
    <ResponseSection
      v-for="(response, index) in responses"
      :key="response.response_id"
      :response="response"
      :index="index"
      :user-role="userRole"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { ResponseData } from '@/api/question/question.type'
import { UserRole } from '@/services/user/user'
const ResponseSection = () => import('./response/ResponseSection.vue')

export default {
  components: {
    ResponseSection,
  },
  props: {
    responses: {
      type: Array,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
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

export interface Data {}

export interface Methods {}

export interface Computed {}

export interface Props {
  responses: ResponseData[]
  userRole: UserRole
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.ResponsesListSection {
  padding-left: 40px;
  border-top: 1px solid $gray-quaternary;

  @include max-media('xl') {
    padding-left: 30px;
  }
}
</style>
