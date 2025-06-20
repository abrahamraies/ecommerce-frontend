import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { ReactiveFormsModule, FormsModule } from "@angular/forms"

// Angular Material
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatBadgeModule } from "@angular/material/badge"
import { MatMenuModule } from "@angular/material/menu"
import { MatTableModule } from "@angular/material/table"
import { MatDialogModule } from "@angular/material/dialog"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { MatSelectModule } from "@angular/material/select"
import { MatDividerModule } from "@angular/material/divider"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatCheckboxModule } from "@angular/material/checkbox"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { LoginComponent } from "./components/login/login.component"
import { RegisterComponent } from "./components/register/register.component"
import { ProductListComponent } from "./components/product-list/product-list.component"
import { ProductDetailComponent } from "./components/product-detail/product-detail.component"
import { CartComponent } from "./components/cart/cart.component"
import { AdminDashboardComponent } from "./components/admin/admin-dashboard.component"
import { AuthInterceptor } from "./interceptors/auth.interceptor"
import { FormFieldComponent } from "./shared/components/form-field/form-field.component"
import { LoadingButtonComponent } from "./shared/components/loading-button/loading-button.component"
import { LoadingOverlayComponent } from "./shared/components/loading-overlay/loading-overlay.component"
import { ThemeToggleComponent } from "./shared/components/theme-toggle/theme-toggle.component"

// Import theme service to ensure it's initialized
import { ThemeService } from "./shared/services/theme.service"

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProductListComponent,
    ProductDetailComponent,
    CartComponent,
    AdminDashboardComponent,
    FormFieldComponent,
    LoadingButtonComponent,
    LoadingOverlayComponent,
    ThemeToggleComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatMenuModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatCheckboxModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    ThemeService, // Explicitly provide ThemeService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private themeService: ThemeService) {
    // Initialize theme service on app startup
    console.log("App module initialized, theme service ready")
  }
}
