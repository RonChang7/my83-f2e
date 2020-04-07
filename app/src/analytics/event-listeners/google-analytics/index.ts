import { GoogleAnalytics } from '../../implementations/google-analytics'
import { RoleCode } from '@/api/type'

// MY83-rt 舊有邏輯： role 為數字 or 訪客
export const setRole = (role: RoleCode | '訪客') => {
  const ga = GoogleAnalytics.getInstance()
  ga.set({
    fieldName: 'dimension1',
    fieldValue: role.toString(),
  })
}

export const setUserId = (userId?: number) => {
  const ga = GoogleAnalytics.getInstance()
  ga.set({
    fieldName: 'userId',
    fieldValue: userId?.toString() || '',
  })
}

export const pageView = () => {
  const ga = GoogleAnalytics.getInstance()
  ga.pageView()
}
