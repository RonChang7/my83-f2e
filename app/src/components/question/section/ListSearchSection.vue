<template>
  <div class="ListSearchSection">
    <BaseSearch
      placeholder="搜尋討論區"
      :value.sync="searchInputValue"
      @submit="search"
    />
    <div class="ListSearchSection__HotKeyword">
      <template v-if="!isMobile">
        <div v-for="(keyword, index) in keywords" :key="index">
          {{ keyword.name }}：
          <QuestionTags :tags="keyword.tags" />
        </div>
      </template>
      <template v-else>
        <QuestionTags :tags="mobileTags" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useRoute,
  useRouter,
  useStore,
  watch,
} from '@nuxtjs/composition-api'
import { Route } from 'vue-router'
import { useDevice } from '@/mixins/device/device-mixins'
import { QuestionListVuexState } from '@/views/question/list/CreateQuestionListPage'
import { Link } from '@/api/type'
import BaseSearch from '@/components/my83-ui-kit/search/BaseSearch.vue'
import QuestionTags from '../question/QuestionTags.vue'

interface Keyword {
  name: string
  tags: {
    id: number
    name: string
    link: Link
  }[]
}

export default defineComponent({
  components: {
    BaseSearch,
    QuestionTags,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore<QuestionListVuexState>()
    const { isMobile } = useDevice()
    const { $env } = useContext()

    const searchInputValue = ref('')
    const keywords = ref<Keyword[]>([])
    const hotKeywords = computed(() => {
      return (
        store.state.questionList.meta?.keywords.others.map((keyword, index) => {
          return {
            id: index,
            name: keyword,
            link: {
              path: `/question/search?q=${keyword}`,
              url: `${$env.HOST_URL}/question/search?q=${keyword}`,
            },
          }
        }) || []
      )
    })
    const hotTags = computed(() => {
      return (
        store.state.questionList.meta?.keywords.tags.map((keyword, index) => {
          return {
            id: index,
            name: keyword,
            link: {
              path: `/question/search?q=${keyword}`,
              url: `${$env.HOST_URL}/question/search?q=${keyword}`,
            },
          }
        }) || []
      )
    })
    const mobileTags = computed(() =>
      _.shuffle([
        ..._.sampleSize(hotKeywords.value, 3),
        ..._.sampleSize(hotTags.value, 3),
      ])
    )

    keywords.value = [
      {
        name: '熱門關鍵字',
        tags: hotKeywords.value,
      },
      {
        name: '熱門標籤',
        tags: hotTags.value,
      },
    ]

    const search = () => {
      if (!searchInputValue.value.trim()) return

      router.push({
        name: 'questionSearch',
        query: {
          q: searchInputValue.value,
        },
      })
    }

    const updateQueryValue = (val: Route['query']) => {
      searchInputValue.value =
        route.value.name === 'questionSearch' && val.q ? String(val.q) : ''
    }

    watch(
      () => route.value.query,
      (val) => updateQueryValue(val),
      {
        immediate: true,
      }
    )

    return {
      isMobile,
      searchInputValue,
      keywords,
      mobileTags,
      search,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.ListSearchSection {
  margin-bottom: 30px;

  @include max-media('xl') {
    margin-bottom: 0;
  }

  &__HotKeyword {
    display: flex;
    flex-direction: column;
    margin-top: 8px;
    font-size: 0.875rem;
    color: $gray-primary;

    > div {
      display: flex;
      align-items: center;

      > div {
        margin: 0;
      }
    }

    @include max-media('xl') {
      > span {
        display: none;
      }
    }
  }
}
</style>
