<template>
  <div class="radio">
    <BaseRadio
      type="button"
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
}
</script>

<style lang="scss" scoped>
.radio {
  display: inline-block;
  width: 64px;

  &:not(:last-child) {
    margin-right: 8px;
  }
}
</style>
