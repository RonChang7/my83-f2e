import _ from 'lodash'
import { ImageConvertService } from '../image/ImageConvertService'

export class UploadImageService {
  public error: Record<string, ValidateMessage> = {}

  private _uploadImages: UploadImage[]

  private _seed: number

  private _previewImages: PreviewImage[]

  private _imageSizeLimit: number

  constructor(imageSizeLimit: number = SINGLE_IMAGE_MAX_SIZE) {
    this._uploadImages = []
    this._previewImages = []
    this._seed = 0
    this._setImageSizeLimit(imageSizeLimit)
  }

  public setInitId(id: number) {
    this._seed = id
  }

  public upload(files: FileList) {
    if (!files.length) return

    this._uploadImages.push(
      ...[].slice.call(files).map((file: File) => {
        return {
          id: this._seed++,
          file,
        }
      })
    )
    this._validate()
    this._preview()
  }

  public remove(id: number) {
    const index = _.findIndex(this._uploadImages, (image) => image.id === id)
    this._uploadImages.splice(index, 1)
    this._previewImages.splice(index, 1)
    delete this.error[id]
  }

  public get previewImages() {
    return this._previewImages
  }

  public async base64Images() {
    const base64Images = await this._convert(
      this._uploadImages.map(({ file }) => file)
    )
    return base64Images
  }

  private async _preview() {
    if (!this._uploadImages.length) return []
    const previewImages = await Promise.all(
      this._uploadImages
        .slice(this._previewImages.length, this._uploadImages.length)
        .map(({ id, file }) => this._previewSingleImage(file, id))
    )
    this._previewImages.push(...previewImages)
    return this._previewImages
  }

  private _previewSingleImage(file: File, id: number) {
    return new Promise<PreviewImage>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        e.target
          ? resolve({
              id,
              src: e.target.result as string,
            })
          : resolve({ id, src: '' })
      }
      reader.onerror = () => resolve({ id, src: '' })
      reader.readAsDataURL(file)
    })
  }

  private _convert(files: File[]) {
    const convert = new ImageConvertService({
      quality: 0.6,
      convertSize: 1000000,
    })
    return convert.convert(files)
  }

  private _validate() {
    this._uploadImages.forEach(({ id, file }) => {
      if (file.size > this._imageSizeLimit) {
        this.error[id] = {
          message: 'Image file size too large.',
        }
      }
    })
  }

  private _setImageSizeLimit(size: number) {
    this._imageSizeLimit = size
  }
}

export const SINGLE_IMAGE_MAX_SIZE = 5 * 1024 * 1024

export const PREVIEW_FAILED = 'Image file cannot preview.'

export interface ValidateMessage {
  message: string
}

export interface PreviewImage {
  id: number
  src: string
}

interface UploadImage {
  id: number
  file: File
}
