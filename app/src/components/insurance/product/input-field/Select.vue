<template>
  <BaseSelect
    :value="value"
    :options="options"
    :disabled="typeof value === 'undefined'"
    :hide-icon="typeof value === 'undefined'"
    class="select"
    @input="(e) => $emit('update', e)"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Field, FieldType } from '@/services/form/field.type'
import BaseSelect from '@/components/my83-ui-kit/input/BaseSelect.vue'

@Component({
  components: {
    BaseSelect,
  },
})
export default class Select extends Vue {
  @Prop({ type: Array, required: true })
  options!: Field<FieldType.OPTION>['options']

  @Prop({ type: [String, Number] })
  value!: string | number
}
</script>

<style lang="scss" scoped>
.select {
  min-width: 114px;
}
</style>
