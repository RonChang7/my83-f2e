<template>
  <div class="checkbox">
    <BaseCheckbox
      type="button"
      :label="text"
      :checked="checked"
      @update="update"
    />
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import BaseCheckbox from '@/components/my83-ui-kit/input/BaseCheckbox.vue'

@Component({
  components: {
    BaseCheckbox,
  },
})
export default class Checkbox extends Vue {
  @Prop({ type: Array, required: true })
  currentSelectedValues: (string | number)[]

  @Prop({ type: [String, Number], required: true })
  value: string | number

  @Prop({ type: String, default: '' })
  text: string

  get checked() {
    return this.currentSelectedValues.includes(this.value)
  }

  @Emit()
  update() {
    return _.xor(this.currentSelectedValues, [this.value])
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
  ::v-deep .label {
    font-size: 1rem;
  }
}
</style>
