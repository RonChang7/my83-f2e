import { GoogleAnalytics } from '../../implementations/google-analytics'
import { EventTypes, Handlers } from '../event.type'

/**
 * MY83-rt 舊有邏輯： role 為數字 or '訪客'
 * role: '訪客' 為 '訪客'
 * role: 0 為 '保戶' or '管理員' (之前有 2 的身份表示管理員，到新版之後整合為 0)
 * role: 1 為 '業務員'
 */
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

export const clickAction: Handlers[EventTypes.ClickAction] = (payload) => {
  const ga = GoogleAnalytics.getInstance()
  ga.event({
    eventCategory: payload.category,
    eventAction: payload.action,
    eventLabel: payload.label,
  })
}
