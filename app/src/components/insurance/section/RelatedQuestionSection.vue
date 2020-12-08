<template>
  <div v-if="relatedQuestions.length" class="RelatedQuestionSection">
    <RelatedSection
      :related-data="relatedQuestions"
      :max-post="maxPost"
      :title="title"
    />
    <div class="RelatedQuestionSection__footer">
      <GlobalLink :to="linkLocation">
        去討論區發問
        <BaseArrowRight />
      </GlobalLink>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { RawLocation } from 'vue-router'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import RelatedSection from '@/components/base/related/RelatedSection.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseArrowRight from '@/assets/icon/18/BaseArrowRight.svg'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { RelatedQuestion } from '@/api/type'

const options: ComponentOption = {
  components: {
    RelatedSection,
    GlobalLink,
    BaseArrowRight,
  },
  props: {
    maxPost: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    title() {
      return `${this.$store.state.insurance.staticData.abbr}熱門討論`
    },
    relatedQuestions() {
      return this.$store.state.insurance.relatedQuestions || []
    },
    linkLocation() {
      return {
        name: 'questionSearch',
        query: {
          q: this.$store.state.insurance.staticData.queryForMoreQuestion,
        },
      }
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
  $store: Store<InsuranceVuexState>
}

export interface Data {}

export type Methods = {}

export interface Computed {
  title: string
  relatedQuestions: RelatedQuestion[]
  linkLocation: RawLocation
}

export interface Props {
  maxPost: number
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.RelatedQuestionSection {
  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 0.875rem;
    margin: 0 0px 20px;
    margin-top: -10px;

    @include max-media('xl') {
      margin: 0 16px 20px 0;
    }

    > a {
      margin-right: 4px;

      @include hover('_gray-secondary-darker', $has-svg: true);
    }
  }
}
</style>
