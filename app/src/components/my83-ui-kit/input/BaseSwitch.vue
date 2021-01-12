<template>
  <div class="BaseSwitch">
    <div
      v-for="option in options"
      :key="option.value"
      class="BaseSwitch__option"
      :class="{ active: value === option.value }"
      @click="clickHandler(option.value)"
    >
      {{ option.text }}
    </div>
    <div
      class="selected"
      :style="{ left: offset.left ? `${offset.left}px` : 'unset' }"
    ></div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  nextTick,
  onMounted,
  onBeforeUnmount,
  reactive,
  watch,
} from '@nuxtjs/composition-api'
import { Option } from './type'

export default defineComponent({
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    options: {
      type: Array as () => Option[],
      required: true,
    },
  },
  setup(props, ctx) {
    const offset = useCurrentSelectedPosition(computed(() => props.value))
    const clickHandler = (value: string | number) => {
      ctx.emit('update:value', value)
    }

    return {
      clickHandler,
      offset,
    }
  },
})

const useCurrentSelectedPosition = (
  currentSelectValue: ComputedRef<number | string>
) => {
  const offset = reactive({
    left: 0,
    top: 0,
  })

  const updateOffset = () => {
    const currentSelectEl = document.querySelector('.active') as HTMLElement
    offset.left = currentSelectEl?.offsetLeft || 0
    offset.top = currentSelectEl?.offsetTop || 0
  }

  onMounted(() => {
    updateOffset()

    window.addEventListener('resize', updateOffset)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateOffset)
  })

  watch(currentSelectValue, () => {
    nextTick(() => updateOffset())
  })

  return offset
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.BaseSwitch {
  display: flex;
  height: 52px;
  background: $default-bg;
  border-radius: 26px;
  padding: 6px;
  font-weight: 500;

  &__option,
  .selected {
    width: 208px;
    border-radius: 26px;
    transition: 0.2s;

    @include max-media('xl') {
      width: 158px;
    }
  }

  &__option {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 6px;
    color: $gray-secondary;
    z-index: 1;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    &.active {
      color: #fff;

      @include hover-supported {
        &:hover {
          background: $secondary-dark-color;
        }
      }
    }

    &:not(.active) {
      @include hover-supported {
        &:hover {
          background: $secondary-bright-color;
        }
      }
    }
  }

  .selected {
    position: absolute;
    height: 40px;
    background: $secondary-color;
  }
}
</style>
