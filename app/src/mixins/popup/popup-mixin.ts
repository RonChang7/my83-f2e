import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import freezeWindowScroll from '@/utils/freeze-window-scroll'
import { PopupManager } from '@/services/popup-manager/popup-manager'
import './popup-shadow.scss'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    shadowStyle: {
      type: Object,
      default: () => {
        return {
          backgroundColor: '#000',
          opacity: '0.6',
        } as Partial<CSSStyleDeclaration>
      },
    },
    lockScroll: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    open() {
      PopupManager.open(this.popupKey!)

      if (this.lockScroll) {
        freezeWindowScroll(true)
      }
    },
    close() {
      PopupManager.close(this.popupKey!)

      if (this.lockScroll) {
        freezeWindowScroll(false)
      }
    },
  },
  watch: {
    visible(val) {
      if (val) {
        if (process.server) {
          throw new Error('Do not open popup during server-side rendering.')
        }

        this.open()
      } else {
        this.close()
      }
    },
  },
  beforeCreate() {
    if (process.server) return

    const key = PopupManager.register(this as ComponentInstance)
    if (!key) throw new Error('沒有正確註冊 PopupManager')

    this.popupKey = key
  },
  mounted() {
    this.visible && this.open()
  },

  beforeDestroy() {
    this.close()

    PopupManager.unregister(this.popupKey!)
    this.popupKey = null
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

export interface Instance extends Vue {
  popupKey: string | null
}

export interface Data {}

export interface Methods {
  open(): void
  close(): void
}

export interface Computed {}

export interface Props {
  visible: boolean
  shadowStyle: Partial<CSSStyleDeclaration>
  lockScroll: boolean
}
