import { UserRole } from '@/services/user/user'

export const AvatarMap: Record<UserRole, string> = {
  guest: '',
  client: '/images/avatar/client_girl1.png',
  sales: '/images/avatar/sales_girl4.png',
}
