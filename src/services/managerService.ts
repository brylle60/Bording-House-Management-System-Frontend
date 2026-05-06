import { BaseService } from './BaseService'

export interface ManagerDashboardPayload {
  rooms?: {
    total?: number
    vacant?: number
    occupied?: number
    reserved?: number
    under_maintenance?: number
    occupancy_rate_pct?: number
  }
  leases?: {
    total?: number
    active?: number
    pending?: number
    terminated?: number
    expired?: number
    expiring_soon?: number
  }
  maintenance?: {
    submitted?: number
    assigned?: number
    in_progress?: number
    completed?: number
    closed?: number
  }
}

export interface ManagerRoom {
  id: string
  room_number: string
  status: string
  current_occupants?: number
  capacity?: number
  monthly_rent?: number
}

export interface ManagerLease {
  id: string
  tenant_id: string
  room_id: string
  status: string
  start_date: string
  end_date?: string | null
  monthly_rent?: number
}

export interface ManagerPayment {
  id: string
  tenant_id: string
  room_id: string
  amount: number
  method: string
  status: string
  payment_date: string
}

export interface ManagerMaintenance {
  id: string
  room_id: string
  title: string
  priority: string
  status: string
  created_at: string
}

class ManagerService extends BaseService {
  constructor() {
    super('/manager')
  }

  getDashboard(): Promise<ManagerDashboardPayload> {
    return this.get('/dashboard')
  }

  listRooms(limit = 8): Promise<ManagerRoom[]> {
    return this.get('/rooms', { params: { limit } })
  }

  listLeases(limit = 8): Promise<ManagerLease[]> {
    return this.get('/leases', { params: { limit } })
  }

  listPayments(): Promise<ManagerPayment[]> {
    return this.get('/payments')
  }

  listMaintenance(): Promise<ManagerMaintenance[]> {
    return this.get('/maintenance')
  }
}

export const managerService = new ManagerService()
