<script lang="ts">
import _ from 'lodash'
import Vue, { VNode } from 'vue'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
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
    editPostImages: {
      type: Array as PropType<Props['editPostImages']>,
      default: () => [],
    },
    initId: {
      type: Number,
      default: 0,
    },
    sizeLimit: {
      type: Number,
      required: true,
    },
    countLimit: {
      type: Number,
      default: 30,
    },
    errMsg: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      previewImages: [],
      error: {},
      inputFileErrMsg: '',
    }
  },
  methods: {
    async uploadImageHandler(files) {
      if (!files) return

      await this.uploadImageService.upload(files)
      this.error = this.uploadImageService.error
      this.validate()
    },
    removeImageHandler(id) {
      if (id < this.initId) {
        this.$emit('remove-edit-post-image', id)
      } else {
        this.uploadImageService.remove(id)
      }
      this.validate()
    },
    validate() {
      if (
        this.editPostImages.length + this.previewImages.length >
        this.countLimit
      ) {
        this.inputFileErrMsg = `超過 ${this.countLimit} 張不能上傳喔！`
        this.$emit('validate', this.inputFileErrMsg)
        return
      }

      if (this.error.type) {
        this.inputFileErrMsg = this.error.type.message
        this.$emit('validate', this.inputFileErrMsg)
        return
      }

      const errorMessages = _.values(this.error)
      this.inputFileErrMsg = errorMessages.length
        ? errorMessages[0].message
        : ''
      this.$emit('validate', this.inputFileErrMsg)
    },
    async convert() {
      const compressImages = await this.uploadImageService.base64Images()
      return compressImages
    },
  },
  computed: {
    $imagePreview() {
      const h = this.$createElement

      return this.previewImages.length || this.editPostImages.length
        ? h(AskingFormImagePreview, {
            props: {
              images: [...this.editPostImages, ...this.previewImages],
              error: this.error,
            },
            on: {
              'remove-image': this.removeImageHandler,
            },
          })
        : h()
    },
  },
  watch: {
    initId(val: number) {
      this.uploadImageService.setInitId(val)
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
            legend: `照片包含「商品名稱、保額、保費、年期」，方便業務員為您分析保單\n請遮蔽照片中的重要個資，確保個資不外洩\n每張照片最大尺寸為 ${this.sizeLimit} MB`,
            errMsg: this.errMsg || this.inputFileErrMsg,
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
  inputFileErrMsg: string
}

export interface Methods {
  uploadImageHandler(files: FileList | null): void
  removeImageHandler(id: number): void
  validate(): void
  convert(): Promise<string[] | undefined>
}

export interface Computed {
  $imagePreview: VNode
}

export interface Props {
  title: string
  editPostImages: PreviewImage[]
  initId: number
  sizeLimit: number
  countLimit: number
  errMsg: string
}

export default options
</script>
