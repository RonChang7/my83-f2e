import { FacebookPixel } from '../../implementations/facebook-pixel'

export const pageView = () => {
  const facebook = FacebookPixel.getInstance()
  facebook.pageView()
}
