import Cookies from 'js-cookie'
import { User } from './user'
const RoleTokenKey = 'role'

// 嫌疑犯檢查功能
export class Suspect {
  public static setRoleCode() {
    const user = User.getInstance()
    if (!Cookies.get(RoleTokenKey)) {
      Cookies.set(RoleTokenKey, user.userState.roleCode.toString())
    }
  }
}
