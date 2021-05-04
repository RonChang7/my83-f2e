<template>
  <div class="radio" :class="type">
    <BaseRadio
      :type="type"
      :label="text"
      :value="value"
      :current-selected-value="currentSelectedValue"
      @update="(e) => $emit('update', e)"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BaseRadio from '@/components/my83-ui-kit/input/BaseRadio.vue'

@Component({
  components: {
    BaseRadio,
  },
})
export default class Radio extends Vue {
  @Prop({ type: [String, Number], required: true })
  currentSelectedValue: string | number

  @Prop({ type: [String, Number], required: true })
  value: string | number

  @Prop({ type: String, default: '' })
  text: string

  @Prop({ type: String, default: 'radio' })
  type: 'radio' | 'button'
}
</script>

<style lang="scss" scoped>
.radio {
  &.button {
    display: inline-block;
    width: 64px;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }

  &.radio {
    ::v-deep .label {
      font-size: 1rem !important;
    }
  }
}
</style>
