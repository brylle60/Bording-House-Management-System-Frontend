import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { User, Role } from '../models'

function normalizeRole(role?: string): Role {
  if (!role || typeof role !== 'string') return Role.TENANT

  const upper = role.toUpperCase()
  if (upper === Role.ADMIN   || upper === 'ADMIN'   || upper === 'ROLE_ADMIN')   return Role.ADMIN
  if (upper === Role.MANAGER || upper === 'MANAGER' || upper === 'ROLE_MANAGER') return Role.MANAGER
  if (upper === Role.STAFF   || upper === 'STAFF'   || upper === 'ROLE_STAFF'
   || upper === 'ROLE_MAINTENANCE' || upper === 'MAINTENANCE')                   return Role.STAFF
  if (upper === Role.TENANT  || upper === 'TENANT'  || upper === 'ROLE_TENANT')  return Role.TENANT

  return Role.TENANT
}

class Session {
  readonly accessToken:  string
  readonly refreshToken: string
  readonly user:         User

  constructor(accessToken: string, refreshToken: string, user: User) {
    this.accessToken  = accessToken
    this.refreshToken = refreshToken
    this.user         = user
  }

  save(): void {
    localStorage.setItem('access_token',  this.accessToken)
    localStorage.setItem('refresh_token', this.refreshToken)
    localStorage.setItem('user', JSON.stringify({
      id: this.user.id, username: this.user.username,
      email: this.user.email, role: this.user.role, isActive: this.user.isActive,
    }))
  }

  static clear(): void {
    ['access_token', 'refresh_token', 'user'].forEach(k => localStorage.removeItem(k))
  }

  static restore(): Session | null {
    const at  = localStorage.getItem('access_token')
    const rt  = localStorage.getItem('refresh_token')
    const raw = localStorage.getItem('user')
    if (!at || !raw) return null
    try {
      const u    = JSON.parse(raw)
      const user = new User(u.id ?? 0, u.username, u.email ?? '', normalizeRole(u.role), u.isActive ?? true)
      return new Session(at, rt ?? '', user)
    } catch { return null }
  }
}

export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(Session.restore())

  const isAuthenticated = computed(() => session.value !== null)
  const user            = computed(() => session.value?.user ?? null)
  const token           = computed(() => session.value?.accessToken  ?? null)
  const refreshToken    = computed(() => session.value?.refreshToken ?? null)
  const isAdmin         = computed(() => user.value?.isAdmin()   ?? false)
  const isManager       = computed(() => user.value?.isManager() ?? false)
  const isStaff         = computed(() => user.value?.isStaff()   ?? false)
  const isTenant        = computed(() => user.value?.isTenant()  ?? false)

  function login(payload: {
    username:      string
    access_token:  string
    refresh_token: string
    id?:           string | number
    email?:        string
    role?:         Role | string
  }): void {
    const newUser = new User(
      (payload.id ?? 0) as unknown as number,  // ✅ cast: backend returns UUID string
      payload.username,
      payload.email ?? '',
      normalizeRole(payload.role),
      true
    )
    const s = new Session(payload.access_token, payload.refresh_token, newUser)
    s.save()
    session.value = s
  }

  function logout(): void {
    Session.clear()
    session.value = null
  }

  function updateToken(newAccessToken: string): void {
    if (!session.value) return
    const s = new Session(newAccessToken, session.value.refreshToken, session.value.user)
    s.save()
    session.value = s
  }

  return { isAuthenticated, user, token, refreshToken, isAdmin, isManager, isStaff, isTenant, login, logout, updateToken }
})