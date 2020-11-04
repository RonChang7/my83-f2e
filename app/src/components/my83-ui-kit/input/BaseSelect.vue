<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Option } from './type'
import BaseMobileSelect from './BaseSelect/BaseMobileSelect.vue'
import BaseDesktopSelect from './BaseSelect/BaseDesktopSelect.vue'
import DeviceMixin, {
  Computed as DeviceMixinComputed,
} from '@/mixins/device/device-mixins'

export default {
  mixins: [DeviceMixin],
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
    hideIcon: {
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
    const selectComponent = this.isDesktop
      ? BaseDesktopSelect
      : BaseMobileSelect

    return h(selectComponent, {
      props: this.$props,
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

export type Methods = {
  input(e: string | number): void
}

export interface Computed extends DeviceMixinComputed {}

export interface Props {
  value: string | number
  options: Option[]
  placeholder: string
  state: string
  disabled: boolean
  hideIcon: boolean
}
</script>
