import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Product, CreateProduct, UpdateProduct } from "../models/product.model"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private readonly API_URL = `${environment.apiUrl}/api`

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products`)
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/${id}`)
  }

  getDownloadUrl(id: number): Observable<{ downloadUrl: string }> {
    return this.http.get<{ downloadUrl: string }>(`${this.API_URL}/products/${id}/download`)
  }

  // Admin methods
  getAllProductsAdmin(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/admin/products`)
  }

  createProduct(product: CreateProduct): Observable<Product> {
    const formData = new FormData()
    formData.append("title", product.title)
    formData.append("description", product.description)
    formData.append("price", product.price.toString())
    formData.append("file", product.file)

    if (product.image) {
      formData.append("image", product.image)
    }

    return this.http.post<Product>(`${this.API_URL}/admin/products`, formData)
  }

  updateProduct(id: number, product: UpdateProduct): Observable<Product> {
    const formData = new FormData()
    formData.append("title", product.title)
    formData.append("description", product.description)
    formData.append("price", product.price.toString())
    formData.append("isActive", product.isActive.toString())

    if (product.file) {
      formData.append("file", product.file)
    }

    if (product.image) {
      formData.append("image", product.image)
    }

    return this.http.put<Product>(`${this.API_URL}/admin/products/${id}`, formData)
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/admin/products/${id}`)
  }
}
