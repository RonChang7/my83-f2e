import { UserRole } from '@/services/auth/auth'

export const AvatarMap: Record<UserRole, string> = {
  guest: '',
  client: 'front/common/avatar/client_girl1.png',
  sales: 'front/common/avatar/sales_girl4.png',
}
