import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { RestaurantAddComponent } from './restaurant/restaurant-add.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: "full" },
  { path: "restaurants", component: RestaurantsComponent },
  { path: "restaurants/:id", component: RestaurantsComponent },
  { path: "restaurant", component:  RestaurantAddComponent },
  { path: "categories", component: CategoriesComponent },
  { path: "products/:id", component: ProductsComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
