<template>
  <div class="QuestionListPage">
    <div class="QuestionListPage__row banner">
      <BannerSection />
    </div>
    <div class="QuestionListPage__row search">
      <div class="left">
        <ListSearchSection />
      </div>
      <div v-if="!isMobile" class="right">
        <ListAskingSection />
      </div>
    </div>
    <template v-if="isMobile && shouldShowHotService">
      <div class="QuestionListPage__row hot">
        <HotServiceSection />
      </div>
      <div class="QuestionListPage__row asking">
        <ListAskingSection />
      </div>
    </template>
    <div class="QuestionListPage__row content">
      <QuestionLayoutWithFixedColumn>
        <template v-slot:left>
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
          <ListGuideSection v-if="isDesktop && shouldShowGuide" />
          <ListRecommendProductSection v-if="shouldShowRecommendProduct" />
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
import HotServiceSection from '@/components/question/section/HotServiceSection.vue'
import PopularBlogSection from '@/components/question/section/PopularBlogSection.vue'
import PopularQuestionSection from '@/components/question/section/PopularQuestionSection.vue'
import BasePagination from '@/components/my83-ui-kit/pagination/BasePagination.vue'
import { Pagination } from '@/api/type'
import { QuestionListVuexState } from '@/views/question/list/CreateQuestionListPage'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'
import UserMetaMixin, {
  ComponentInstance as UserMetaMixinComponentInstance,
} from '@/mixins/user/user-meta'

const options: ComponentOption = {
  mixins: [DeviceMixin, UserMetaMixin],
  components: {
    QuestionLayoutWithFixedColumn,
    BannerSection,
    ListQuestionSection,
    ListAskingSection,
    ListGuideSection,
    ListRecommendProductSection,
    ListSearchSection,
    HotServiceSection,
    PopularBlogSection,
    PopularQuestionSection,
    BasePagination,
  },
  data() {
    return {
      isMounted: false,
    }
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
    shouldShowGuide() {
      if (process.server || !this.isMounted) return true

      return this.userRole !== 'sales'
    },
    shouldShowRecommendProduct() {
      if (process.server || !this.isMounted) return true

      return this.userRole !== 'sales'
    },
    shouldShowHotService() {
      if (process.server || !this.isMounted) return true

      return this.userRole !== 'sales'
    },
  },
  mounted() {
    this.isMounted = true
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
    Omit<DeviceMixinComponentInstance, keyof Vue>,
    Omit<UserMetaMixinComponentInstance, keyof Vue> {
  $store: Store<QuestionListVuexState>
}

export interface Data {
  isMounted: boolean
}

export interface Methods {}

export interface Computed {
  pagination: Pagination | null
  shouldShowPagination: boolean
  shouldShowGuide: boolean
  shouldShowRecommendProduct: boolean
  shouldShowHotService: boolean
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

  .search {
    margin-bottom: 0;
  }

  .left {
    width: 740px;
    margin-right: 20px;

    @include max-media('xl') {
      margin-right: 0;
    }
  }

  .right {
    width: 360px;
  }

  @include max-media('xl') {
    .left,
    .right {
      width: 100%;
    }

    .search {
      order: 0;
      padding: 20px;
    }

    .banner {
      order: 1;
    }

    .hot {
      order: 2;
    }

    .asking {
      order: 3;
    }

    .content {
      order: 4;
    }
  }
}
</style>
