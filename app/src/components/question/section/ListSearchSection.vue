<template>
  <div class="ListSearchSection">
    <BaseSearch
      placeholder="新生兒保險、銀髮族長照險..."
      :value.sync="value"
      @submit="search"
    />
    <div class="ListSearchSection__HotKeyword">
      <span>
        熱門關鍵字：
      </span>
      <QuestionTags :tags="hotKeyword" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Route } from 'vue-router'
import QuestionTags, {
  Props as QuestionTagsProps,
} from '../question/QuestionTags.vue'
import BaseSearch from '@/components/my83-ui-kit/search/BaseSearch.vue'

const options: ComponentOption = {
  components: {
    BaseSearch,
    QuestionTags,
  },
  data() {
    return {
      value: '',
    }
  },
  computed: {
    // @TODO: 這邊熱門關鍵字前端先寫死，之後會改成透過 API 給值
    hotKeyword() {
      const keywords = ['新生兒保險', '小資族', '儲蓄險', '意外險', '理賠']
      return keywords.map((w, index) => {
        return {
          id: index,
          name: w,
          link: {
            path: `/question/search?q=${w}`,
            url: `${this.$env.HOST_URL}/question/search?q=${w}`,
          },
        }
      })
    },
  },
  methods: {
    search() {
      if (!this.value.trim()) return

      this.$router.push({
        name: 'questionSearch',
        query: {
          q: this.value,
        },
      })
    },
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler(val: Route['query']) {
        this.value =
          this.$route.name === 'questionSearch' && val.q ? String(val.q) : ''
      },
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

export interface Instance extends Vue {}

export interface Data {
  value: string
}

export interface Methods {
  search(): void
}

export interface Computed {
  hotKeyword: QuestionTagsProps['tags']
}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.ListSearchSection {
  margin-bottom: 40px;

  @include max-media('xl') {
    margin-bottom: 0;
  }

  &__HotKeyword {
    display: flex;
    margin-top: 12px;
    color: $gray-primary;

    @include max-media('xl') {
      margin-top: 8px;

      > span {
        display: none;
      }
    }
  }
}
</style>
