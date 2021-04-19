<template>
  <div class="QuestionTags">
    <div v-if="iconName" class="QuestionTags__icon">
      <component :is="iconName" />
    </div>
    <div class="QuestionTags__tag">
      <template v-for="(tag, index) in tags">
        <GlobalLink :key="index" :to="tag.link.path">
          <QuestionTag :text="tag.name" />
        </GlobalLink>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import { Tag } from '@/api/question/question.type'
import BaseCompany from '@/assets/icon/24/BaseCompany.svg'
import BaseTag from '@/assets/icon/24/BaseTag.svg'
import QuestionTag from './QuestionTag.vue'

type iconType = 'tag' | 'company' | ''

export default defineComponent({
  components: {
    GlobalLink,
    QuestionTag,
    BaseCompany,
    BaseTag,
  },
  props: {
    iconType: {
      type: String as () => iconType,
      default: '',
    },
    tags: {
      type: Array as () => Tag[],
      required: true,
    },
  },
  setup(props) {
    const iconName = computed(() => {
      switch (props.iconType) {
        case 'tag':
          return 'BaseTag'
        case 'company':
          return 'BaseCompany'
        default:
          return null
      }
    })

    return {
      iconName,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.QuestionTags {
  display: flex;
  margin-bottom: 6px;

  a::v-deep {
    &:not(:last-child):after {
      content: '|';
      display: inline-block;
      margin: 0 6px;
      color: $secondary-color;
      font-size: 0.875rem;
      font-weight: 500;
    }
  }

  &__icon {
    margin-right: 6px;
  }
}
</style>
