<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
const BaseMobileSelect = () => import('./BaseMobileSelect.vue')
const BaseDesktopSelect = () => import('./BaseDesktopSelect.vue')

export default {
  components: {
    BaseMobileSelect,
    BaseDesktopSelect,
  },
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: '請選擇',
    },
    state: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    input(e) {
      this.$emit('update:value', e)
      this.$emit('input', e)
    },
  },
  render(h) {
    const selectComponent = this.$ua.isFromPc()
      ? BaseDesktopSelect
      : BaseMobileSelect

    return h(selectComponent, {
      props: {
        value: this.value,
        options: this.options,
        placeholder: this.placeholder,
        state: this.state,
        disabled: this.disabled,
      },
      on: {
        input: this.input,
      },
    })
  },
} as ComponentOption

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

export interface Instance extends Vue {}

export interface Data {}

export interface Methods {
  input(): void
}

export interface Computed {}

export interface Props {
  value: string | number
  options: Option[]
  placeholder: string
  state: string
  disabled: boolean
}

export interface Option {
  text: string
  value: string | number
}
</script>
