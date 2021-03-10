import _ from 'lodash'
import { ImageConvertService } from '../image/ImageConvertService'

export const SINGLE_IMAGE_MAX_SIZE = 7
export const PREVIEW_FAILED = 'Image file cannot preview.'

const MEGABYTE = 1024 * 1024
const KILOBYTE = 1024
const ACCEPT_MIME_TYPES = ['image/gif', 'image/jpeg', 'image/png']

export class UploadImageService {
  public error: Record<string, ValidateMessage> = {}

  private _uploadImages: UploadImage[]

  private _seed: number

  private _previewImages: PreviewImage[]

  // 單位：MB
  private _imageSizeLimit: number

  // 單位：bytes
  private _currentBase64ImagesSize: number | undefined

  constructor(imageSizeLimit: number = SINGLE_IMAGE_MAX_SIZE) {
    this._uploadImages = []
    this._previewImages = []
    this._seed = 0
    this._setImageSizeLimit(imageSizeLimit)
  }

  public setInitId(id: number) {
    this._seed = id
  }

  public async upload(files: FileList) {
    if (!files.length) return

    if (!this._checkAcceptFileType(files)) {
      this.error.type = {
        message: `您選取了不支援的檔案格式，請重新選擇`,
      }
    } else {
      delete this.error.type

      this._uploadImages.push(
        ...[].slice.call(files).map((file: File) => {
          return {
            id: this._seed++,
            file,
          }
        })
      )
    }

    this._validate()
    await this._preview()
  }

  public remove(id: number) {
    const index = _.findIndex(this._uploadImages, (image) => image.id === id)
    if (index === -1) return

    this._uploadImages.splice(index, 1)
    this._previewImages.splice(index, 1)
    delete this.error[id]
    delete this.error.type
  }

  public get previewImages() {
    return this._previewImages
  }

  public get sizeLimit() {
    return this._imageSizeLimit
  }

  public currentBase64ImagesSize(unit?: Unit) {
    if (typeof this._currentBase64ImagesSize === 'undefined') {
      return 0
    }

    switch (unit) {
      case 'MB':
        return this._currentBase64ImagesSize / MEGABYTE
      case 'KB':
        return this._currentBase64ImagesSize / KILOBYTE
      case 'byte':
      default:
        return this._currentBase64ImagesSize
    }
  }

  public async base64Images() {
    const base64Images = await this._convert(
      this._uploadImages.map(({ file }) => file)
    )
    this._currentBase64ImagesSize = base64Images?.reduce((acc, curr) => {
      return acc + curr.length
    }, 0)
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
      if (file.size > this._imageSizeLimit * MEGABYTE) {
        this.error[id] = {
          message: `有照片超過最大尺寸 ${this._imageSizeLimit} MB 喔！`,
        }
      }
    })
  }

  private _setImageSizeLimit(size: number) {
    this._imageSizeLimit = size
  }

  private _checkAcceptFileType(files: FileList) {
    return [].slice
      .call(files)
      .every((file: File) => ACCEPT_MIME_TYPES.includes(file.type))
  }
}

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

type Unit = 'byte' | 'KB' | 'MB'
