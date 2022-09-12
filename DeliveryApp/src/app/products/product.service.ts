import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ProductService {

  constructor(private http: HttpClient) {
  }

  loadRestaurantProducts(restId:number): Observable<Product[]> {
    return this.http.get<Product[]>(environment.baseUrl + '/Delivery/products/' + restId);
  }

  getProduct(id: number): Observable<Product>{
    return this.http.get<Product>(environment.baseUrl + '/Delivery/product/' + id);
  }

  updateProduct(formData: FormData, params: HttpParams): Observable<Product>{
    return this.http.put<Product>(environment.baseUrl + '/Delivery/editProd', formData, { params })
  }

  addProduct(formData: FormData): Observable<Product>{
    return this.http.post<Product>(environment.baseUrl + '/Delivery/addProd', formData);
  }

  deleteProduct(params: HttpParams): Observable<any> {
    return this.http.delete(environment.baseUrl + '/Delivery/deleteProd', { params });
  }
}
