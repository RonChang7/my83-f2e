<template>
  <GlobalLink :to="tag.link.path">
    <BaseTag class="ProductFeatureTag" small :type="tagTypeMap[tag.text]">
      {{ tag.text }}
    </BaseTag>
  </GlobalLink>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseTag from '@/components/my83-ui-kit/tag/BaseTag.vue'
import { LinkButton } from '@/api/type'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'

export default defineComponent({
  components: {
    BaseTag,
    GlobalLink,
  },
  props: {
    tag: {
      type: Object as () => LinkButton,
      required: true,
    },
  },
  setup() {
    /* eslint-disable prettier/prettier */
    const tagTypeMap = {
      '新上架': 'yellow',
      '即將停售': 'brown',
      '高CP值': 'blue',
      '優質主約': 'green',
    }
    /* eslint-enable */

    return {
      tagTypeMap,
    }
  },
})
</script>
