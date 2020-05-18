<template>
  <div class="BaseDesktopSelect__wrapper">
    <div
      ref="select"
      class="BaseDesktopSelect"
      :class="{ placeholder: selectedText === placeholder }"
      @click="(e) => panelHandler(e.type, true)"
      @mousedown="disableBlurHandler"
    >
      {{ selectedText }}
    </div>
    <div
      v-if="visible"
      ref="panel"
      class="BaseDesktopSelect__panel"
      tabindex="-1"
      @blur="(e) => panelHandler(e.type, false)"
    >
      <div
        v-for="(option, index) in options"
        :key="index"
        class="BaseDesktopSelect__option"
        :class="{ selected: value === option.value }"
        @mousedown="
          (e) => {
            panelHandler(e.type, false)
            input(option.value)
          }
        "
      >
        {{ option.text }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Props as BaseSelectProps } from './BaseSelect.vue'

export default {
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
  data() {
    return {
      visible: false,
      minWidth: null,
      disableBlur: false,
    }
  },
  computed: {
    selectedText() {
      const selected = this.options.find(
        (option) => option.value === this.value
      )
      return selected ? selected.text : this.placeholder
    },
  },
  methods: {
    input(value) {
      this.$emit('update:value', value)
      this.$emit('input', value)
    },
    panelHandler(eventType, status) {
      if (this.disableBlur && eventType === 'blur') {
        this.disableBlur = false
        return
      }
      this.visible = status

      if (status) {
        this.setMinWidth()
        this.setHeight()
        this.$nextTick(() => {
          this.$refs.panel.focus()
          this.scrollSelectedIntoView()
        })
      }
    },
    disableBlurHandler() {
      if (this.visible) {
        this.disableBlur = true
      }
    },
    setMinWidth() {
      this.$nextTick(() => {
        if (!this.minWidth) {
          this.minWidth = this.$el.clientWidth
        }

        this.$refs.panel.style.minWidth = `${this.minWidth}px`
      })
    },
    setHeight() {
      const screenHeight = document.documentElement.scrollHeight

      this.$nextTick(() => {
        const SelectEl = this.$refs.select
        const bottomPadding = SelectEl.getBoundingClientRect().top
        const defaultHeight = this.options.length * 40 + 26
        const maxHeight = 426
        const adjustHeight =
          Math.floor((screenHeight - bottomPadding - 26 - 40) / 40) * 40 + 26

        const height = Math.min(defaultHeight, maxHeight, adjustHeight)
        this.$refs.panel.style.height = `${height}px`
      })
    },
    scrollSelectedIntoView() {
      const selectedOptionEl = document.querySelector(
        '.BaseDesktopSelect__option.selected'
      )

      if (selectedOptionEl) {
        selectedOptionEl.scrollIntoView()
      }
    },
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
  $refs: {
    panel: HTMLElement
    select: HTMLElement
  }
}

export interface Data {
  visible: boolean
  minWidth: number
  disableBlur: boolean
}

export interface Methods {
  input(value: string | number): void
  panelHandler(eventType: string, status: boolean): void
  disableBlurHandler(): void
  setMinWidth(): void
  setHeight(): void
  scrollSelectedIntoView(): void
}

export interface Computed {
  selectedText: string
}

export interface Props extends BaseSelectProps {}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.BaseDesktopSelect {
  @include select;

  display: flex;
  align-items: center;

  &__wrapper {
    user-select: none;
    cursor: default;
  }

  &__panel {
    @include card-primary;

    position: absolute;
    padding: 12px 0;
    height: auto;
    overflow: auto;

    &:focus {
      outline: 0;
    }
  }

  &__option {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 30px 0 42px;
    color: $gray-primary;

    &:hover {
      background: $primary-bg;
    }

    &.selected {
      &:before {
        content: '';
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGZpbGw9IiNFRjZFMkUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTQuNDQzIDcuOTY0Yy0uMzc0LS40MDYtMS4wMDctLjQzMy0xLjQxMy0uMDU5LS40MDcuMzc0LS40MzMgMS4wMDYtLjA2IDEuNDEzbDMuNTEzIDMuODJjLjM3MS40MDMuOTk3LjQzMyAxLjQwNC4wNjhsNy4xODQtNi40NDJjLjQxLS4zNjkuNDQ1LTEgLjA3Ni0xLjQxMi0uMzY4LS40MTEtMS0uNDQ2LTEuNDEyLS4wNzdsLTYuNDQ4IDUuNzgzLTIuODQ0LTMuMDk0eiIvPgo8L3N2Zz4K');
        width: 18px;
        height: 18px;
        position: absolute;
        margin-left: -26px;
      }
    }
  }
}
</style>
