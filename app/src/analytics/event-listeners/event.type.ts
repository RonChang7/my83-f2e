import { RoleCode } from '@/api/type'

export const enum EventTypes {
  PageView = 'PAGE_VIEW',
  SetRole = 'SET_ROLE',
  SetUserId = 'SET_USER_ID',
  ClickAction = 'CLICK_ACTION',
}

export type Payloads = {
  [EventTypes.PageView]: null
  [EventTypes.SetRole]: {
    role: RoleCode | '訪客'
  }
  [EventTypes.SetUserId]: {
    userId: number | undefined
  }
  [EventTypes.ClickAction]: {
    category: string
    action: string
    label: string
  }
}

export type Handlers = {
  [K in EventTypes]: (payload: Payloads[K]) => void
}
