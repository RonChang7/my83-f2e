<template>
  <div class="ProductQueryField">
    <span v-if="!disableLabel" class="ProductQueryField__name">
      {{ field.name }}：
    </span>
    <div class="ProductQueryField__field">
      <IntervalTextInput
        v-if="field.type === 'NUMBER'"
        :value="value"
        :option="field"
        :validate-state="validateState"
        @update="(e) => updateValue(e)"
        @blur="$emit('blur')"
      />
      <BaseInputText
        v-if="field.type === 'TEXT'"
        :value="value || ''"
        :placeholder="field.placeholder"
        :disabled="field.disabled"
      />
      <Select
        v-if="field.type === 'OPTION' && field.options"
        :value="value"
        :options="field.options"
        @update="
          (e) => {
            updateValue(e)
            $emit('blur')
          }
        "
      />
      <template v-if="field.type === 'RADIO' && field.options">
        <Radio
          v-for="radioOption in field.options"
          :key="radioOption.value"
          :text="radioOption.text"
          :value="radioOption.value"
          :current-selected-value="value"
          :type="radioType"
          @update="
            (e) => {
              updateValue(e)
              $emit('blur')
            }
          "
        />
      </template>
      <template v-if="field.type === 'CHECKBOX' && field.options">
        <Checkbox
          v-for="checkboxOption in field.options"
          :key="checkboxOption.value"
          :text="checkboxOption.text"
          :value="checkboxOption.value"
          :current-selected-values="value"
          @update="
            (e) => {
              updateValue(e)
              $emit('blur')
            }
          "
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BaseInputText from '@/components/my83-ui-kit/input/BaseInputText.vue'
import { Field, InputType } from '@/services/form/field.type'
import { ValidateMessage } from '@/services/validator/Validator'
import IntervalTextInput from './input-field/IntervalTextInput.vue'
import Select from './input-field/Select.vue'
import Radio from './input-field/Radio.vue'
import Checkbox from './input-field/Checkbox.vue'

@Component({
  components: {
    IntervalTextInput,
    Select,
    Radio,
    BaseInputText,
    Checkbox,
  },
})
export default class ProductQueryField extends Vue {
  @Prop({ type: Object, required: true })
  field!: Field<any>

  @Prop({ type: [String, Number, Array] })
  value: string | number | (string | number)[]

  @Prop({ type: Object })
  validateState: ValidateMessage

  @Prop({ type: Boolean, default: false })
  disableLabel: boolean

  @Prop({ type: String, default: 'button' })
  radioType: 'radio' | 'button'

  updateValue(value: string | number) {
    this.$emit('update', {
      id: this.field.id,
      value: this.field.type === InputType.NUMBER ? Number(value) : value,
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

    & > * {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
