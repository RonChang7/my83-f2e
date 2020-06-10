<template>
  <div class="ListSearchSection">
    <BaseSearch
      placeholder="新生兒保險、銀髮族長照險..."
      :value.sync="value"
      @submit="search"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseSearch from '@/components/my83-ui-kit/search/BaseSearch.vue'

const options: ComponentOption = {
  components: {
    BaseSearch,
  },
  data() {
    return {
      value: '',
    }
  },
  methods: {
    search() {
      if (!this.value.trim()) return

      this.$router.push({
        path: '/question/search',
        query: {
          q: this.value,
        },
      })
    },
  },
  created() {
    this.value =
      this.$route.path === '/question/search' && this.$route.query.q
        ? String(this.$route.query.q)
        : ''
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

export interface Computed {}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/rwd.scss';

.ListSearchSection {
  margin-bottom: 40px;

  @include max-media('xl') {
    margin-bottom: 0;
  }
}
</style>
