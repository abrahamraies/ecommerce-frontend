import { Component, type OnInit, type OnDestroy } from "@angular/core"
import {  FormBuilder, type FormGroup, Validators, type AbstractControl } from "@angular/forms"
import  { Router } from "@angular/router"
import { Subject, takeUntil } from "rxjs"
import  { AuthService } from "../../services/auth.service"
import  { MatSnackBar } from "@angular/material/snack-bar"

// Custom validator for password confirmation
function passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get("password")
  const confirmPassword = control.get("confirmPassword")

  if (!password || !confirmPassword) {
    return null
  }

  return password.value === confirmPassword.value ? null : { passwordMismatch: true }
}

// Custom validator for strong password
function strongPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value

  if (!value) {
    return null
  }

  const hasNumber = /[0-9]/.test(value)
  const hasUpper = /[A-Z]/.test(value)
  const hasLower = /[a-z]/.test(value)
  const hasSpecial = /[#?!@$%^&*-]/.test(value)

  const valid = hasNumber && hasUpper && hasLower && hasSpecial && value.length >= 8

  return valid ? null : { weakPassword: true }
}

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup
  loading = false
  hidePassword = true
  hideConfirmPassword = true

  private destroy$ = new Subject<void>()

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.registerForm = this.createForm()
  }

  ngOnInit(): void {
    // Add form value changes subscription for real-time validation feedback
    this.registerForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updatePasswordStrength()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private createForm(): FormGroup {
    return this.fb.group(
      {
        firstName: [
          "",
          [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]*$/)],
        ],
        lastName: [
          "",
          [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]*$/)],
        ],
        email: ["", [Validators.required, Validators.email, Validators.maxLength(100)]],
        password: ["", [Validators.required, strongPasswordValidator]],
        confirmPassword: ["", [Validators.required]],
        acceptTerms: [false, [Validators.requiredTrue]],
      },
      { validators: passwordMatchValidator },
    )
  }

  isPasswordFieldTouched(): boolean {
    const passwordControl = this.registerForm.get("password")
    return !!(passwordControl && passwordControl.touched && passwordControl.dirty)
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.loading) {
      this.loading = true

      const formData = {
        firstName: this.registerForm.value.firstName.trim(),
        lastName: this.registerForm.value.lastName.trim(),
        email: this.registerForm.value.email.trim().toLowerCase(),
        password: this.registerForm.value.password,
      }

      this.authService
        .register(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.snackBar.open("Registration successful! Welcome to our platform.", "Close", {
              duration: 5000,
              panelClass: ["success-snackbar"],
            })
            this.router.navigate(["/products"])
          },
          error: (error) => {
            this.loading = false
            let errorMessage = "Registration failed. Please try again."

            if (error.status === 400) {
              errorMessage = "Email already exists. Please use a different email address."
            } else if (error.status === 422) {
              errorMessage = "Please check your input and try again."
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
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key)
      control?.markAsTouched()
    })
  }

  getFieldError(fieldName: string): string {
    const control = this.registerForm.get(fieldName)

    if (!control || !control.errors || !control.touched) {
      return ""
    }

    const errors = control.errors

    switch (fieldName) {
      case "firstName":
      case "lastName":
        if (errors["required"]) return `${fieldName === "firstName" ? "First" : "Last"} name is required`
        if (errors["minlength"])
          return `${fieldName === "firstName" ? "First" : "Last"} name must be at least 2 characters`
        if (errors["maxlength"])
          return `${fieldName === "firstName" ? "First" : "Last"} name cannot exceed 50 characters`
        if (errors["pattern"])
          return `${fieldName === "firstName" ? "First" : "Last"} name can only contain letters and spaces`
        break

      case "email":
        if (errors["required"]) return "Email address is required"
        if (errors["email"]) return "Please enter a valid email address"
        if (errors["maxlength"]) return "Email address cannot exceed 100 characters"
        break

      case "password":
        if (errors["required"]) return "Password is required"
        if (errors["weakPassword"])
          return "Password must contain at least 8 characters with uppercase, lowercase, number, and special character"
        break

      case "confirmPassword":
        if (errors["required"]) return "Please confirm your password"
        if (this.registerForm.errors?.["passwordMismatch"]) return "Passwords do not match"
        break

      case "acceptTerms":
        if (errors["required"]) return "You must accept the terms and conditions"
        break
    }

    return "Invalid input"
  }

  hasFieldError(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName)
    return !!(control && control.errors && control.touched)
  }

  getPasswordStrength(): number {
    const password = this.registerForm.get("password")?.value || ""
    let strength = 0

    if (password.length >= 8) strength += 20
    if (/[a-z]/.test(password)) strength += 20
    if (/[A-Z]/.test(password)) strength += 20
    if (/[0-9]/.test(password)) strength += 20
    if (/[#?!@$%^&*-]/.test(password)) strength += 20

    return strength
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength()

    if (strength < 40) return "Weak"
    if (strength < 80) return "Medium"
    return "Strong"
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength()

    if (strength < 40) return "warn"
    if (strength < 80) return "accent"
    return "primary"
  }

  private updatePasswordStrength(): void {
    // This method can be used to trigger UI updates for password strength
    // The template will automatically update based on the getter methods
  }

  navigateToLogin(): void {
    this.router.navigate(["/login"])
  }
}
