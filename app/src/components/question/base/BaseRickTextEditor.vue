<template>
  <div class="BaseRickTextEditor">
    <Editor
      v-model="editorContent"
      :init="init"
      placeholder="留下你的想法與意見..."
      @onFocus="focusHandler(true)"
      @onBlur="focusHandler(false)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/table'
import 'tinymce/plugins/link'
import '@/libs/tinymce/5.2.0/langs/zh_TW'
import Editor from '@tinymce/tinymce-vue'

export default {
  components: {
    Editor,
  },
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isFocus: false,
      init: {
        content_css:
          '/static/tinymce/5.2.0/skins/content/default/content.min.css',
        skin_url: '/static/tinymce/5.2.0/skins/ui/oxide',
        content_style:
          '.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before { color: #b4b4b4; }' +
          '.mce-content-body { font-family: "Noto Sans TC", sans-serif; }',
        language: 'zh_TW',
        plugins: 'table link',
        menubar: '',
        toolbar: 'bold italic underline forecolor backcolor table link',
        default_link_target: '_blank',
        link_assume_external_targets: true,
        link_context_toolbar: true,
        elementpath: false,
        branding: false,
        min_height: 200,
      },
    }
  },
  methods: {
    focusHandler(status) {
      this.isFocus = status
    },
  },
  computed: {
    editorContent: {
      get() {
        return this.content
      },
      set(value) {
        this.$emit('update:content', value)
      },
    },
  },
  watch: {
    isFocus(val) {
      const editorEl = document.querySelector('.tox-tinymce') as HTMLElement
      if (val) {
        editorEl.style.borderBottom = '2px solid #344b97'
      } else {
        editorEl.style.borderBottom = ''
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

export interface Instance extends Vue {}

export interface Data {
  isFocus: boolean
  init: Object
}

export interface Methods {
  focusHandler(status: boolean): void
}

export interface Computed {
  editorContent: string
}

export interface Props {
  content: string
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.BaseRickTextEditor {
  &::v-deep .tox-toolbar__primary,
  &::v-deep .tox-toolbar,
  &::v-deep .tox-edit-area > iframe,
  &::v-deep .tox-statusbar {
    background: $input-field-default-bg;
  }

  &::v-deep .tox-statusbar {
    border-top: 0;
  }

  &::v-deep .tox-tinymce {
    border: 0;
    border-radius: $border-radius;
  }
}
</style>
