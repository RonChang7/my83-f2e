import { GoogleAnalytics } from '../../implementations/google-analytics'
import { EventTypes, Handlers } from '../event.type'

// MY83-rt 舊有邏輯： role 為數字 or '訪客'
export const setRole: Handlers[EventTypes.SetRole] = ({ role }) => {
  const ga = GoogleAnalytics.getInstance()
  ga.set({
    fieldName: 'dimension1',
    fieldValue: role.toString(),
  })
}

export const setUserId: Handlers[EventTypes.SetUserId] = ({ userId }) => {
  const ga = GoogleAnalytics.getInstance()
  ga.set({
    fieldName: 'userId',
    fieldValue: userId?.toString() || '',
  })
}

export const pageView: Handlers[EventTypes.PageView] = () => {
  const ga = GoogleAnalytics.getInstance()
  ga.pageView()
}
