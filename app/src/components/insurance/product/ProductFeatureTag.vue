<template>
  <BaseTag class="ProductFeatureTag" small :type="tagTypeMap[tag.text]">
    {{ tag.text }}
  </BaseTag>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseTag from '@/components/my83-ui-kit/tag/BaseTag.vue'
import { LinkButton } from '@/api/type'
// @TODO: 暫時移除 hyperlink，因為目前標籤不可點擊

export default defineComponent({
  components: {
    BaseTag,
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

<style lang="scss" scoped>
// @TODO: 暫時移除游標效果，因為目前標籤不可點擊
.ProductFeatureTag {
  cursor: auto;
}
</style>
