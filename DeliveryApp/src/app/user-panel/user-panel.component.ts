import { Component, OnInit } from '@angular/core';
import { Product } from '../products/product';
import { Restaurant } from '../restaurants/restaurant';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ActivatedRoute ,Router} from "@angular/router";
import { RestaurantService } from '../restaurant/restaurant.service';
import { AuthService } from '../auth/auth.service';
import { ProductService } from '../products/product.service';
@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {

  constructor(private http: HttpClient, private restServ: RestaurantService,
              private authServ: AuthService, private router: Router,
              private prodServ: ProductService) { }

  restaurants?: Restaurant[];
  products?: Product[];
  name?: string;
  status: boolean=false;
  title: string = "";

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getOwnerRestaurants();
  }

  getOwnerRestaurants() {
    this.restServ.loadOwnerRestaurants().subscribe(result => {
      this.restaurants = result;
      this.title = "Restaurants";
      this.status = false;
    }, error => {
      console.log(error);
    })
  }

  loadProducts(id: number) {
    this.prodServ.loadRestaurantProducts(id).subscribe(result => {
      result.map(prod => { prod.restaurantId=id })
      this.products = result;
      this.title = "Products";
      this.status = true;
    }, error => {
      console.log(error);
    })
  }

  deleteRestaurant(id: number) {
    var params = new HttpParams().set("id", id).set("securityId", id);
    this.restServ.deleteRestaurant(params).subscribe(result => {
      this.getOwnerRestaurants();
    }, error => {
      console.log(error);
    })
  }
  deleteProduct(id: number, restId: number) {
    
    var params = new HttpParams().set("id", id).set("securityId", restId);
    this.prodServ.deleteProduct(params).subscribe(result => {
      this.loadProducts(restId);
    }, error => {
      console.log(error);
    })
  }
  logout() {
    this.authServ.logout();
    this.router.navigate(['/login']);
  }
}
