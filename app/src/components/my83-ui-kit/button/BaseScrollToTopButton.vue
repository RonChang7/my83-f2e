<template>
  <img
    class="ScrollToTopButton"
    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KICAgIDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTIwIDBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBzLTguOTU0IDIwLTIwIDIwUzAgMzEuMDQ2IDAgMjAgOC45NTQgMCAyMCAwem0xLjU3MyA5Ljg3MWMtLjU5My0uNTItMS41MDMtLjQ5NC0yLjA2NS4wODUtNC40MjcgNC41NjMtNy4xNjUgNy40MjQtOC4yNyA4LjY0M2wtLjM4MS40M2MtLjUzNi42MzEtLjQ2IDEuNTc4LjE3MiAyLjExNC42MzEuNTM2IDEuNTc4LjQ2IDIuMTE0LS4xNzJsLjE1OS0uMTgxYy40MjItLjQ3NiAxLjI4Ni0xLjM5NyAyLjU4Mi0yLjc1NWwzLjEwOC0zLjIyOC4wMTkgMTUuMTk1LjAwNy4xNDRjLjA3NC43Ni43MTUgMS4zNTUgMS40OTUgMS4zNTQuODI4LS4wMDEgMS40OTktLjY3MyAxLjQ5OC0xLjUwMmwtLjAxOS0xNS4yOTcgNS45MTIgNi4zMjMuMTEuMTA3Yy41NzMuNSAxLjQ0My40OTUgMi4wMS0uMDM1LjYwNi0uNTY2LjYzNy0xLjUxNS4wNzItMi4xMmwtOC40MTUtOXoiIG9wYWNpdHk9IjEiLz4KPC9zdmc+Cg=="
    alt="Scroll to top"
    :class="{ disabled }"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
} as ComponentOption

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export type ComponentInstance = CombinedVueInstance<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export interface Instance extends Vue {}

export interface Data {}

export interface Methods {}

export interface Computed {}

export interface Props {
  disabled: boolean
}
</script>

<style lang="scss" scoped>
.ScrollToTopButton {
  opacity: 0.3;

  &:hover,
  &:active {
    opacity: 0.55;
  }

  &.disabled {
    opacity: 0.1;
  }
}
</style>
