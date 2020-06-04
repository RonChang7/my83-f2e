<script lang="ts">
import Vue from 'vue'
import { FunctionalComponentOptions } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

const options: ComponentOption = {
  functional: true,
  render(h, { props, data }) {
    return h(
      'div',
      {
        staticClass: 'ListQuestionContent',
        class: [data.class, data.staticClass],
      },
      props.content
    )
  },
}

export type ComponentOption = FunctionalComponentOptions<Props>

export type ComponentInstance = CombinedVueInstance<Instance, {}, {}, {}, Props>

export interface Instance extends Vue {}

export interface Props {
  content: string
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.ListQuestionContent {
  color: $gray-secondary;
  font-size: 0.875rem;
  margin-bottom: 8px;

  @include text-ellipsis(2);
}
</style>
