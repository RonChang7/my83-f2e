<template>
  <div class="IntervalTextInput">
    <BaseInputText
      :value="String(value)"
      type="number"
      :state="isValidated ? '' : validateState.state"
      class="input"
      @update="(e) => $emit('update', e)"
      @enter="$emit('blur')"
      @blur="$emit('blur')"
    />
    <BaseInputMessage
      v-if="!isValidated"
      class="errorMessage"
      :msg="validateState.message"
    />
    <span v-if="option.postfix" class="unit">
      {{ option.postfix }}
    </span>
    <span v-if="option.range" class="range" :class="{ error: !isValidated }">
      {{ option.range }}
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Field, FieldType } from '@/services/form/field.type'
import BaseInputText from '@/components/my83-ui-kit/input/BaseInputText.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'
import { ValidateMessage } from '@/services/validator/Validator'

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
  option: Field<FieldType.INTERVAL>

  @Prop({ type: Object })
  validateState: ValidateMessage

  get isValidated() {
    return !(this.validateState && this.validateState.state === 'error')
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
    width: 100px;
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
