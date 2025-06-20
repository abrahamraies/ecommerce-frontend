import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import type { Cart } from "../models/cart.model"
import type { Product } from "../models/product.model"

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({ items: [], total: 0 })
  public cart$ = this.cartSubject.asObservable()

  constructor() {
    this.loadCartFromStorage()
  }

  addToCart(product: Product): void {
    const currentCart = this.cartSubject.value
    const existingItem = currentCart.items.find((item) => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      currentCart.items.push({ product, quantity: 1 })
    }

    this.updateCart(currentCart)
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value
    currentCart.items = currentCart.items.filter((item) => item.product.id !== productId)
    this.updateCart(currentCart)
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartSubject.value
    const item = currentCart.items.find((item) => item.product.id === productId)

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId)
      } else {
        item.quantity = quantity
        this.updateCart(currentCart)
      }
    }
  }

  clearCart(): void {
    this.updateCart({ items: [], total: 0 })
  }

  getCartItemCount(): number {
    return this.cartSubject.value.items.reduce((count, item) => count + item.quantity, 0)
  }

  private updateCart(cart: Cart): void {
    cart.total = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
    this.cartSubject.next(cart)
    this.saveCartToStorage(cart)
  }

  private saveCartToStorage(cart: Cart): void {
    localStorage.setItem("cart", JSON.stringify(cart))
  }

  private loadCartFromStorage(): void {
    const cartJson = localStorage.getItem("cart")
    if (cartJson) {
      const cart = JSON.parse(cartJson)
      this.cartSubject.next(cart)
    }
  }
}
