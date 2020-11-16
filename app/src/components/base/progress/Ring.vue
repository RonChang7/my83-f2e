<template>
  <div class="Ring">
    <canvas ref="ring" :style="styleObject"></canvas>
    <div
      v-if="wording"
      class="Ring__wording"
      :style="{ ...wordStyleObject, ...wordingStyle }"
    >
      {{ wording }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { RingCanvasGenerator } from './RingCanvasGenerator'

const options: ComponentOption = {
  props: {
    length: {
      type: Number,
      default: 50,
    },
    lineWidth: {
      type: Number,
      default: 5,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    wording: {
      type: String,
      default: '',
    },
    wordingStyle: {
      type: Object as PropType<Props['wordingStyle']>,
      default: null,
    },
  },
  computed: {
    styleObject() {
      return {
        width: `${this.length}px`,
        height: `${this.length}px`,
      }
    },
    wordStyleObject() {
      return {
        width: `${this.length}px`,
        height: `${this.length}px`,
        padding: `0 ${this.lineWidth * 2}px`,
      }
    },
  },
  methods: {
    draw() {
      const canvas = this.$refs.ring
      const ctx = canvas.getContext('2d')!
      const ring = new RingCanvasGenerator(ctx)

      /**
       * 提高 canvas 繪圖解析度
       * ref: https://stackoverflow.com/a/26047748
       */

      const scaleFactor = 2

      canvas.width = this.length * scaleFactor
      canvas.height = this.length * scaleFactor
      ctx.scale(scaleFactor, scaleFactor)

      ring.draw({
        length: this.length,
        lineWidth: this.lineWidth,
        deg: (this.percentage / 100) * 360,
      })
    },
  },
  watch: {
    percentage() {
      this.draw()
    },
  },
  mounted() {
    this.draw()
  },
}

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

export interface Instance extends Vue {
  $refs: {
    ring: HTMLCanvasElement
  }
}

export interface Data {}

export type Methods = {
  draw(): void
}

export interface Computed {
  styleObject: Partial<CSSStyleDeclaration>
  wordStyleObject: Partial<CSSStyleDeclaration>
}

export interface Props {
  length: number
  lineWidth: number
  percentage: number
  wording: string
  wordingStyle: Partial<CSSStyleDeclaration>
}

export default options
</script>
<style lang="scss" scoped>
.Ring {
  display: flex;

  &__wording {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    text-align: center;
  }
}
</style>
