<template>
  <div class="CoverageBadge">
    <Ring
      :percentage="percentage"
      :wording="wording"
      :length="ringStyle.length"
      :line-width="ringStyle.lineWidth"
      :wording-style="{ 'line-height': 1.2 }"
    />
    <span>{{ legend }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import Ring from '@/components/base/progress/Ring.vue'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'

const options: ComponentOption = {
  mixins: [DeviceMixin],
  components: {
    Ring,
  },
  props: {
    percentage: {
      type: Number,
      default: 0,
    },
    wording: {
      type: String,
      default: '',
    },
    legend: {
      type: String,
      default: '',
    },
  },
  computed: {
    ringStyle() {
      return this.isMobile
        ? {
            length: 44,
            lineWidth: 4,
          }
        : {
            length: 50,
            lineWidth: 5,
          }
    },
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

export interface Instance
  extends Vue,
    Omit<DeviceMixinComponentInstance, keyof Vue> {}

export interface Data {}

export type Methods = {}

export interface Computed {
  ringStyle: {
    length: number
    lineWidth: number
  }
}

export interface Props {
  percentage: number
  wording: string
  legend: string
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.CoverageBadge {
  display: flex;
  align-items: center;
  width: 120px;
  color: $secondary-color;
  font-size: 0.75rem;
  font-weight: 500;

  > span {
    padding-left: 8px;
  }

  @include max-media('xl') {
    width: 105px;

    > span {
      padding-left: 6px;
    }
  }
}
</style>
