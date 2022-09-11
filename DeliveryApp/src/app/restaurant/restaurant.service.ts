import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from '../restaurants/restaurant';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class RestaurantService{

  constructor(private http: HttpClient) {
  }

  loadOwnerRestaurants(): Observable<Restaurant[]>{
    return this.http.get<Restaurant[]>(environment.baseUrl + '/Delivery/ownerRestaurants');
  }
  
}
