<template>
  <div class="BaseTooltip">
    <div
      ref="button"
      class="BaseTooltip__button"
      tabindex="0"
      @mouseenter="show"
      @focus="show"
      @mouseleave="hide"
      @blur="hide"
    >
      <slot name="button"></slot>
    </div>
    <div ref="content" class="BaseTooltip__content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { createPopper, Instance, Placement } from '@popperjs/core'

@Component
export default class BaseTooltip extends Vue {
  @Prop({ type: String, default: 'bottom' })
  placement: Placement

  @Prop({ type: Number, default: 0 })
  offset: number

  $refs: {
    button: HTMLElement
    content: HTMLElement
  }

  popperInstance: Instance | null

  isFocused: boolean = false

  createPopperInstance() {
    this.popperInstance = createPopper(this.$refs.button, this.$refs.content, {
      placement: this.placement,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, this.offset],
          },
        },
      ],
    })
  }

  destroyPopperInstance() {
    this.popperInstance && this.popperInstance.destroy()
    this.popperInstance = null
  }

  show(e: Event) {
    this.isFocused = e.type === 'focus'
    this.$refs.content.setAttribute('data-show', '')
    this.createPopperInstance()
  }

  hide(e: Event) {
    if (this.isFocused && e.type !== 'blur') return
    this.isFocused = !(e.type === 'blur')
    this.$refs.content.removeAttribute('data-show')
    this.destroyPopperInstance()
  }

  beforeDestroy() {
    this.destroyPopperInstance()
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/rwd.scss';

.BaseTooltip {
  &__button {
    display: flex;
    align-items: center;

    &:focus {
      outline: 0;
    }
  }

  &__content {
    display: none;

    @include max-media('sm') {
      padding: 0 1rem;
    }

    &[data-show] {
      display: block;
    }
  }
}
</style>
