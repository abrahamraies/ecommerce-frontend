import { Component, type OnInit, HostListener, type OnDestroy } from "@angular/core"
import  { Router } from "@angular/router"
import  { AuthService } from "./services/auth.service"
import  { CartService } from "./services/cart.service"
import  { ThemeService } from "./shared/services/theme.service"
import type { User } from "./models/user.model"
import { Subject, takeUntil } from "rxjs"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "Digital Store"
  currentUser: User | null = null
  cartItemCount = 0
  isScrolled = false
  currentTheme = "light"

  private destroy$ = new Subject<void>()

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private themeService: ThemeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.currentUser = user
    })

    // Subscribe to cart changes
    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe((cart) => {
      this.cartItemCount = cart.items.reduce((count, item) => count + item.quantity, 0)
    })

    // Subscribe to theme changes
    this.themeService.theme$.pipe(takeUntil(this.destroy$)).subscribe((theme) => {
      this.currentTheme = theme
      console.log("App component received theme change:", theme)
    })

    // Initialize theme
    this.currentTheme = this.themeService.getCurrentTheme()
    console.log("App component initialized with theme:", this.currentTheme)
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(): void {
    this.isScrolled = window.pageYOffset > 10
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/"])
  }

  // Debug method to check theme state
  debugTheme(): void {
    console.log("Current theme:", this.themeService.getCurrentTheme())
    console.log("Is dark theme:", this.themeService.isDarkTheme())
    console.log("Body classes:", document.body.classList.toString())
    console.log("HTML classes:", document.documentElement.classList.toString())
  }
}
