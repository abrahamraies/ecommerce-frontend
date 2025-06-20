import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"
import { LoginComponent } from "./components/login/login.component"
import { RegisterComponent } from "./components/register/register.component"
import { ProductListComponent } from "./components/product-list/product-list.component"
//import { ProductDetailComponent } from "./components/product-detail/product-detail.component"
import { CartComponent } from "./components/cart/cart.component"
import { AdminDashboardComponent } from "./components/admin/admin-dashboard.component"
import { AdminGuard } from "./guards/admin.guard"

const routes: Routes = [
  { path: "", redirectTo: "/products", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "products", component: ProductListComponent },
  // { path: "products/:id", component: ProductDetailComponent },
  { path: "cart", component: CartComponent },
  { path: "admin", component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: "**", redirectTo: "/products" },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
