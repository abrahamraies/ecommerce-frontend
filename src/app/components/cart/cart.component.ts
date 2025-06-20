import { Component, type OnInit } from "@angular/core"
import  { Router } from "@angular/router"
import  { MatSnackBar } from "@angular/material/snack-bar"
import type { Cart } from "../../models/cart.model"
import  { CartService } from "../../services/cart.service"
import  { CheckoutService } from "../../services/checkout.service"
import  { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [], total: 0 }
  loading = false

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart
    })
  }

  updateQuantity(productId: number, event: Event): void {
    const target = event.target as HTMLInputElement
    const quantity = Number.parseInt(target.value, 10)

    if (quantity && quantity > 0) {
      this.cartService.updateQuantity(productId, quantity)
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId)
    this.snackBar.open("Item removed from cart", "Close", { duration: 2000 })
  }

  clearCart(): void {
    this.cartService.clearCart()
    this.snackBar.open("Cart cleared", "Close", { duration: 2000 })
  }

  checkout(): void {
    if (!this.authService.isAuthenticated()) {
      this.snackBar
        .open("Please login to checkout", "Login", { duration: 3000 })
        .onAction()
        .subscribe(() => {
          this.router.navigate(["/login"])
        })
      return
    }

    if (this.cart.items.length === 0) {
      return
    }

    // For simplicity, checkout first item only
    const firstItem = this.cart.items[0]
    this.loading = true

    const successUrl = `${window.location.origin}/checkout/success`
    const cancelUrl = `${window.location.origin}/cart`

    this.checkoutService.createCheckoutSession(firstItem.product.id, successUrl, cancelUrl).subscribe({
      next: (response) => {
        window.location.href = response.sessionUrl
      },
      error: (error) => {
        console.error("Checkout error:", error)
        this.snackBar.open("Checkout failed. Please try again.", "Close", { duration: 3000 })
        this.loading = false
      },
    })
  }
}
