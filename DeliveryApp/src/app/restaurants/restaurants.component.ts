import { Component, HostBinding, OnInit } from '@angular/core';
import { Restaurant } from './restaurant';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ActivatedRoute} from "@angular/router";
import { RestaurantService } from '../restaurant/restaurant.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss']
})
export class RestaurantsComponent implements OnInit {

  public restaurants!: Restaurant[];
  public env = environment;
  public raiting: number = 0;

  public id?: number;

  constructor(private http: HttpClient,
              private activatedRoute: ActivatedRoute,
              private restServ: RestaurantService) { }

  ngOnInit(): void {

    this.loadRestaurants();
  }


  loadRestaurants() {
    //retrieve the ID from the 'id' parameter
    //that can be  passed by url in categories.component.html(a link)

    var catId = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = catId ? +catId : 0;

      
     //We will get all Restaurants if we didn`t passed any id(category Id) OR
    //Restaurant of Specific Category.
  
    this.restServ.loadRestaurants(this.id).subscribe(result => {
        result.map(res => {
          res.stars = Math.floor(res.raiting);
          res.image = this.env.imgUrl + '/Restaurants/' + res.image;
        })
        this.restaurants = result;
      }, error => console.error(error));
    
    //Getting All of Existed Restaurants
    /*
    else {
      this.http.get<Restaurant[]>(environment.baseUrl + '/Delivery/restaurants/').subscribe(result => {
        result.map(res => {
          res.stars = Math.floor(res.raiting);
          res.image = this.env.imgUrl + '/' + res.image;
        })
        this.restaurants = result;
      }, error => console.error(error));
    }
    */
   

  }


}
