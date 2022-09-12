import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from '../restaurants/restaurant';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class RestaurantService {

  constructor(private http: HttpClient) {
  }

  loadOwnerRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(environment.baseUrl + '/Delivery/ownerRestaurants');
  }

  ////We will get all Restaurants if we didn`t passed any id(category Id) OR
  //Restaurant of Specific Category. 
  loadRestaurants(id:number): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(environment.baseUrl + '/Delivery/restaurants/' +id);
  }

  getRestaurant(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(environment.baseUrl + '/Delivery/restaurant/' + id);
  }

  editRestaurant(formData: FormData, params: HttpParams): Observable<Restaurant>{
    return this.http.put<Restaurant>(environment.baseUrl + '/Delivery/editRest', formData, { params });
  }

  addRestaurant(formData: FormData): Observable<Restaurant> {
    return this.http.post<Restaurant>(environment.baseUrl + '/Delivery/addRest', formData);
  }

}
