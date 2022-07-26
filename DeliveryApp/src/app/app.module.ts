import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';

import { AppRoutingModule } from './app-routing.module';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { CategoriesComponent } from './categories/categories.component';

import { FormsModule } from '@angular/forms';
import { ProductsComponent } from './products/products.component';
import { RestaurantAddComponent } from './restaurant/restaurant-add.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NoDataComponent } from './no-data/no-data.component';
import { ProductAddComponent } from './products/product-add.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { UserPanelComponent } from './user-panel/user-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    RestaurantsComponent,
    CategoriesComponent,
    ProductsComponent,
    RestaurantAddComponent,
    NoDataComponent,
    ProductAddComponent,
    RegistrationComponent,
    LoginComponent,
    UserPanelComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, AppRoutingModule, FormsModule, ReactiveFormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
