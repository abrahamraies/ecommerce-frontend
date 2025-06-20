import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { Subject, takeUntil } from "rxjs"
import { AuthService } from "../../services/auth.service"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup
  loading = false
  hidePassword = true
  returnUrl = "/products"

  private destroy$ = new Subject<void>()

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.createForm()
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/products'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/products"

    // If user is already logged in, redirect
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl])
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ["", [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    })
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true

      const credentials = {
        email: this.loginForm.value.email.trim().toLowerCase(),
        password: this.loginForm.value.password,
      }

      this.authService
        .login(credentials)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.snackBar.open("Welcome back! Login successful.", "Close", {
              duration: 3000,
              panelClass: ["success-snackbar"],
            })
            this.router.navigate([this.returnUrl])
          },
          error: (error) => {
            this.loading = false
            let errorMessage = "Login failed. Please check your credentials."

            if (error.status === 401) {
              errorMessage = "Invalid email or password. Please try again."
            } else if (error.status === 429) {
              errorMessage = "Too many login attempts. Please try again later."
            } else if (error.status === 0) {
              errorMessage = "Unable to connect to server. Please check your internet connection."
            }

            this.snackBar.open(errorMessage, "Close", {
              duration: 7000,
              panelClass: ["error-snackbar"],
            })
          },
        })
    } else {
      this.markFormGroupTouched()
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key)
      control?.markAsTouched()
    })
  }

  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName)

    if (!control || !control.errors || !control.touched) {
      return ""
    }

    const errors = control.errors

    switch (fieldName) {
      case "email":
        if (errors["required"]) return "Email address is required"
        if (errors["email"]) return "Please enter a valid email address"
        if (errors["maxlength"]) return "Email address is too long"
        break

      case "password":
        if (errors["required"]) return "Password is required"
        if (errors["minlength"]) return "Password must be at least 6 characters"
        break
    }

    return "Invalid input"
  }

  hasFieldError(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName)
    return !!(control && control.errors && control.touched)
  }

  navigateToRegister(): void {
    this.router.navigate(["/register"])
  }

  navigateToForgotPassword(): void {
    // TODO: Implement forgot password functionality
    this.snackBar.open("Forgot password feature coming soon!", "Close", {
      duration: 3000,
    })
  }

  getFieldDescribedBy(fieldName: string): string {
    return this.hasFieldError(fieldName) ? `${fieldName}-error` : '';
  }
}
