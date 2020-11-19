<template>
  <BaseSelect
    :value="value || 0"
    :options="options"
    :disabled="typeof value === 'undefined'"
    :hide-icon="typeof value === 'undefined'"
    class="select"
    @input="(e) => $emit('update', e)"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { FieldOption } from '@/services/product/field.type'
import { OptionType } from '@/api/insurance/product.type'
import BaseSelect from '@/components/my83-ui-kit/input/BaseSelect.vue'

@Component({
  components: {
    BaseSelect,
  },
})
export default class Select extends Vue {
  @Prop({ type: Array, required: true })
  options!: FieldOption<OptionType>['options']

  @Prop({ type: [String, Number], required: true })
  value!: string | number
}
</script>

<style lang="scss" scoped>
.select {
  min-width: 114px;
}
</style>
