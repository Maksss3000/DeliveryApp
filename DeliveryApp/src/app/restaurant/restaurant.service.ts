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

  addRestaurant(formData: FormData): Observable<Restaurant> {
    return this.http.post<Restaurant>(environment.baseUrl + '/Delivery/addRest', formData);
  }

  editRestaurant(formData: FormData, params: HttpParams): Observable<Restaurant>{
    return this.http.put<Restaurant>(environment.baseUrl + '/Delivery/editRest', formData, { params });
  }

  deleteRestaurant(params: HttpParams): Observable<any>{
    return this.http.delete(environment.baseUrl + '/Delivery/deleteRest', { params });
  }
}
