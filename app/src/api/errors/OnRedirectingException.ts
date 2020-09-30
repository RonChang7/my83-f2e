export class OnRedirectingException extends Error {
  constructor(private link: string) {
    super()
  }

  public getRedirectLink() {
    return this.link
  }
}
