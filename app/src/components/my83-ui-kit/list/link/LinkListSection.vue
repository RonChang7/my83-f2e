<template>
  <div class="LinkListSection">
    <div class="LinkListSection__title">{{ title }}</div>
    <div class="LinkListSection__content">
      <GlobalLink
        v-for="(item, index) in filteredListData"
        :key="index"
        :to="item.link.path"
        @click.native="$emit('click-link', index)"
      >
        <LinkCard
          :index="index + 1"
          :title="item.title"
          :view-count="item.view_count"
          :answer-count="item.answer_count"
          :last="filteredListData.length === index + 1"
        />
      </GlobalLink>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { computed, defineComponent } from '@nuxtjs/composition-api'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import LinkCard from './LinkCard.vue'

export default defineComponent({
  components: {
    LinkCard,
    GlobalLink,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    listData: {
      type: Array as () => ListData[],
      required: true,
    },
    maxPost: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const filteredListData = computed(() =>
      props.listData.length < props.maxPost
        ? props.listData
        : _.slice(props.listData, 0, props.maxPost)
    )

    return {
      filteredListData,
    }
  },
})

export interface ListData {
  title: string
  link: {
    path: string
    url: string
  }
  view_count: number
  answer_count?: number
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.LinkListSection {
  @include card-primary;

  margin-bottom: 20px;

  &__title {
    padding: 0 30px;
  }

  &__content {
    padding: 0 20px;
  }

  &__title {
    display: flex;
    align-items: center;
    color: $gray-primary;
    height: 50px;
    border-bottom: 1px solid $gray-quaternary;
  }

  @include max-media('xl') {
    @include card-secondary;

    margin-bottom: 10px;

    & > * {
      padding: 0 20px;
    }

    &__title {
      color: $gray-secondary;
      font-size: 0.875rem;
      height: 36px;
    }
  }
}
</style>
