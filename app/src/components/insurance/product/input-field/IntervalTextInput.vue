<template>
  <div class="IntervalTextInput">
    <BaseInputText
      :value="String(value)"
      type="number"
      :state="isValidated ? '' : 'error'"
      class="input"
      @update="(e) => $emit('update', e)"
      @enter="$emit('blur')"
      @blur="$emit('blur')"
    />
    <BaseInputMessage
      v-if="!isValidated"
      class="errorMessage"
      :msg="option.validateMsg"
    />
    <span v-if="unit" class="unit">
      {{ unit }}
    </span>
    <span v-if="rangeWording" class="range" :class="{ error: !isValidated }">
      {{ rangeWording }}
    </span>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { FieldOption } from '@/services/product/field.type'
import { IntervalType } from '@/api/insurance/product.type'
import BaseInputText from '@/components/my83-ui-kit/input/BaseInputText.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'

@Component({
  components: {
    BaseInputText,
    BaseInputMessage,
  },
})
export default class IntervalTextInput extends Vue {
  @Prop({ type: [String, Number], required: true })
  value!: string | number

  @Prop({ type: Object, required: true })
  option: FieldOption<IntervalType>

  @Prop({ type: Boolean, default: true })
  isValidated: boolean

  get unit() {
    return this.option.unit || ''
  }

  get rangeWording() {
    if (!_.isUndefined(this.option.min) && !_.isUndefined(this.option.max)) {
      return this.option.unit
        ? `(${this.option.min} ~ ${this.option.max} ${this.option.unit})`
        : `(${this.option.min} ~ ${this.option.max})`
    }

    return ''
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.IntervalTextInput {
  display: flex;
  align-items: baseline;

  ::v-deep > .errorMessage {
    position: absolute;
    text-align: center;
    width: 64px;
    margin-top: 44px;
    padding: 0;
  }

  .input {
    width: 80px;
  }

  .unit {
    margin-left: 8px;
  }

  .range {
    margin-left: 4px;
    color: $secondary-color;
    font-size: 0.875rem;

    &.error {
      color: $error-color;
    }
  }
}
</style>
