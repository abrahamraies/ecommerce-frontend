import { Component, type OnInit } from "@angular/core"
import  { ActivatedRoute, Router } from "@angular/router"
import  { MatSnackBar } from "@angular/material/snack-bar"
import type { Product } from "../../models/product.model"
import  { ProductService } from "../../services/product.service"
import  { CartService } from "../../services/cart.service"
import  { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.css"],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null
  loading = true
  error = ""
  isAuthenticated = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated()

    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.loadProduct(Number.parseInt(id, 10))
    }
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product
        this.loading = false
      },
      error: (error) => {
        this.error = "Product not found"
        this.loading = false
      },
    })
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product)
      this.snackBar
        .open("Product added to cart!", "View Cart", {
          duration: 3000,
        })
        .onAction()
        .subscribe(() => {
          this.router.navigate(["/cart"])
        })
    }
  }

  buyNow(): void {
    if (this.product) {
      this.addToCart()
      this.router.navigate(["/cart"])
    }
  }

  goBack(): void {
    this.router.navigate(["/products"])
  }
}
