import Cookies from 'js-cookie'
import { User } from './user'
const enum SuspectCookieKey {
  ROLE = 'role',
  MEMBER = 'member',
}

// 嫌疑犯檢查功能
export class Suspect {
  public static init() {
    Suspect.setRoleCode()
    Suspect.setMemberId()
  }

  public static getRoleCode() {
    return Cookies.get(SuspectCookieKey.ROLE)
  }

  public static getMemberId() {
    return Cookies.get(SuspectCookieKey.MEMBER)
  }

  private static setRoleCode() {
    const user = User.getInstance()
    if (!Cookies.get(SuspectCookieKey.ROLE)) {
      Cookies.set(SuspectCookieKey.ROLE, user.userState.roleCode.toString())
    }
  }

  private static setMemberId() {
    const user = User.getInstance()
    if (!Cookies.get(SuspectCookieKey.MEMBER)) {
      Cookies.set(SuspectCookieKey.MEMBER, user.userState.id.toString())
    }
  }
}
