import Compressor from 'compressorjs'

export class ImageConvertService {
  private _options: Compressor.Options

  constructor(options?: Compressor.Options) {
    if (options) {
      this._options = { ...options }
    }
  }

  public convert(files: File[]) {
    if (!files.length) return
    return Promise.all<string>(
      files.map((file) => this._convertSingleImage(file))
    )
  }

  private _convertSingleImage(file: File) {
    return new Promise<string>((resolve, reject) => {
      // eslint-disable-next-line no-new
      new Compressor(file, {
        ...this._options,
        success: (result) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            e.target ? resolve(e.target.result as string) : reject(e.target)
          }
          reader.onerror = (error) => reject(error)
          reader.readAsDataURL(result)
        },
        error: (err) => reject(err),
      })
    })
  }
}
