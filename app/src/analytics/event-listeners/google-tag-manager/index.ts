import { GoogleTagManager } from '../../implementations/google-tag-manager'
import { EventTypes, Handlers } from '../event.type'

/**
 * MY83-rt 舊有邏輯： role 為數字 or '訪客'
 * role: '訪客' 為 '訪客'
 * role: 0 為 '保戶' or '管理員' (之前有 2 的身份表示管理員，到新版之後整合為 0)
 * role: 1 為 '業務員'
 */
export const setRole: Handlers[EventTypes.SetRole] = ({ role }) => {
  const gtm = GoogleTagManager.getInstance()
  gtm.set({
    fieldName: 'dimension1',
    fieldValue: role.toString(),
  })
}

export const setUserId: Handlers[EventTypes.SetUserId] = ({ userId }) => {
  const gtm = GoogleTagManager.getInstance()
  gtm.set({
    fieldName: 'userId',
    fieldValue: userId?.toString() || '',
  })
}

export const pageView: Handlers[EventTypes.PageView] = () => {
  const gtm = GoogleTagManager.getInstance()
  gtm.pageView()
}

export const clickAction: Handlers[EventTypes.ClickAction] = (payload) => {
  const gtm = GoogleTagManager.getInstance()
  gtm.event({
    eventCategory: payload.category,
    eventAction: payload.action,
    eventLabel: payload.label,
  })
}
