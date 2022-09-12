import { Component, OnInit } from '@angular/core';
import { Product } from '../products/product';
import { Restaurant } from '../restaurants/restaurant';
import { HttpClient } from '@angular/common/http';
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

  loadProducts(id:number) {
    this.prodServ.loadRestaurantProducts(id).subscribe(result => {
      this.products = result;
      this.title = "Products";
      this.status = true;
    }, error => {
      console.log(error);
    })
  }

  logout() {
    this.authServ.logout();
    this.router.navigate(['/login']);
  }
}
