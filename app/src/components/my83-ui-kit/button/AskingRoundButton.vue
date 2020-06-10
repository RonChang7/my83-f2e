<script lang="ts">
import Vue from 'vue'
import { FunctionalComponentOptions } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

const options: ComponentOption = {
  functional: true,
  render(h, ctx) {
    return h(
      'div',
      {
        staticClass: 'AskingRoundButton',
        class: {
          disabled: ctx.props.disabled || false,
        },
        on: ctx.listeners,
      },
      [
        h('img', {
          staticStyle: {
            position: 'absolute',
          },
          attrs: {
            src: `${ctx.parent.$imageBucketUrl}/front/common/icon/pencil-thick.svg`,
            alt: 'New post',
          },
        }),
      ]
    )
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
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

@mixin shape {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.AskingRoundButton {
  @include shape;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #ff9634 0%, $primary-color);
  cursor: pointer;

  &.disabled {
    background: $primary-light-color;
  }

  @include hover-supported {
    &:hover {
      &:before {
        @include shape;
        content: '';
        display: block;
        background-color: rgba(0, 0, 0, 0.25);
        position: absolute;
      }
    }
  }
}
</style>
