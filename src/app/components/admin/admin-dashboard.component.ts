import { Component, type OnInit } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { MatSnackBar } from "@angular/material/snack-bar"
import type { Product } from "../../models/product.model"
import { ProductService } from "../../services/product.service"

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = []
  displayedColumns: string[] = ["id", "title", "price", "isActive", "createdAt", "actions"]
  loading = true

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.loadProducts()
  }

  loadProducts(): void {
    this.productService.getAllProductsAdmin().subscribe({
      next: (products) => {
        this.products = products
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading products:", error)
        this.loading = false
      },
    })
  }

  deleteProduct(id: number): void {
    if (confirm("Are you sure you want to delete this product?")) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter((p) => p.id !== id)
          this.snackBar.open("Product deleted successfully", "Close", { duration: 3000 })
        },
        error: (error) => {
          console.error("Error deleting product:", error)
          this.snackBar.open("Error deleting product", "Close", { duration: 3000 })
        },
      })
    }
  }
}
