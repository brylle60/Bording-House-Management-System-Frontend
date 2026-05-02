// ============================================================
//  ResidEase — AuthService  (extends BaseService)
//  POST /api/auth/login · register · forgot-password · refresh
// ============================================================

import { BaseService } from './BaseService'
import type { LoginCredentials, LoginResponse as BaseLoginResponse, RegisterPayload } from '../models'
import type { Role } from '../models'

// Extend the base LoginResponse to include role, id, and email
// which the backend returns but the base type didn't declare.
export type LoginResponse = BaseLoginResponse & {
  id?:    number
  email?: string
  role?:  Role
}

// Re-export other types so views can import them directly from authService
export type { LoginCredentials, RegisterPayload }

class AuthService extends BaseService {
  constructor() { super('/auth') }

  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.post<LoginResponse>('/login', {
      username_or_email: credentials.username_or_email,
      password:          credentials.password,
    })
  }

  register(payload: RegisterPayload): Promise<{ message: string }> {
    return this.post<{ message: string }>('/register', {
      username:   payload.username,
      email:      payload.email,
      password:   payload.password,
      first_name: payload.firstName,
      last_name:  payload.lastName,
      phone:      payload.phoneNumber,
    })
  }

  forgotPassword(email: string): Promise<{ message: string }> {
    return this.post<{ message: string }>('/forgot-password', { email })
  }

  verifyOtp(email: string, code: string): Promise<{ reset_token: string }> {
    return this.post<{ reset_token: string }>('/verify-otp', { email, code })
  }

  resetPassword(reset_token: string, new_password: string): Promise<{ message: string }> {
    return this.post<{ message: string }>('/reset-password', { reset_token, new_password })
  }

  refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    return this.post<{ access_token: string }>('/refresh', { refresh_token: refreshToken })
  }
}

export const authService = new AuthService()