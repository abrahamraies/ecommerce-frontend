import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class CheckoutService {
  private readonly API_URL = `${environment.apiUrl}/api/checkout`

  constructor(private http: HttpClient) {}

  createCheckoutSession(productId: number, successUrl: string, cancelUrl: string): Observable<{ sessionUrl: string }> {
    return this.http.post<{ sessionUrl: string }>(`${this.API_URL}/create-session`, {
      productId,
      successUrl,
      cancelUrl,
    })
  }
}
