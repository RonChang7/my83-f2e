<template>
  <div class="ProductQueryField">
    <span class="ProductQueryField__name">{{ option.name }}：</span>
    <div class="ProductQueryField__field">
      <IntervalTextInput
        v-if="option.type === 'NUMBER'"
        :value="value"
        :option="option"
        :is-validated="isValidated"
        @update="(e) => updateValue(e)"
        @blur="$emit('blur')"
      />
      <Select
        v-if="option.type === 'OPTION' && option.options"
        :value="value || 0"
        :options="option.options"
        @update="
          (e) => {
            updateValue(e)
            $emit('blur')
          }
        "
      />
      <div v-if="option.type === 'RADIO' && option.options">
        <Radio
          v-for="radioOption in option.options"
          :key="radioOption.value"
          :text="radioOption.text"
          :value="radioOption.value"
          :current-selected-value="value"
          @update="
            (e) => {
              updateValue(e)
              $emit('blur')
            }
          "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import IntervalTextInput from './input-field/IntervalTextInput.vue'
import Select from './input-field/Select.vue'
import Radio from './input-field/Radio.vue'
import { FieldOption } from '@/services/product/field.type'
import { OptionValueType } from '@/api/insurance/product.type'

@Component({
  components: {
    IntervalTextInput,
    Select,
    Radio,
  },
})
export default class ProductQueryField extends Vue {
  @Prop({ type: Object, required: true })
  option!: FieldOption<OptionValueType>

  @Prop({ type: [String, Number], required: true })
  value!: string | number

  @Prop({ type: Boolean, default: true })
  isValidated: boolean

  updateValue(value: string | number) {
    this.$emit('update', {
      id: this.option.id,
      value,
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.ProductQueryField {
  display: flex;
  align-items: baseline;
  margin-bottom: 28px;

  &__name {
    flex: 0 0 auto;
    margin-right: 4px;
  }

  &__field {
    overflow: hidden;
  }
}
</style>
