<template functional>
  <div class="BaseCollapse">
    <div class="BaseCollapse__title" @click="listeners.toggle">
      <slot name="title"></slot>
    </div>
    <transition name="BaseCollapse__fade">
      <div v-show="props.isActive" class="BaseCollapse__body">
        <slot name="content"></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { FunctionalComponentOptions } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

const options: ComponentOption = {
  functional: true,
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
  },
}

export type ComponentOption = FunctionalComponentOptions<Props>

export type ComponentInstance = CombinedVueInstance<Instance, {}, {}, {}, Props>

export interface Instance extends Vue {}

export interface Props {
  isActive: boolean
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/mixins.scss';

.BaseCollapse {
  &__fade {
    @include vue-transition-fade($second: 0.2);
  }
}
</style>
