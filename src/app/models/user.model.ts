export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  isAdmin: boolean
}

export interface AuthResponse {
  token: string
  email: string
  firstName: string
  lastName: string
  isAdmin: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}
