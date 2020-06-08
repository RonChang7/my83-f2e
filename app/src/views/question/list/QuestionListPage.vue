<template>
  <div class="QuestionListPage">
    <div class="QuestionListPage__row">
      <BannerSection />
    </div>
    <div class="QuestionListPage__row">
      <QuestionLayoutWithFixedColumn>
        <template v-slot:left>
          <ListSearchSection />
          <ListQuestionSection />
        </template>
        <template v-slot:left-bottom-offset>
          <BasePagination
            v-if="shouldShowPagination"
            :pagination="pagination"
            @to-page="(index) => $emit('to-page', index)"
          />
        </template>
        <template v-slot:right>
          <ListAskingSection />
          <ListGuideSection v-if="isDesktop" />
          <ListRecommendProductSection />
          <PopularQuestionSection :max-post="isMobile ? 5 : 10" />
          <PopularBlogSection :max-post="isMobile ? 5 : 10" />
        </template>
      </QuestionLayoutWithFixedColumn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import QuestionLayoutWithFixedColumn from '@/components/question/layout/QuestionLayoutWithFixedColumn.vue'
import BannerSection from '@/components/question/section/BannerSection.vue'
import ListQuestionSection from '@/components/question/section/ListQuestionSection.vue'
import ListAskingSection from '@/components/question/section/ListAskingSection.vue'
import ListGuideSection from '@/components/question/section/ListGuideSection.vue'
import ListRecommendProductSection from '@/components/question/section/ListRecommendProductSection.vue'
import ListSearchSection from '@/components/question/section/ListSearchSection.vue'
import PopularBlogSection from '@/components/question/section/PopularBlogSection.vue'
import PopularQuestionSection from '@/components/question/section/PopularQuestionSection.vue'
import BasePagination from '@/components/my83-ui-kit/pagination/BasePagination.vue'
import { Pagination } from '@/api/type'
import { QuestionListVuexState } from '@/views/question/list/Index.vue'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'

const options: ComponentOption = {
  mixins: [DeviceMixin],
  components: {
    QuestionLayoutWithFixedColumn,
    BannerSection,
    ListQuestionSection,
    ListAskingSection,
    ListGuideSection,
    ListRecommendProductSection,
    ListSearchSection,
    PopularBlogSection,
    PopularQuestionSection,
    BasePagination,
  },

  computed: {
    pagination() {
      const { meta } = this.$store.state.questionList
      return meta ? meta.pagination : null
    },
    shouldShowPagination() {
      if (!this.pagination) return false
      return !(this.pagination.totalPage === 1)
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

export interface Instance
  extends Vue,
    Omit<DeviceMixinComponentInstance, keyof Vue> {
  $store: Store<QuestionListVuexState>
}

export interface Data {}

export interface Methods {}

export interface Computed {
  pagination: Pagination | null
  shouldShowPagination: boolean
}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.QuestionListPage {
  display: flex;
  flex-direction: column;
  padding: 0 0 60px;
  background: $primary-bg;

  @include max-media('xl') {
    padding: 0 0 90px;
  }

  &__row {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;

    @include max-media('xl') {
      flex-direction: column;
    }
  }
}
</style>
