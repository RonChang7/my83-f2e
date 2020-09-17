<template>
  <canvas ref="ring" :style="styleObject"></canvas>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { RingCanvasGenerator, RingType } from './RingCanvasGenerator'

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
    ringType: {
      type: String as PropType<Props['ringType']>,
      default: 'lower',
    },
    percentage: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    styleObject() {
      return {
        width: `${this.length}px`,
        height: `${this.length}px`,
      }
    },
  },
  mounted() {
    const canvas = this.$refs.ring
    const ring = new RingCanvasGenerator(this.ringType)

    canvas.width = this.length
    canvas.height = this.length

    ring.create({
      ctx: canvas.getContext('2d')!,
      length: this.length,
      lineWidth: this.lineWidth,
      radius: this.length / 2,
      deg: (this.percentage / 100) * 360,
    })
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

export type Methods = {}

export interface Computed {
  styleObject: Partial<CSSStyleDeclaration>
}

export interface Props {
  length: number
  lineWidth: number
  ringType: RingType
  percentage: number
}

export default options
</script>
