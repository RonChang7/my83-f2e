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
      type: String as () => 'default',
      default: 'default',
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

  &__default {
    @include tag-default;
  }
}
</style>
