import { Component, OnInit } from '@angular/core';
import { Product } from './product';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

 constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) { }

  restId?: number;
  products!: Product[];
  env = environment;
  restName?: string;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {

    var id = this.activatedRoute.snapshot.paramMap.get('id');
    this.restId = id ? +id : 0;

    this.http.get<Product[]>(environment.baseUrl + '/Delivery/products/' + this.restId).subscribe(result => {
      result.map(res => {
        res.img = this.env.imgUrl + '/' + res.img;
      })
      this.restName = result[0].restaurantName;
      this.products = result;
     
    }, error => console.error(error));

  }
}


