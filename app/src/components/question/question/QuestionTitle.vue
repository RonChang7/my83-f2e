<script lang="ts">
import Vue from 'vue'
import { FunctionalComponentOptions } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

export default {
  functional: true,
  render(h, { props, data }) {
    return h(
      props.type,
      {
        staticClass: 'QuestionTitle',
        class: [data.class, data.staticClass],
      },
      props.text
    )
  },
} as ComponentOption

export type ComponentOption = FunctionalComponentOptions<Props>

export type ComponentInstance = CombinedVueInstance<Instance, {}, {}, {}, Props>

export interface Instance extends Vue {}

export interface Props {
  text: string
  type: 'h1' | 'h3'
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

h1 {
  font-size: 1.75rem;
  margin: 12px 0 20px;

  @include max-media('xl') {
    font-size: 1.375rem;
  }
}

h3 {
  font-size: 1.375rem;
  margin: 8px 0;

  @include max-media('xl') {
    font-size: 1.125rem;
  }
}

.QuestionTitle {
  color: $gray-primary;
  font-weight: 500;
}
</style>
