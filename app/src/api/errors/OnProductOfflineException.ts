import { LinkButton } from '../type'

export class OnProductOfflineException extends Error {
  constructor(private btn: LinkButton) {
    super()
  }

  public getLinkButton() {
    return this.btn
  }
}
