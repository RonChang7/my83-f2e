<template>
  <div v-if="relatedQuestions.length" class="RelatedQuestionSection">
    <LinkListSection
      :list-data="relatedQuestions"
      :max-post="maxPost"
      :title="title"
      thin
      @click-link="tracking"
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
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import LinkListSection from '@/components/my83-ui-kit/list/link/LinkListSection.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseArrowRight from '@/assets/icon/18/BaseArrowRight.svg'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { useAnalytics } from '@/utils/composition-api'
import { EventTypes } from '@/analytics/event-listeners/event.type'

export default defineComponent({
  components: {
    LinkListSection,
    GlobalLink,
    BaseArrowRight,
  },
  props: {
    maxPost: {
      type: Number,
      default: 10,
    },
    thin: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore<InsuranceVuexState>()
    const analytics = useAnalytics()
    const title = computed(
      () => `${store.state.insurance.staticData.abbr}熱門討論`
    )
    const relatedQuestions = computed(
      () => store.state.insurance.relatedQuestions || []
    )
    const linkLocation = computed(() => {
      return {
        name: 'questionSearch',
        query: {
          q: store.state.insurance.staticData.queryForMoreQuestion,
        },
      }
    })
    const insuranceAbbr = computed(() => store.state.insurance.staticData.abbr)
    const tracking = (index: number) => {
      analytics.dispatch<EventTypes.ClickAction>(EventTypes.ClickAction, {
        category: '點擊討論區塊',
        action: relatedQuestions.value[index].link.path,
        label: insuranceAbbr.value,
      })
    }

    return {
      title,
      relatedQuestions,
      linkLocation,
      tracking,
    }
  },
})
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
    margin: 0 0px 16px;
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
