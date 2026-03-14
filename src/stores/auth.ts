import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface AuthUser {
  username:      string
  access_token:  string
  refresh_token: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)

  // Rehydrate from localStorage on page reload
  const _token    = localStorage.getItem('access_token')
  const _username = localStorage.getItem('username')
  if (_token && _username) {
    user.value = {
      username:      _username,
      access_token:  _token,
      refresh_token: localStorage.getItem('refresh_token') || '',
    }
  }

  const isAuthenticated = computed(() => !!user.value)

  function login(data: AuthUser) {
    user.value = data
    localStorage.setItem('access_token',  data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('username',      data.username)
  }

  function logout() {
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('username')
  }

  return { user, isAuthenticated, login, logout }
})