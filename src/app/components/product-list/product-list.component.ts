import { Component, type OnInit } from "@angular/core"
import  { Router } from "@angular/router"
import  { MatSnackBar } from "@angular/material/snack-bar"
import type { Product } from "../../models/product.model"
import  { ProductService } from "../../services/product.service"
import  { CartService } from "../../services/cart.service"

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
})
export class ProductListComponent implements OnInit {
  products: Product[] = []
  filteredProducts: Product[] = []
  loading = true
  searchTerm = ""
  sortBy = "title"
  sortOrder = "asc"

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadProducts()
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products
        this.filteredProducts = [...products]
        this.loading = false
        this.applyFilters()
      },
      error: (error) => {
        console.error("Error loading products:", error)
        this.loading = false
        this.snackBar
          .open("Error loading products", "Retry", { duration: 3000 })
          .onAction()
          .subscribe(() => this.loadProducts())
      },
    })
  }

  onSearchChange(): void {
    this.applyFilters()
  }

  onSortChange(): void {
    this.applyFilters()
  }

  applyFilters(): void {
    let filtered = [...this.products]

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) => product.title.toLowerCase().includes(term) || product.description.toLowerCase().includes(term),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[this.sortBy as keyof Product]
      let bValue: any = b[this.sortBy as keyof Product]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (this.sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    this.filteredProducts = filtered
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation()
    this.cartService.addToCart(product)
    this.snackBar
      .open(`${product.title} added to cart!`, "View Cart", {
        duration: 2000,
      })
      .onAction()
      .subscribe(() => {
        this.router.navigate(["/cart"])
      })
  }

  viewProduct(product: Product): void {
    this.router.navigate(["/products", product.id])
  }
}
