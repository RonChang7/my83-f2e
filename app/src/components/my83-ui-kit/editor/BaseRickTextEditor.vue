<template>
  <div class="BaseRickTextEditor">
    <Editor
      ref="editor"
      v-model="editorContent"
      :init="init"
      model-events="change keyup input undo redo cut paste blur"
      @onFocus="focusHandler(true)"
      @onBlur="focusHandler(false)"
      @onPaste="$emit('paste')"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Settings as TinymceSettings, Editor as TinymceEditor } from 'tinymce'
import './tinymce'
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
    minHeight: {
      type: Number,
      default: 200,
    },
  },
  data() {
    const plugins = ['table', 'link', 'paste', 'fullscreen', 'lists']

    return {
      isFocus: false,
      init: {
        content_css:
          '/static/tinymce/5.2.0/skins/content/default/content.min.css',
        skin_url: '/static/tinymce/5.2.0/skins/ui/oxide',

        // 調整 placeholder 樣式 與 編輯器字型
        content_style:
          '.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before { color: #b4b4b4; }' +
          '.mce-content-body { font-family: "Noto Sans TC", sans-serif; }',
        language: 'zh_TW',
        plugins,
        menubar: '',
        toolbar:
          'undo redo | bold italic underline forecolor backcolor | numlist bullist table link | fullscreen',
        toolbar_mode: 'floating',
        elementpath: false,
        branding: false,
        min_height: this.minHeight,
        placeholder: '留下你的想法與意見...',

        // link plugin setting
        default_link_target: '_blank',
        link_assume_external_targets: true,
        link_context_toolbar: true,
        link_title: false,
        target_list: false,

        // newline setting
        forced_root_block: false,
        entity_encoding: 'raw',

        // paste
        paste_webkit_styles: 'color text-decoration',
        paste_retain_style_properties: 'color text-decoration',

        /**
         * valid HTML element
         * https://www.tiny.cloud/docs/configure/content-filtering/#valid_elements
         */
        valid_elements:
          'br,@[style],strong,em,span,p/div,ul,ol,li,a[href|target|rel=noopener nofollow],caption[*],table[*],tbody[*],thead[*],tfoot[*],td[*],tr[*]',

        mobile: {
          plugins: [...plugins, 'autoresize'],
          autoresize_bottom_margin: 0,
          max_height: 450,
        },
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
  mounted() {
    const editor: TinymceEditor = this.$refs.editor.editor
    /**
     * https://www.tiny.cloud/docs/api/tinymce/tinymce.editor/#focus
     * 設定 autofocus
     */
    editor.focus(false)
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
    editor: Vue
  }
}

export interface Data {
  isFocus: boolean
  init: TinymceSettings
}

export interface Methods {
  focusHandler(status: boolean): void
}

export interface Computed {
  editorContent: string
}

export interface Props {
  content: string
  minHeight: number
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
