<script lang="ts">
import Vue, { VNode } from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import AskingFormUploadImage from './AskingFormImage/AskingFormUploadImage.vue'
import AskingFormImagePreview from './AskingFormImage/AskingFormImagePreview.vue'
import {
  UploadImageService,
  PreviewImage,
  ValidateMessage,
} from '@/services/question/UploadImageService'

const options: ComponentOption = {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      previewImages: [],
      error: {},
    }
  },
  methods: {
    uploadImageHandler(files) {
      if (!files) return

      this.uploadImageService.upload(files)
      this.error = this.uploadImageService.error
    },
    removeImageHandler(id) {
      this.uploadImageService.remove(id)
    },
  },
  computed: {
    $imagePreview() {
      const h = this.$createElement

      return this.previewImages.length
        ? h(AskingFormImagePreview, {
            props: {
              images: this.previewImages,
              error: this.error,
            },
            on: {
              'remove-image': this.removeImageHandler,
            },
          })
        : h()
    },
  },
  mounted() {
    this.uploadImageService = new UploadImageService()
    this.previewImages = this.uploadImageService.previewImages
  },
  render(h) {
    return h(
      'div',
      {
        class: 'AskingFormUploadImageField',
      },
      [
        h(AskingFormUploadImage, {
          props: {
            title: this.title,
          },
          on: {
            change: this.uploadImageHandler,
          },
        }),
        this.$imagePreview,
      ]
    )
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
  uploadImageService: UploadImageService
}

export interface Data {
  previewImages: PreviewImage[]
  error: Record<string, ValidateMessage>
}

export interface Methods {
  uploadImageHandler(files: FileList | null): void
  removeImageHandler(id: number): void
}

export interface Computed {
  $imagePreview: VNode
}

export interface Props {
  title: string
}

export default options
</script>
