<template>
  <div class="ProductQueryField">
    <span class="ProductQueryField__name">{{ option.name }}：</span>
    <div class="ProductQueryField__field">
      <BaseInputText
        v-if="option.type === 'NUMBER'"
        :value="String(value)"
        type="number"
        class="input"
        :state="isValidated ? '' : 'error'"
        @update="(e) => inputValidate(Number(e))"
        @enter="$emit('blur')"
        @blur="$emit('blur')"
      />
      <BaseSelect
        v-if="option.type === 'OPTION' && option.options"
        :value="value || 0"
        :options="option.options"
        :disabled="typeof value === 'undefined'"
        :hide-icon="typeof value === 'undefined'"
        class="select"
        @input="
          (e) => {
            updateValue(e)
            $emit('blur')
          }
        "
      />
      <template v-if="option.type === 'RADIO' && option.options">
        <BaseRadio
          v-for="radioOption in option.options"
          :key="radioOption.value"
          type="button"
          :label="radioOption.text"
          :value="radioOption.value"
          :current-selected-value="value"
          class="radio"
          @update="
            (e) => {
              updateValue(e)
              $emit('blur')
            }
          "
        />
      </template>
      <BaseInputMessage
        v-if="!isValidated"
        class="error"
        :msg="option.validateMsg"
      />
    </div>
    <span v-if="unit" class="ProductQueryField__unit">
      {{ unit }}
    </span>
    <span
      v-if="rangeWording"
      class="ProductQueryField__range"
      :class="{ error: !isValidated }"
    >
      {{ rangeWording }}
    </span>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { FieldOption } from '@/services/product/ProductQueryFormService'
import { IntervalType, OptionValueType } from '@/api/insurance/product.type'
import BaseInputText from '@/components/my83-ui-kit/input/BaseInputText.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'
import BaseSelect from '@/components/my83-ui-kit/input/BaseSelect.vue'
import BaseRadio from '@/components/my83-ui-kit/input/BaseRadio.vue'

@Component({
  components: {
    BaseInputText,
    BaseInputMessage,
    BaseSelect,
    BaseRadio,
  },
})
export default class ProductQueryField extends Vue {
  @Prop({ type: Object, required: true })
  option!: FieldOption<OptionValueType>

  @Prop({ type: [String, Number], required: true })
  value!: string | number

  isValidated: boolean = true

  @Watch('option')
  onOptionChange() {
    this.inputValidate(Number(this.value))
  }

  get unit() {
    return this.option.unit || ''
  }

  get rangeWording() {
    const { min, max } = this.option as FieldOption<IntervalType>
    if (!_.isUndefined(min) && !_.isUndefined(max)) {
      return this.unit ? `(${min} ~ ${max} ${this.unit})` : `(${min} ~ ${max})`
    }
  }

  inputValidate(value: number) {
    const { min, max } = this.option as FieldOption<IntervalType>
    if (_.isUndefined(min) || _.isUndefined(max)) return

    this.isValidated = !(value < min || value > max)
    this.updateValue(value)
    this.$emit('validate', this.isValidated)
  }

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

  &__unit {
    margin-left: 8px;
  }

  &__range {
    margin-left: 4px;
    color: $secondary-color;
    font-size: 0.875rem;

    &.error {
      color: $error-color;
    }
  }

  &__field {
    overflow: hidden;

    ::v-deep > .error {
      position: absolute;
      text-align: center;
      width: 64px;
      padding-top: 4px;
    }

    .input {
      width: 80px;
    }

    .select {
      min-width: 114px;
    }

    .radio {
      width: 64px;

      &:not(:last-child) {
        margin-right: 8px;
      }
    }
  }
}
</style>
