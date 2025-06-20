import { Injectable } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"
import { HttpErrorResponse } from "@angular/common/http"

export interface ErrorConfig {
  duration?: number
  action?: string
  panelClass?: string[]
}

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: any, customMessage?: string, config: ErrorConfig = {}): void {
    const defaultConfig: ErrorConfig = {
      duration: 7000,
      action: "Close",
      panelClass: ["error-snackbar"],
    }

    const finalConfig = { ...defaultConfig, ...config }
    const message = customMessage || this.getErrorMessage(error)

    this.snackBar.open(message, finalConfig.action, {
      duration: finalConfig.duration,
      panelClass: finalConfig.panelClass,
    })
  }

  showSuccess(message: string, config: ErrorConfig = {}): void {
    const defaultConfig: ErrorConfig = {
      duration: 3000,
      action: "Close",
      panelClass: ["success-snackbar"],
    }

    const finalConfig = { ...defaultConfig, ...config }

    this.snackBar.open(message, finalConfig.action, {
      duration: finalConfig.duration,
      panelClass: finalConfig.panelClass,
    })
  }

  showWarning(message: string, config: ErrorConfig = {}): void {
    const defaultConfig: ErrorConfig = {
      duration: 5000,
      action: "Close",
      panelClass: ["warning-snackbar"],
    }

    const finalConfig = { ...defaultConfig, ...config }

    this.snackBar.open(message, finalConfig.action, {
      duration: finalConfig.duration,
      panelClass: finalConfig.panelClass,
    })
  }

  showInfo(message: string, config: ErrorConfig = {}): void {
    const defaultConfig: ErrorConfig = {
      duration: 4000,
      action: "Close",
      panelClass: ["info-snackbar"],
    }

    const finalConfig = { ...defaultConfig, ...config }

    this.snackBar.open(message, finalConfig.action, {
      duration: finalConfig.duration,
      panelClass: finalConfig.panelClass,
    })
  }

  private getErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          return "Unable to connect to server. Please check your internet connection."
        case 400:
          return error.error?.message || "Bad request. Please check your input."
        case 401:
          return "Authentication failed. Please log in again."
        case 403:
          return "You do not have permission to perform this action."
        case 404:
          return "The requested resource was not found."
        case 409:
          return "A conflict occurred. The resource may already exist."
        case 422:
          return "Validation failed. Please check your input."
        case 429:
          return "Too many requests. Please try again later."
        case 500:
          return "Internal server error. Please try again later."
        case 502:
          return "Bad gateway. The server is temporarily unavailable."
        case 503:
          return "Service unavailable. Please try again later."
        default:
          return error.error?.message || `An error occurred (${error.status})`
      }
    }

    if (error?.message) {
      return error.message
    }

    return "An unexpected error occurred. Please try again."
  }
}
