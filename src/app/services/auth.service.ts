import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, tap } from "rxjs"
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../models/user.model"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/api/auth`
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private http: HttpClient) {
    this.loadUserFromStorage()
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(tap((response) => this.setCurrentUser(response)))
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(tap((response) => this.setCurrentUser(response)))
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.currentUserSubject.next(null)
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value
    return user?.isAdmin || false
  }

  private setCurrentUser(authResponse: AuthResponse): void {
    const user: User = {
      id: 0, // Will be set from JWT
      email: authResponse.email,
      firstName: authResponse.firstName,
      lastName: authResponse.lastName,
      isAdmin: authResponse.isAdmin,
    }

    localStorage.setItem("token", authResponse.token)
    localStorage.setItem("user", JSON.stringify(user))
    this.currentUserSubject.next(user)
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem("user")
    if (userJson) {
      const user = JSON.parse(userJson)
      this.currentUserSubject.next(user)
    }
  }
}
