/**
 * Copy from https://github.com/nuxt-community/recaptcha-module v0.6.2
 */

export interface ReCaptchaOptions {
  /**
   * Toggles badge element visibility (v3)
   */
  hideBadge?: boolean

  /**
   * Site key to send requests
   */
  siteKey: string

  /**
   * Version
   */
  version: number
}

export interface ReCaptchaInstance {
  /**
   * Options
   */
  options: ReCaptchaOptions

  /**
   * Destroy ReCaptcha
   */
  destroy(): void

  /**
   * Returns a verify token (v3)
   * @param action
   */
  execute(action: string): Promise<string>

  /**
   * Returns a verify token (v2)
   */
  getResponse(): Promise<string>

  /**
   * Initialize ReCaptcha
   */
  init(): Promise<any>

  /**
   * Reset ReCaptcha (v2)
   */
  reset(): void
}
