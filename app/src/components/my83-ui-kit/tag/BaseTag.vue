<template>
  <div :class="classObject" class="BaseTag">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    type: {
      type: String,
      default: 'default',
      validator: (value: string) =>
        [
          'default',
          'yellow',
          'brown',
          'blue',
          'green',
          'primary-outline',
        ].includes(value),
    },
    small: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const classObject = computed(() => {
      return {
        [`BaseTag__${props.type}`]: true,
        BaseTag__sm: props.small,
        active: props.active,
        disabled: props.disabled,
      }
    })

    return {
      classObject,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.BaseTag {
  @include tag;

  &__sm {
    @include tag-sm;
  }

  &__default {
    @include tag-default;
  }

  @each $color in $tag-color-list {
    &__#{$color} {
      @include tag-style($color);
    }
  }

  @each $color in $tag-color-outline-list {
    &__#{$color} {
      @include tag-style-outline($color);
    }
  }
}
</style>
