import { BaseService } from './BaseService'

type ApiResponse<T> = {
  is_success: boolean
  message: string
  data: T
  status_code: number
}

export type NotificationItem = {
  id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
  notification_type: string
  priority: string
}

class NotificationService extends BaseService {
  constructor() {
    super('/notifications')
  }

  async getUnreadCount(): Promise<number> {
    const res = await this.get<ApiResponse<{ unread_count?: number; count?: number }>>('/me/unread-count')
    return res.data?.unread_count ?? res.data?.count ?? 0
  }

  async getUnread(limit = 20): Promise<NotificationItem[]> {
    const res = await this.get<ApiResponse<NotificationItem[]>>('/me/unread', { params: { limit } })
    return res.data ?? []
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.patch<ApiResponse<unknown>>(`/${notificationId}/read`)
  }

  async markAllAsRead(): Promise<void> {
    await this.patch<ApiResponse<unknown>>('/me/read-all')
  }
}

export const notificationService = new NotificationService()
