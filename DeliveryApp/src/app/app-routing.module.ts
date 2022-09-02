import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { RestaurantAddComponent } from './restaurant/restaurant-add.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { ProductAddComponent } from './products/product-add.component';

import { RegistrationComponent } from './auth/registration/registration.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: "full" },
  { path: "restaurants", component: RestaurantsComponent },
  { path: "restaurants/:id", component: RestaurantsComponent },
  { path: "restaurant", component: RestaurantAddComponent },
  { path: "restaurant/:id", component: RestaurantAddComponent },
  { path: "categories", component: CategoriesComponent },
  { path: "products/:id", component: ProductsComponent },
  { path: "product", component: ProductAddComponent },
  { path: "product/:id", component: ProductAddComponent },

  { path: "registration", component: RegistrationComponent },
  { path: "login", component: LoginComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
