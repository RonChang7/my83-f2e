<template>
  <div class="ProductQueryField">
    <span class="ProductQueryField__name">{{ option.name }}：</span>
    <div class="ProductQueryField__field">
      <IntervalTextInput
        v-if="option.type === 'NUMBER'"
        :value="value"
        :option="option"
        :validate-state="validateState"
        @update="(e) => updateValue(e)"
        @blur="$emit('blur')"
      />
      <BaseInputText
        v-if="option.type === 'TEXT'"
        :value="value || ''"
        :placeholder="option.placeholder"
        :disabled="option.disabled"
      />
      <Select
        v-if="option.type === 'OPTION' && option.options"
        :value="value"
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
import BaseInputText from '@/components/my83-ui-kit/input/BaseInputText.vue'
import { Field, InputType } from '@/services/form/field.type'
import { ValidateMessage } from '@/services/validator/Validator'
import IntervalTextInput from './input-field/IntervalTextInput.vue'
import Select from './input-field/Select.vue'
import Radio from './input-field/Radio.vue'

@Component({
  components: {
    IntervalTextInput,
    Select,
    Radio,
    BaseInputText,
  },
})
export default class ProductQueryField extends Vue {
  @Prop({ type: Object, required: true })
  option!: Field<any>

  @Prop({ type: [String, Number] })
  value: string | number

  @Prop({ type: Object })
  validateState: ValidateMessage

  updateValue(value: string | number) {
    this.$emit('update', {
      id: this.option.id,
      value: this.option.type === InputType.NUMBER ? Number(value) : value,
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
