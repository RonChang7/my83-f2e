import { FacebookPixel } from '../../implementations/facebook-pixel'
import { EventTypes, Handlers } from '../event.type'

export const pageView: Handlers[EventTypes.PageView] = () => {
  const facebook = FacebookPixel.getInstance()
  facebook.pageView()
}
