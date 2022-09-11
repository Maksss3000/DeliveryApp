import { Component, OnInit } from '@angular/core';
import { Product } from '../products/product';
import { Restaurant } from '../restaurants/restaurant';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from "@angular/router";
import { RestaurantService } from '../restaurant/restaurant.service';
@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {

  constructor(private http: HttpClient, private restServ: RestaurantService) { }

  restaurants?: Restaurant[];
  name?: string;

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getOwnerRestaurants();
  }

  getOwnerRestaurants() {
    this.restServ.loadOwnerRestaurants().subscribe(result => {
      this.restaurants = result;
    }, error => {
      console.log(error);
    })
  }
}
