<script lang="ts">
import Vue from 'vue'
import { FunctionalComponentOptions } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

const options: ComponentOption = {
  functional: true,
  render(h, ctx) {
    return h('img', {
      staticClass: `BaseScrollToTopButton ${ctx.data.staticClass}`,
      class: {
        ...ctx.data.class,
        disabled: ctx.props.disabled || false,
      },
      attrs: {
        ...ctx.data.attrs,
        src: `${ctx.parent.$imageBucketUrl}/front/common/icon/to-top.svg`,
        alt: 'Scroll to top',
      },
      on: ctx.listeners,
    })
  },
}

export type ComponentOption = FunctionalComponentOptions<Props>

export type ComponentInstance = CombinedVueInstance<Instance, {}, {}, {}, Props>

export interface Instance extends Vue {}

export interface Props {
  disabled: boolean
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/mixins.scss';

.BaseScrollToTopButton {
  opacity: 0.3;

  @include hover-supported {
    cursor: pointer;

    &:hover,
    &:active {
      opacity: 0.55;
    }
  }

  &.disabled {
    opacity: 0.1;
  }
}
</style>
