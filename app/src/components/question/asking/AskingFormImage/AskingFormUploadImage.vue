<template>
  <div class="AskingFormUploadImage">
    <AskingFormBaseField :title="title" :required="required">
      <BaseInputMessage v-if="legend" :msg="legend" type="legend" />
      <BaseInputMessage v-if="errMsg" :msg="errMsg" />
      <BaseButton
        size="m"
        type="secondary"
        @click.native="uploadButtonClickHandler"
      >
        附加圖片
      </BaseButton>
      <input
        ref="imageFilesPicker"
        type="file"
        accept="image/gif, image/jpeg, image/png"
        multiple
        @change="imageUploadHandler"
      />
    </AskingFormBaseField>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import AskingFormBaseField, {
  Props as FieldProps,
} from '../AskingFormBaseField.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'

const options: ComponentOption = {
  components: {
    AskingFormBaseField,
    BaseButton,
    BaseInputMessage,
  },
  props: {
    legend: {
      type: String,
      default: '',
    },
    errMsg: {
      type: String,
      default: '',
    },
    // AskingFormBaseField
    title: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    update(value) {
      this.$emit('update:value', value)
      this.$emit('update', value)
    },
    uploadButtonClickHandler() {
      this.$refs.imageFilesPicker.click()
    },
    imageUploadHandler(e) {
      this.$emit('change', (e.target as HTMLInputElement).files)
      this.resetUploadFiles()
    },
    resetUploadFiles() {
      this.$refs.imageFilesPicker.value = ''
    },
  },
}

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export type ComponentInstance = CombinedVueInstance<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export interface Instance extends Vue {
  $refs: {
    imageFilesPicker: HTMLInputElement
  }
}

export interface Data {}

export type Methods = {
  update(value: string): void
  uploadButtonClickHandler(): void
  imageUploadHandler(e: Event): void
  resetUploadFiles(): void
}

export interface Computed {}

export interface Props extends FieldProps {
  legend: string
  errMsg: string
}

export default options
</script>

<style lang="scss" scoped>
.AskingFormUploadImage {
  input[type='file'] {
    display: none;
  }

  [type='button'] {
    margin-top: 16px;
  }
}
</style>
