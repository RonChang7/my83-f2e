<template functional>
  <div class="Medal">
    <img
      :class="`Medal__${props.size}`"
      :src="
        `${props.imageBucketUrl}/front/common/medal/medal-lv-${props.level}.png`
      "
      :alt="`Level ${props.level}`"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { FunctionalComponentOptions } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

export default {
  functional: true,
} as ComponentOption

export type ComponentOption = FunctionalComponentOptions<Props>

export type ComponentInstance = CombinedVueInstance<Instance, {}, {}, {}, Props>

export interface Instance extends Vue {}

export interface Props {
  size: 'S' | 'M' | 'L'
  level: number
  imageBucketUrl: string
}
</script>

<style lang="scss" scoped>
.Medal {
  &__S {
    height: 22px;
  }

  &__M {
    height: 26px;
  }

  &__L {
    height: 33px;
  }
}
</style>
